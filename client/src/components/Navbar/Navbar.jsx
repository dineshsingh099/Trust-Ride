import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from "../../assets/images/logo.png";
import "./Navbar.css";

const navItems = [
	{ id: "hero", label: "Home" },
	{ id: "about", label: "About" },
	{ id: "services", label: "Services" },
	{ id: "safety", label: "Safety" },
	{ id: "how-it-works", label: "How it works" },
	{ id: "contact", label: "Contact" },
];

function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [bgOpacity, setBgOpacity] = useState(0);
	const [activeSection, setActiveSection] = useState("hero");

	useEffect(() => {
		const handleScroll = () => {
			const fadeDistance = 300;
			const progress = Math.min(window.scrollY / fadeDistance, 1);
			setBgOpacity(progress);

			const scrollPos = window.scrollY + 160;
			let current = navItems[0].id;

			for (const item of navItems) {
				const el = document.getElementById(item.id);
				if (el && el.offsetTop <= scrollPos) {
					current = item.id;
				}
			}

			setActiveSection(current);
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const closeMenu = () => {
		setIsOpen(false);
	};

	return (
		<div
			className="nav"
			style={{
				backgroundColor: `rgba(10, 15, 29, ${bgOpacity * 1})`,
			}}
		>
			<Link to="/" className="logo-wrapper" onClick={closeMenu}>
				<img src={Logo} alt="Logo" className="logo-img" />
				<h1 className="logo">Trust Ride</h1>
			</Link>

			<div className="menu-icon" onClick={toggleMenu}>
				{isOpen ? <FaTimes /> : <FaBars />}
			</div>

			<ul className={isOpen ? "nav-links active" : "nav-links"}>
				{navItems.map((item) => (
					<li key={item.id}>
						<a
							href={`#${item.id}`}
							className={activeSection === item.id ? "active" : ""}
							onClick={closeMenu}
						>
							{item.label}
						</a>
					</li>
				))}

				<li className="mobile-btn">
					<Link to="/login" className="login-btn" onClick={closeMenu}>
						Login
					</Link>
					<Link to="/register" className="sign-btn" onClick={closeMenu}>
						Sign Up
					</Link>
				</li>
			</ul>

			<div className="btn">
				<Link to="/login" className="login-btn">
					Login
				</Link>
				<Link to="/register" className="sign-btn">
					Sign Up
				</Link>
			</div>
		</div>
	);
}

export default Navbar;
