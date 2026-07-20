import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./About.css";

export default function About() {
	return (
		<>
			<Navbar />

			<section className="about-hero">
				<span className="eyebrow">About Us</span>
				<h1>
					Built on <span>Trust</span>, Driven by You
				</h1>
				<p>
					Trust Ride is on a mission to make every journey safe, transparent and
					reliable, whether you are commuting to work, heading home late at
					night, or exploring a new city.
				</p>
			</section>

			<section className="about-story">
				<div className="story-text">
					<span className="eyebrow">Our Story</span>
					<h2>Started with a simple idea</h2>
					<p>
						Trust Ride began with a simple frustration, not knowing if the ride
						you booked was actually safe. We set out to build a platform where
						every driver is verified, every trip is tracked, and every rider
						feels confident stepping into a car, bike, auto, or scooter.
					</p>
					<p>
						We are putting the finishing touches on Trust Ride right now, built
						around verified drivers, real time tracking and a support team that
						genuinely cares, ready for our very first riders soon.
					</p>
				</div>
			</section>

			<section className="about-values">
				<span className="eyebrow center">Why Trust Ride</span>
				<h2 className="center">What we stand for</h2>

				<div className="values-grid">
					<div className="value-card">
						<div className="value-icon">01</div>
						<h3>Safety First</h3>
						<p>
							Every driver goes through document verification and background
							checks before they can accept a single ride.
						</p>
					</div>

					<div className="value-card">
						<div className="value-icon">02</div>
						<h3>Real Time Tracking</h3>
						<p>
							Share your live trip with family or friends and know exactly where
							you are at every moment of the journey.
						</p>
					</div>

					<div className="value-card">
						<div className="value-icon">03</div>
						<h3>Transparent Pricing</h3>
						<p>
							No hidden charges or surprise fees. You see the fare before you
							book, and that is exactly what you pay.
						</p>
					</div>

					<div className="value-card">
						<div className="value-icon">04</div>
						<h3>24/7 Support</h3>
						<p>
							Our support team is available around the clock to help with
							anything, from a lost item to an emergency on the road.
						</p>
					</div>
				</div>
			</section>

			<section className="about-cta">
				<h2>Ready to ride with confidence?</h2>
				<p>Be among the first to experience Trust Ride when we launch.</p>
				<div className="cta-btns">
					<button className="cta-primary">Get Early Access</button>
					<button className="cta-secondary">Contact Us</button>
				</div>
			</section>
		</>
	);
}
