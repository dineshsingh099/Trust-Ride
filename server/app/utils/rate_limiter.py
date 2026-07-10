import time
import threading
from fastapi import Request, HTTPException, status


class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = float(capacity)
        self.last_refill = time.monotonic()
        self.lock = threading.Lock()

    def consume(self, amount: int = 1) -> bool:
        with self.lock:
            now = time.monotonic()
            elapsed = now - self.last_refill
            self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
            self.last_refill = now
            if self.tokens >= amount:
                self.tokens -= amount
                return True
            return False


class TokenBucketRegistry:
    def __init__(self):
        self._buckets: dict[str, TokenBucket] = {}
        self._lock = threading.Lock()

    def get_bucket(self, key: str, capacity: int, refill_rate: float) -> TokenBucket:
        with self._lock:
            bucket = self._buckets.get(key)
            if bucket is None:
                bucket = TokenBucket(capacity, refill_rate)
                self._buckets[key] = bucket
            return bucket


registry = TokenBucketRegistry()


def rate_limit(capacity: int, per_seconds: float):
    refill_rate = capacity / per_seconds

    def dependency(request: Request):
        client_ip = request.client.host if request.client else "unknown"
        key = f"{request.url.path}:{client_ip}"
        bucket = registry.get_bucket(key, capacity, refill_rate)
        if not bucket.consume():
            raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, "Too many requests, please try again later")

    return dependency
