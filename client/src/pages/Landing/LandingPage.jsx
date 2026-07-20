import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import HeroImg from "../../assets/images/hero.png";
import VerifiedImg from "../../assets/icons/verified-driver.png";
import AvailableImg from "../../assets/icons/available-247.png";
import TrackingImg from "../../assets/icons/live-tracking.png";
import BikeImg from "../../assets/icons/bike-ride.png";
import AutoImg from "../../assets/icons/auto-ride.png";
import CarImg from "../../assets/icons/car-ride.png";
import PackageImg from "../../assets/icons/package-delivery.png";
import SafetyVerifiedImg from "../../assets/icons/safety-verified-id.png";
import SafetySosImg from "../../assets/icons/safety-sos.png";
import SafetyTrackingImg from "../../assets/icons/safety-tracking.png";
import SafetyTripSharingImg from "../../assets/icons/safety-trip-sharing.png";
import SafetyInsuranceImg from "../../assets/icons/safety-insurance.png";
import SafetySupportImg from "../../assets/icons/safety-support.png";
import {
	FaArrowRight,
	FaPhoneVolume,
	FaMapMarkerAlt,
	FaBolt,
	FaRoute,
	FaFlagCheckered,
	FaPhoneAlt,
	FaEnvelope,
	FaPaperPlane} from "react-icons/fa";
import "./LandingPage.css";

const steps = [
	{
		icon: <FaMapMarkerAlt />,
		title: "Set Your Destination",
		desc: "Enter your pickup point and drop location in the app in just a few taps.",
	},
	{
		icon: <FaBolt />,
		title: "Get Matched Instantly",
		desc: "We connect you with the nearest verified driver within seconds.",
	},
	{
		icon: <FaRoute />,
		title: "Track Your Ride",
		desc: "Watch your driver's live location and share your trip with anyone you choose.",
	},
	{
		icon: <FaFlagCheckered />,
		title: "Arrive Safely",
		desc: "Reach your destination on time and rate your experience to help us improve.",
	},
];

const services = [
	{
		img: CarImg,
		title: "Car Rides",
		desc: "Comfortable, air conditioned cars for daily commutes, airport runs, or trips across town.",
	},
	{
		img: BikeImg,
		title: "Bike Rides",
		desc: "Quick and affordable bike rides to beat the traffic and get you there faster.",
	},
	{
		img: AutoImg,
		title: "Auto Rickshaw",
		desc: "The everyday city ride, easy to book and easy on your pocket for short distances.",
	},
	{
		img: PackageImg,
		title: "Package Delivery",
		desc: "Send parcels and packages across the city with real time tracking, safe and on time.",
	},
];

const safetyFeatures = [
	{
		img: SafetyVerifiedImg,
		title: "Verified Identity",
		desc: "Every driver clears document checks and background verification before joining the platform.",
	},
	{
		img: SafetySosImg,
		title: "24/7 Emergency SOS",
		desc: "One tap connects you to our safety team and emergency services, any time of day.",
	},
	{
		img: SafetyTrackingImg,
		title: "Real-Time Tracking",
		desc: "Follow your driver on the map from pickup to drop off with live route and ETA updates.",
	},
	{
		img: SafetyTripSharingImg,
		title: "Live Trip Sharing",
		desc: "Share your live location and trip status with family or friends in real time.",
	},
	{
		img: SafetyInsuranceImg,
		title: "Ride Insurance",
		desc: "Every trip on Trust Ride is covered, so you can travel with complete peace of mind.",
	},
	{
		img: SafetySupportImg,
		title: "24/7 Customer Support",
		desc: "Our support team is always here to assist you, anytime you need help during your journey.",
	},
];

const aboutFeatures = [
	{
		img: VerifiedImg,
		title: "Verified Drivers",
		desc: "Every driver on Trust Ride goes through background checks and document verification before they hit the road.",
	},
	{
		img: AvailableImg,
		title: "Available 24/7",
		desc: "Early morning flight or a late night trip home, a ride is always a few taps away, any hour of the day.",
	},
	{
		img: TrackingImg,
		title: "Live Tracking",
		desc: "Share your trip with family and follow your ride on the map from pickup to drop off in real time.",
	},
];

