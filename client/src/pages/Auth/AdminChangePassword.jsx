import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import { changeAdminPassword } from "../../api/adminApi";

export default function AdminChangePassword() {
	const navigate = useNavigate();
	const [form, setForm] = useState({ old_password: "", new_password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await changeAdminPassword(form.old_password, form.new_password);
			navigate("/admin/dashboard");
		} catch (err) {
			setError(err.response?.data?.detail || "Unable to change password.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthLayout
			eyebrow="Admin settings"
			title="Change your password"
			subtitle="Enter your current password and choose a new one."
		>
			<Alert type="error">{error}</Alert>
			<form onSubmit={handleSubmit}>
				<Input
					label="Current password"
					type="password"
					name="old_password"
					value={form.old_password}
					onChange={handleChange}
					required
				/>
				<Input
					label="New password"
					type="password"
					name="new_password"
					value={form.new_password}
					onChange={handleChange}
					minLength={8}
					required
				/>
				<Button type="submit" fullWidth loading={loading}>
					Update password
				</Button>
			</form>
		</AuthLayout>
	);
}
