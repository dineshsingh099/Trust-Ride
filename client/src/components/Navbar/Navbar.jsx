import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from "../../assets/images/logo.png";
import "./Navbar.css";

function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const closeMenu = () => {
		setIsOpen(false);
	};

	return (
		<div className="nav">
			<Link to="/" className="logo-wrapper" onClick={closeMenu}>
				<img src={Logo} alt="Logo" className="logo-img" />
				<h1 className="logo">Trust Ride</h1>
			</Link>

			<div className="menu-icon" onClick={toggleMenu}>
				{isOpen ? <FaTimes /> : <FaBars />}
			</div>

			<ul className={isOpen ? "nav-links active" : "nav-links"}>
				<li>
					<a href="#hero" onClick={closeMenu}>
						Home
					</a>
				</li>
				<li>
					<a href="#about" onClick={closeMenu}>
						About
					</a>
				</li>
				<li>
					<a href="#services" onClick={closeMenu}>
						Services
					</a>
				</li>
				<li>
					<a href="#safety" onClick={closeMenu}>
						Safety
					</a>
				</li>
				<li>
					<a href="#how-it-works" onClick={closeMenu}>
						How it works
					</a>
				</li>
				<li>
					<a href="#contact" onClick={closeMenu}>
						Contact
					</a>
				</li>

				<li className="mobile-btn">
					<Link to="/" className="login-btn" onClick={closeMenu}>
						Login
					</Link>
					<Link to="/" className="sign-btn" onClick={closeMenu}>
						Sign Up
					</Link>
				</li>
			</ul>

			<div className="btn">
				<Link to="/" className="login-btn">
					Login
				</Link>
				<Link to="/" className="sign-btn">
					Sign Up
				</Link>
			</div>
		</div>
	);
}

export default Navbar;
