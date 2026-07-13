import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { IconShield, IconUser, IconTruck } from "../../components/common/Icons";
import LogoIcon from "../../assets/images/logo-icon.png";
import HeroImage from "../../assets/images/hero-verification.webp";
import "./HomePage.css";

function IconAuto() {
	return (
		<svg
			viewBox="0 0 64 64"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M18 24 L32 16 L46 24" />
			<path d="M16 24 H44 C48 24 52 28 52 34 V42 H14 V30 C14 26 16 24 20 24Z" />
			<path d="M44 24 L52 30" />
			<path d="M24 24 V34 H40 V24" />
			<circle cx="54" cy="34" r="1.8" />
			<circle cx="22" cy="46" r="5" />
			<circle cx="46" cy="46" r="5" />
			<path d="M14 42 H52" />
		</svg>
	);
}

function IconPhone() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
		</svg>
	);
}

function IconMail() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
			<path d="M22 6l-10 7L2 6" />
		</svg>
	);
}

function IconPin() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
			<circle cx="12" cy="10" r="3" />
		</svg>
	);
}

export default function HomePage() {
	const navigate = useNavigate();
	const clickCount = useRef(0);
	const clickTimer = useRef(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const [activeSection, setActiveSection] = useState("home");
	const [contactForm, setContactForm] = useState({
		name: "",
		email: "",
		message: "",
	});

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

	const handleContactChange = (e) => {
		const { name, value } = e.target;
		setContactForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleContactSubmit = (e) => {
		e.preventDefault();
		setContactForm({ name: "", email: "", message: "" });
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

	const services = [
		{
			icon: <IconTruck />,
			title: "Bike",
			text: "Quick and affordable bike rides for short distances and daily commutes.",
		},
		{
			icon: <IconAuto />,
			title: "Auto",
			text: "Comfortable auto rides at transparent fares, available across the city.",
		},
		{
			icon: <IconTruck />,
			title: "Car",
			text: "Safe and spacious car rides for families, groups, and longer trips.",
		},
		{
			icon: <IconTruck />,
			title: "Parcel Delivery",
			text: "Fast and reliable parcel delivery with real-time tracking support.",
		},
		{
			icon: <IconTruck />,
			title: "Outstation Rides",
			text: "Comfortable one-way and round-trip rides for travel between cities.",
		},
		{
			icon: <IconShield />,
			title: "Rentals",
			text: "Hourly and daily car rentals with verified drivers for full flexibility.",
		},
		{
			icon: <IconUser />,
			title: "Corporate Rides",
			text: "Reliable and billable rides designed for business travel needs.",
		},
		{
			icon: <IconTruck />,
			title: "Airport Transfers",
			text: "On-time pickups and drops with live tracking for a stress-free journey.",
		},
	];

	const safetyFeatures = [
		{
			icon: <IconShield />,
			title: "Verified Drivers",
			text: "Every driver goes through document verification and background checks before joining.",
		},
		{
			icon: <IconUser />,
			title: "Live Ride Tracking",
			text: "Share your live location with family or friends throughout your trip.",
		},
		{
			icon: <IconTruck />,
			title: "24/7 Support",
			text: "Our support team is available round the clock for any ride-related concern.",
		},
		{
			icon: <IconShield />,
			title: "SOS Emergency Button",
			text: "One tap access to emergency help directly from the app during your ride.",
		},
	];

	const contactInfo = [
		{
			icon: <IconPhone />,
			title: "Call Us",
			text: "+91 98765 43210",
		},
		{
			icon: <IconMail />,
			title: "Email Us",
			text: "support@trustride.com",
		},
		{
			icon: <IconPin />,
			title: "Visit Us",
			text: "Ajmer, Rajasthan, India",
		},
	];

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
					<i className="fa-solid fa-bars"></i>
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
					<i className="fa-solid fa-x"></i>
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
					className={activeSection === "safety" ? "active" : ""}
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
						Your Trusted Partner for Every Journey
					</span>

					<h1 className="home-hero-title">
						Welcome to <span className="home-hero-accent">Trust Ride</span>
						<br />
						Safe, Fast &amp; Reliable Transportation.
					</h1>

					<p className="home-hero-subtitle">
						Trust Ride makes everyday travel simple and secure. Book Bikes,
						Autos, Cars, and Parcel Delivery with verified drivers, live GPS
						tracking, secure payments, transparent fares, and a smooth booking
						experience—all in one platform.
					</p>

					<div className="home-hero-actions">
						<Button
							variant="accent"
							size="lg"
							onClick={() => navigate("/choose-role?intent=signup")}
						>
							Get Started
						</Button>

						<Button variant="outline" size="lg" onClick={scrollToAbout}>
							Explore Services
						</Button>
					</div>

					<div className="hero-trust-bar">
						<div className="hero-trust-item">
							<IconShield />
							<span>Safe & Secure Rides</span>
						</div>
						<div className="hero-trust-item">
							<IconUser />
							<span>Verified Drivers</span>
						</div>
						<div className="hero-trust-item">
							<IconTruck />
							<span>Bike • Auto • Car • Parcel</span>
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
					<div className="about-image">
						<img
							src={HeroImage}
							alt="About Trust Ride"
							className="about-illustration"
						/>
					</div>

					<div className="about-content">
						<span className="about-eyebrow">About Trust Ride</span>
						<h2 className="about-title">
							Redefining Safe & Reliable Transportation
						</h2>
						<p className="about-text">
							Trust Ride is a modern ride-sharing platform designed to make
							everyday travel simple, safe, and convenient. Whether you need a
							Bike, Auto, Car, or Parcel Delivery, our platform connects
							passengers with verified drivers through a seamless booking
							experience.
						</p>
						<p className="about-text">
							With real-time ride tracking, secure digital payments, transparent
							pricing, and a user-friendly interface, Trust Ride ensures every
							journey is reliable and hassle-free. Our mission is to build a
							transportation platform where safety, trust, affordability, and
							customer satisfaction come first.
						</p>

						<div className="about-stats">
							<div className="about-stat">
								<span className="about-stat-number">10K+</span>
								<span className="about-stat-label">Verified Drivers</span>
							</div>
							<div className="about-stat">
								<span className="about-stat-number">50K+</span>
								<span className="about-stat-label">Happy Riders</span>
							</div>
							<div className="about-stat">
								<span className="about-stat-number">24/7</span>
								<span className="about-stat-label">Support</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="services-section" id="services">
				<div className="services-container">
					<span className="services-eyebrow">Our Services</span>
					<h2 className="services-title">Everything You Need To Move</h2>
					<p className="services-subtitle">
						From quick city hops to bulky parcel drop-offs, Trust Ride has a
						ride for every need.
					</p>

					<div className="services-grid">
						{services.map((service) => (
							<div className="service-card" key={service.title}>
								<div className="service-icon">{service.icon}</div>
								<h3 className="service-card-title">{service.title}</h3>
								<p className="service-card-text">{service.text}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="safety-section" id="safety">
				<div className="safety-container">
					<span className="safety-eyebrow">Your Safety, Our Priority</span>
					<h2 className="safety-title">Built With Safety At Every Step</h2>
					<p className="safety-subtitle">
						From the moment you book to the moment you arrive, Trust Ride keeps
						you protected with smart, real-time safety features.
					</p>

					<div className="safety-grid">
						{safetyFeatures.map((feature) => (
							<div className="safety-card" key={feature.title}>
								<div className="safety-card-icon">{feature.icon}</div>
								<h3 className="safety-card-title">{feature.title}</h3>
								<p className="safety-card-text">{feature.text}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="contact-section" id="contact">
				<div className="contact-container">
					<span className="contact-eyebrow">Get In Touch</span>
					<h2 className="contact-title">We're Here To Help</h2>
					<p className="contact-subtitle">
						Have a question, feedback, or need support? Reach out to the Trust
						Ride team and we'll get back to you as soon as possible.
					</p>

					<div className="contact-grid">
						<div className="contact-info">
							{contactInfo.map((item) => (
								<div className="contact-info-card" key={item.title}>
									<div className="contact-info-icon">{item.icon}</div>
									<div className="contact-info-text">
										<h3>{item.title}</h3>
										<p>{item.text}</p>
									</div>
								</div>
							))}
						</div>

						<form className="contact-form" onSubmit={handleContactSubmit}>
							<div className="contact-form-row">
								<label htmlFor="name">Full Name</label>
								<input
									id="name"
									name="name"
									type="text"
									placeholder="Enter your name"
									value={contactForm.name}
									onChange={handleContactChange}
									required
								/>
							</div>

							<div className="contact-form-row">
								<label htmlFor="email">Email Address</label>
								<input
									id="email"
									name="email"
									type="email"
									placeholder="Enter your email"
									value={contactForm.email}
									onChange={handleContactChange}
									required
								/>
							</div>

							<div className="contact-form-row">
								<label htmlFor="message">Message</label>
								<textarea
									id="message"
									name="message"
									rows="5"
									placeholder="Write your message"
									value={contactForm.message}
									onChange={handleContactChange}
									required
								/>
							</div>

							<Button
								type="submit"
								variant="accent"
								size="lg"
								className="contact-submit-btn"
							>
								Send Message
							</Button>
						</form>
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
