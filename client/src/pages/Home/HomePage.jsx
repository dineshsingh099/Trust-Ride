import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { IconShield, IconUser, IconTruck } from "../../components/common/Icons";
import LogoIcon from "../../assets/images/logo-icon.png";
import "./HomePage.css";

export default function HomePage() {
	const navigate = useNavigate();
	const clickCount = useRef(0);
	const clickTimer = useRef(null);
	const [menuOpen, setMenuOpen] = useState(false);

	const handleLogoClick = () => {
		clickCount.current += 1;

		if (clickTimer.current) clearTimeout(clickTimer.current);

		clickTimer.current = setTimeout(() => {
			clickCount.current = 0;
		}, 900);

		if (clickCount.current === 3) {
			clickCount.current = 0;
			navigate("/admin/login");
		}
	};

	const handleNavLinkClick = () => {
		setMenuOpen(false);
	};

	return (
		<div className="home-page">
			<nav className="home-nav">
				<div className="home-nav-brand" onClick={handleLogoClick}>
					<img src={LogoIcon} alt="Trust Ride" className="home-logo" />
					<span className="home-brand-text">Trust Ride</span>
				</div>

				<div className="home-nav-links home-nav-links-desktop">
					<a href="#home" className="active">
						Home
					</a>
					<a href="#about">About</a>
					<a href="#services">Services</a>
					<a href="#safety">Safety</a>
					<a href="#contact">Contact</a>
				</div>

				<div className="home-nav-actions">
					<Button
						variant="ghost"
						size="sm"
						className="home-login-btn"
						onClick={() => navigate("/choose-role?intent=login")}
					>
						Sign In
					</Button>

					<Button
						variant="primary"
						size="sm"
						className="home-get-started-btn"
						onClick={() => navigate("/choose-role?intent=signup")}
					>
						Get started
					</Button>
				</div>

				<button
					className="home-nav-toggle"
					onClick={() => setMenuOpen(true)}
					aria-label="Open menu"
				>
					<i class="fa-solid fa-bars"></i>
				</button>
			</nav>

			{menuOpen && (
				<div className="home-nav-overlay" onClick={() => setMenuOpen(false)} />
			)}

			<div
				className={`home-nav-links home-nav-links-mobile ${menuOpen ? "open" : ""}`}
			>
				<button
					className="home-nav-close"
					onClick={() => setMenuOpen(false)}
					aria-label="Close menu"
				>
					<i class="fa-solid fa-x"></i>
					
				</button>

				<a href="#home" className="active" onClick={handleNavLinkClick}>
					Home
				</a>
				<a href="#about" onClick={handleNavLinkClick}>
					About
				</a>
				<a href="#services" onClick={handleNavLinkClick}>
					Services
				</a>
				<a href="#safety" onClick={handleNavLinkClick}>
					Safety
				</a>
				<a href="#contact" onClick={handleNavLinkClick}>
					Contact
				</a>

				<div className="home-nav-actions-mobile">
					<Button
						variant="ghost"
						size="sm"
						className="home-login-btn"
						onClick={() => {
							handleNavLinkClick();
							navigate("/choose-role?intent=login");
						}}
					>
						Sign In
					</Button>

					<Button
						variant="primary"
						size="sm"
						className="home-get-started-btn"
						onClick={() => {
							handleNavLinkClick();
							navigate("/choose-role?intent=signup");
						}}
					>
						Get started
					</Button>
				</div>
			</div>

			<section className="home-hero">
				<div className="hero-content">
					<span className="home-hero-eyebrow">
						Identity verification, done right
					</span>

					<h1 className="home-hero-title">
						One platform to verify every{" "}
						<span className="home-hero-accent">user, driver</span> and document
						that matters.
					</h1>

					<p className="home-hero-subtitle">
						Trust Ride handles OTP secured onboarding, driver document review
						and admin oversight in a single role based platform built for trust,
						safety and speed.
					</p>

					<div className="home-hero-actions">
						<Button
							variant="accent"
							size="lg"
							onClick={() => navigate("/choose-role?intent=signup")}
						>
							Create an account
						</Button>

						<Button
							variant="outline"
							size="lg"
							onClick={() => navigate("/choose-role?intent=login")}
						>
							I already have one
						</Button>
					</div>

					<div className="home-hero-cards">
						<div className="home-mini-card">
							<IconUser />
							<div>
								<div className="home-mini-title">Users</div>
								<div className="home-mini-text">
									OTP verified sign up and secure access.
								</div>
							</div>
						</div>

						<div className="home-mini-card">
							<IconTruck />
							<div>
								<div className="home-mini-title">Drivers</div>
								<div className="home-mini-text">
									Upload documents and complete verification.
								</div>
							</div>
						</div>

						<div className="home-mini-card">
							<IconShield />
							<div>
								<div className="home-mini-title">Admin</div>
								<div className="home-mini-text">
									Review, approve and manage every request.
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="hero-image">
					<svg viewBox="0 0 460 460" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<linearGradient id="hg1" x1="0" y1="0" x2="1" y2="1">
								<stop offset="0%" stopColor="#1cf5e4" />
								<stop offset="100%" stopColor="#08b9f0" />
							</linearGradient>
						</defs>
						<circle cx="230" cy="230" r="200" fill="url(#hg1)" opacity="0.08" />
						<circle cx="230" cy="230" r="150" fill="url(#hg1)" opacity="0.10" />
						<rect
							x="110"
							y="70"
							width="240"
							height="340"
							rx="28"
							fill="#0d1826"
							stroke="rgba(255,255,255,.08)"
						/>
						<rect
							x="132"
							y="100"
							width="196"
							height="120"
							rx="14"
							fill="#0b2435"
							stroke="rgba(25,242,223,.25)"
						/>
						<circle cx="230" cy="150" r="26" fill="url(#hg1)" />
						<path
							d="M218 150l8 8 16-16"
							stroke="#06131d"
							strokeWidth="5"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<rect
							x="150"
							y="195"
							width="160"
							height="10"
							rx="5"
							fill="rgba(255,255,255,.15)"
						/>
						<rect
							x="150"
							y="215"
							width="110"
							height="10"
							rx="5"
							fill="rgba(255,255,255,.10)"
						/>
						<rect
							x="132"
							y="242"
							width="196"
							height="46"
							rx="12"
							fill="#0b2435"
						/>
						<rect
							x="150"
							y="258"
							width="90"
							height="12"
							rx="6"
							fill="rgba(255,255,255,.15)"
						/>
						<rect
							x="132"
							y="300"
							width="196"
							height="46"
							rx="12"
							fill="#0b2435"
						/>
						<rect
							x="150"
							y="316"
							width="120"
							height="12"
							rx="6"
							fill="rgba(255,255,255,.15)"
						/>
						<circle
							cx="365"
							cy="120"
							r="34"
							fill="#0d1826"
							stroke="rgba(25,242,223,.3)"
						/>
						<path
							d="M352 120l9 9 18-18"
							stroke="#19f2df"
							strokeWidth="5"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<circle
							cx="95"
							cy="340"
							r="30"
							fill="#0d1826"
							stroke="rgba(25,242,223,.3)"
						/>
						<path
							d="M85 340h20M95 330v20"
							stroke="#19f2df"
							strokeWidth="4"
							strokeLinecap="round"
						/>
					</svg>
				</div>
			</section>

			<footer className="home-footer">
				<p>
					Trust Ride © {new Date().getFullYear()} — Built for trust at scale.
				</p>
			</footer>
		</div>
	);
}