export default function Landing() {
	return (
		<>
			<div className="hero" id="hero">
				<img src={HeroImg} alt="" className="hero-bg" />
				<Navbar />

				<div className="hero-content">
					<h1>
						Your Ride, <span>Your Trust</span>
					</h1>
					<p>
						Book safe, reliable rides anytime, anywhere. From daily commutes to
						late night trips, Trust Ride gets you there with verified drivers
						and real time tracking.
					</p>
					<div className="hero-btns">
						<button className="cta-primary">Book a Ride</button>
						<button className="cta-secondary">How it Works</button>
					</div>

					<div className="hero-stats">
						<div className="stat">
							<strong>500K+</strong>
							<span>Rides Completed</span>
						</div>
						<div className="divider"></div>
						<div className="stat">
							<strong>4.9</strong>
							<span>Average Rating</span>
						</div>
						<div className="divider"></div>
						<div className="stat">
							<strong>50+</strong>
							<span>Cities Covered</span>
						</div>
					</div>
				</div>
			</div>

			<section className="about" id="about">
				<div className="about-text">
					<span className="about-eyebrow">About Trust Ride</span>
					<h2>
						Built for the way <span>you actually move</span>
					</h2>
					<p>
						Whether it is a car for the family, a bike for a quick errand, or a
						rickshaw for the daily commute, Trust Ride brings every kind of
						vehicle onto one platform. Verified drivers, transparent pricing,
						and real time tracking mean you always know who is driving and where
						you are headed. From your first ride to your daily commute, we have
						built every part of the experience around one simple idea, that
						getting from one place to another should feel safe, easy, and
						completely in your control, no matter which vehicle you choose or
						what time of day you are travelling.
					</p>
				</div>

				<div className="about-features">
					{aboutFeatures.map((feature, index) => (
						<div className="feature-card" key={index}>
							<div className="feature-img">
								<img src={feature.img} alt={feature.title} />
							</div>
							<h3>{feature.title}</h3>
							<p>{feature.desc}</p>
						</div>
					))}
				</div>
			</section>

			<section className="services" id="services">
				<span className="about-eyebrow">What We Offer</span>
				<h2 className="services-heading">
					A ride for <span>every kind of trip</span>
				</h2>

				<div className="services-grid">
					{services.map((service, index) => (
						<div className="service-card" key={index}>
							<div className="service-img">
								<img src={service.img} alt={service.title} />
							</div>
							<div className="service-body">
								<h3>{service.title}</h3>
								<p>{service.desc}</p>
								<a href="/" className="service-link">
									Book Now <FaArrowRight />
								</a>
							</div>
						</div>
					))}
				</div>
			</section>

			<section className="safety" id="safety">
				<div className="safety-content">
					<span className="about-eyebrow">Your Safety First</span>
					<h2 className="safety-heading">
						Every ride, <span>built on trust</span>
					</h2>
					<p className="safety-desc">
						Safety is not an afterthought at Trust Ride, it is built into every
						step of the journey. From the moment a driver is verified to the
						moment you reach your destination, we keep watch so you do not have
						to.
					</p>

					<div className="sos-card">
						<div className="sos-icon">
							<FaPhoneVolume />
						</div>
						<div>
							<h4>Emergency SOS</h4>
							<p>Instant access to help, right from the ride screen.</p>
						</div>
					</div>
				</div>

				<div className="safety-grid">
					{safetyFeatures.map((item, index) => (
						<div className="safety-card" key={index}>
							<div className="safety-img">
								<img src={item.img} alt={item.title} />
							</div>
							<div className="safety-body">
								<h3>{item.title}</h3>
								<p>{item.desc}</p>
							</div>
						</div>
					))}
				</div>
			</section>

			<section className="how-it-works" id="how-it-works">
				<span className="about-eyebrow">Simple Process</span>
				<h2 className="how-heading">
					Get moving in <span>four easy steps</span>
				</h2>

				<div className="steps-grid">
					{steps.map((step, index) => (
						<div className="step-card" key={index}>
							<div className="step-top">
								<div className="step-icon">{step.icon}</div>
								<span className="step-number">{`0${index + 1}`}</span>
							</div>
							<h3>{step.title}</h3>
							<p>{step.desc}</p>
						</div>
					))}
				</div>
			</section>

			<section className="contact" id="contact">
				<div className="contact-info">
					<span className="section-tag">GET IN TOUCH</span>

					<h2 className="contact-heading">
						We're here to <span>help, anytime</span>
					</h2>

					<p className="contact-desc">
						Have a question about a ride, a lost item, or a partnership idea?
						Reach out and our team will get back to you shortly.
					</p>

					<div className="contact-items">
						<div className="contact-item">
							<div className="contact-icon">
								<FaPhoneAlt />
							</div>

							<div>
								<h4>Call Us</h4>
								<p>+91 98765 43210</p>
							</div>
						</div>

						<div className="contact-item">
							<div className="contact-icon">
								<FaEnvelope />
							</div>

							<div>
								<h4>Email Us</h4>
								<p>support@trustride.com</p>
							</div>
						</div>

						<div className="contact-item">
							<div className="contact-icon">
								<FaMapMarkerAlt />
							</div>

							<div>
								<h4>Visit Us</h4>
								<p>221B Marine Drive, Mumbai, India</p>
							</div>
						</div>
					</div>
				</div>

				<form className="contact-form">
					<div className="form-row">
						<div className="form-group">
							<label>Full Name</label>
							<input type="text" placeholder="Enter your name" />
						</div>

						<div className="form-group">
							<label>Email Address</label>
							<input type="email" placeholder="you@example.com" />
						</div>
					</div>

					<div className="form-group">
						<label>Subject</label>
						<input type="text" placeholder="How can we help?" />
					</div>

					<div className="form-group">
						<label>Message</label>
						<textarea
							rows="5"
							placeholder="Write your message here..."
						></textarea>
					</div>

					<button type="submit" className="cta-primary contact-submit">
						Send Message
						<FaPaperPlane />
					</button>
				</form>
			</section>
		</>
	);
}
