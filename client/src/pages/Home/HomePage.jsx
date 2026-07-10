import { useEffect,useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { IconShield, IconUser, IconTruck } from "../../components/common/Icons";
import LogoIcon from "../../assets/images/logo-icon.png";
import HeroImage from "../../assets/images/hero-verification.webp";
import "./HomePage.css";

export default function HomePage() {
	const navigate = useNavigate();
	const clickCount = useRef(0);
	const clickTimer = useRef(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const [activeSection, setActiveSection] = useState("home");
	
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

	const scrollToAbout = () => {
		const el = document.getElementById("about");
		if (el) el.scrollIntoView({ behavior: "smooth" });
	};
	
	useEffect(() => {
		const sections = document.querySelectorAll("section");

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id);
					}
				});
			},
			{
				threshold: 0.5,
			},
		);

		sections.forEach((section) => observer.observe(section));

		return () => observer.disconnect();
	}, []);

	return (
		<div className="home-page">
			<nav className="home-nav">
				<div className="home-nav-brand" onClick={handleLogoClick}>
					<img src={LogoIcon} alt="Trust Ride" className="home-logo" />
					<span className="home-brand-text">Trust Ride</span>
				</div>

				<div className="home-nav-links home-nav-links-desktop">
					<a href="#home" className={activeSection === "home" ? "active" : ""}>
						Home
					</a>
					<a
						href="#about"
						className={activeSection === "about" ? "active" : ""}
					>
						About
					</a>
					<a
						href="#services"
						className={activeSection === "services" ? "active" : ""}
					>
						Services
					</a>
					<a
						href="#safety"
						className={activeSection === "safety" ? "active" : ""}
					>
						Safety
					</a>
					<a
						href="#contact"
						className={activeSection === "contact" ? "active" : ""}
					>
						Contact
					</a>
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

				<a
					href="#home"
					className={activeSection === "home" ? "active" : ""}
					onClick={handleNavLinkClick}
				>
					Home
				</a>
				<a
					href="#about"
					className={activeSection === "about" ? "active" : ""}
					onClick={handleNavLinkClick}
				>
					About
				</a>
				<a
					href="#services"
					className={activeSection === "services" ? "active" : ""}
					onClick={handleNavLinkClick}
				>
					Services
				</a>
				<a
					href="#safety"
					className={activeSection === "safty" ? "active" : ""}
					onClick={handleNavLinkClick}
				>
					Safety
				</a>
				<a
					href="#contact"
					className={activeSection === "contact" ? "active" : ""}
					onClick={handleNavLinkClick}
				>
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

			<section className="home-hero" id="home">
				<div className="hero-content">
					<span className="home-hero-eyebrow">
						Trusted by riders, drivers and admins
					</span>

					<h1 className="home-hero-title">
						Every ride starts with{" "}
						<span className="home-hero-accent">real, verified</span> people.
					</h1>

					<p className="home-hero-subtitle">
						From OTP secured sign up to driver document checks and admin
						approvals, Trust Ride keeps every account genuine so you can book,
						drive and manage with confidence.
					</p>

					<div className="home-hero-actions">
						<Button
							variant="accent"
							size="lg"
							onClick={() => navigate("/choose-role?intent=signup")}
						>
							Start verifying
						</Button>

						<Button variant="outline" size="lg" onClick={scrollToAbout}>
							See how it works
						</Button>
					</div>

					<div className="hero-trust-bar">
						<div className="hero-trust-item">
							<IconShield />
							<span>Encrypted &amp; secure</span>
						</div>
						<div className="hero-trust-item">
							<IconUser />
							<span>Verified in minutes</span>
						</div>
						<div className="hero-trust-item">
							<IconTruck />
							<span>No fake profiles</span>
						</div>
					</div>
				</div>

				<div className="hero-image">
					<img
						src={HeroImage}
						alt="Trust Ride identity verification illustration"
						className="hero-illustration"
					/>
				</div>
			</section>

			<section className="about-section" id="about">
				<div className="about-container">
					<span className="about-eyebrow">About Trust Ride</span>
					<h2 className="about-title">
						One platform, built for trust at every step
					</h2>
					<p className="about-subtitle">
						Trust Ride connects riders, drivers and admins on a single secure
						platform. Every account is verified, every document is checked and
						every action is tracked, so trust is never left to chance.
					</p>

					<div className="about-cards">
						<div className="home-mini-card">
							<IconShield />
							<div>
								<div className="home-mini-title">Verified Identity</div>
								<div className="home-mini-text">
									Every user and driver completes OTP and document verification
									before they can book or drive.
								</div>
							</div>
						</div>

						<div className="home-mini-card">
							<IconUser />
							<div>
								<div className="home-mini-title">Reviewed By Humans</div>
								<div className="home-mini-text">
									Real people check every submission, catching what automated
									scans alone would miss.
								</div>
							</div>
						</div>

						<div className="home-mini-card">
							<IconTruck />
							<div>
								<div className="home-mini-title">Safety Before Every Ride</div>
								<div className="home-mini-text">
									Vehicle and driver details are confirmed before a single trip
									ever begins.
								</div>
							</div>
						</div>
					</div>
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
