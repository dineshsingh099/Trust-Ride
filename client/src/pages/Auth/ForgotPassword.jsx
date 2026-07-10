import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import { forgotUserPassword } from "../../api/userApi";
import { forgotDriverPassword } from "../../api/driverApi";

export default function ForgotPassword() {
	const { role } = useParams();
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const isDriver = role === "driver";

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const { data } = isDriver
				? await forgotDriverPassword(email)
				: await forgotUserPassword(email);
			setMessage(data.message);
		} catch (err) {
			setError(err.response?.data?.detail || "Something went wrong.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthLayout
			eyebrow="Reset password"
			title="Forgot your password?"
			subtitle="Enter your email and we'll send you a reset link."
			footer={<Link to={`/${role}/login`}>Back to login</Link>}
		>
			<Alert type="error">{error}</Alert>
			<Alert type="success">{message}</Alert>
			<form onSubmit={handleSubmit}>
				<Input
					label="Email address"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@example.com"
					required
				/>
				<Button type="submit" fullWidth loading={loading}>
					Send reset link
				</Button>
			</form>
		</AuthLayout>
	);
}
