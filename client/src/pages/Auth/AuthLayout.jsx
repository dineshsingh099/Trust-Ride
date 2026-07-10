import { Link } from "react-router-dom";
import LogoIcon from "../../assets/images/logo-icon.png";
import "./AuthLayout.css";

export default function AuthLayout({
	eyebrow,
	title,
	subtitle,
	children,
	footer,
}) {
	return (
		<div className="auth-shell">
			<div className="auth-card">
				<Link to="/" className="auth-brand">
					<img src={LogoIcon} alt="Trust Ride" className="auth-logo" />
					<span>Trust Ride</span>
				</Link>
				{eyebrow && <span className="auth-eyebrow">{eyebrow}</span>}
				<h2 className="auth-title">{title}</h2>
				{subtitle && <p className="auth-subtitle">{subtitle}</p>}
				<div className="auth-body">{children}</div>
				{footer && <div className="auth-footer">{footer}</div>}
			</div>
		</div>
	);
}
