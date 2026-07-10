import { useNavigate, useSearchParams } from "react-router-dom";
import LogoIcon from "../../assets/images/logo-icon.png";
import HeroImage from "../../assets/images/hero-verification.webp";
import "./RoleSelect.css";

export default function RoleSelect() {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const intent = params.get("intent") === "login" ? "login" : "signup";

	return (
		<div className="role-page">
			<div className="role-shell">
				{/* Left side — image/branding panel */}
				<div className="role-panel-left">
					<div className="role-brand-top">
						<img src={LogoIcon} alt="Trust Ride" className="role-logo" />
						<span className="role-brand-name">Trust Ride</span>
					</div>

					<img
						src={HeroImage}
						alt="Trust Ride identity verification"
						className="role-left-illustration"
					/>

					<div className="role-left-text">
						<h2>Verified people, every time.</h2>
						<p>
							OTP security, document checks and admin review keep every account
							genuine.
						</p>
					</div>
				</div>

				{/* Right side — form panel */}
				<div className="role-panel-right">
					<div className="role-brand">
						<img src={LogoIcon} alt="Trust Ride" className="role-logo-sm" />
						<span className="role-brand-name">Trust Ride</span>
					</div>

					<h1 className="role-title">How will you use Trust Ride?</h1>
					<p className="role-subtitle">
						Choose the account type that matches you. Admins do not sign up
						here.
					</p>

					<div className="role-options">
						<button
							className="role-option"
							onClick={() => navigate(`/user/${intent}`)}
						>
							<span className="role-icon">
								<i className="fa-solid fa-user"></i>
							</span>
							<span className="role-option-body">
								<p className="role-option-title">I'm a User</p>
								<p className="role-option-text">
									Browse and use the platform's services
								</p>
							</span>
							<i className="fa-solid fa-arrow-right role-option-arrow"></i>
						</button>

						<button
							className="role-option"
							onClick={() => navigate(`/driver/${intent}`)}
						>
							<span className="role-icon">
								<i className="fa-solid fa-car"></i>
							</span>
							<span className="role-option-body">
								<p className="role-option-title">I'm a Driver</p>
								<p className="role-option-text">
									Onboard your vehicle and documents
								</p>
							</span>
							<i className="fa-solid fa-arrow-right role-option-arrow"></i>
						</button>
					</div>

					<button className="role-back" onClick={() => navigate("/")}>
						<i className="fa-solid fa-arrow-left"></i> Back to home
					</button>
				</div>
			</div>
		</div>
	);
}
