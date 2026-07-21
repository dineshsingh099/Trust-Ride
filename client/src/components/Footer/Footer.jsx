import React from "react";
import {
	FaFacebookF,
	FaInstagram,
	FaLinkedinIn,
	FaTwitter,
	FaMapMarkerAlt,
	FaPhoneAlt,
	FaEnvelope,
} from "react-icons/fa";
import "./Footer.css";

const footerLinks = [
	{
		title: "Company",
		links: ["About Us", "Careers", "Blog", "Press"],
	},
	{
		title: "Services",
		links: ["Car Rides", "Bike Rides", "Auto Rickshaw", "Package Delivery"],
	},
	{
		title: "Support",
		links: ["Help Center", "Safety", "Contact Us", "Terms of Service"],
	},
];

export default function Footer() {
	return (
		<footer className="footer">
			<div className="footer-top">
				<div className="footer-brand">
					<h3 className="footer-logo">
						<span className="footer-logo-mark">TR</span> Trust Ride
					</h3>
					<p className="footer-tagline">
						Safe, reliable rides for every journey. Verified drivers, real time
						tracking, and round the clock support across 50+ cities.
					</p>

					<div className="footer-socials">
						<a href="/" aria-label="Facebook" className="footer-social-icon">
							<FaFacebookF />
						</a>
						<a href="/" aria-label="Twitter" className="footer-social-icon">
							<FaTwitter />
						</a>
						<a href="/" aria-label="Instagram" className="footer-social-icon">
							<FaInstagram />
						</a>
						<a href="/" aria-label="LinkedIn" className="footer-social-icon">
							<FaLinkedinIn />
						</a>
					</div>
				</div>

				<div className="footer-links-grid">
					{footerLinks.map((col, index) => (
						<div className="footer-col" key={index}>
							<h4>{col.title}</h4>
							<ul>
								{col.links.map((link, i) => (
									<li key={i}>
										<a href="/">{link}</a>
									</li>
								))}
							</ul>
						</div>
					))}

					<div className="footer-col footer-contact-col">
						<h4>Get in Touch</h4>
						<ul className="footer-contact-list">
							<li>
								<FaPhoneAlt />
								<span>+91 98765 43210</span>
							</li>
							<li>
								<FaEnvelope />
								<span>support@trustride.com</span>
							</li>
							<li>
								<FaMapMarkerAlt />
								<span>221B Marine Drive, Mumbai, India</span>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="footer-bottom">
				<p>
					&copy; {new Date().getFullYear()} Trust Ride. All rights reserved.
				</p>
				<div className="footer-bottom-links">
					<a href="/">Privacy Policy</a>
					<a href="/">Terms of Service</a>
					<a href="/">Cookie Policy</a>
				</div>
			</div>
		</footer>
	);
}
