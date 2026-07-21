import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
	FaLock,
	FaUserShield,
	FaMapMarkedAlt,
	FaShieldAlt,
	FaUser,
	FaCar,
	FaArrowRight,
} from "react-icons/fa";
import Logo from "../../../assets/images/logo.png";
import "./LoginPage.css";

export default function LoginPage() {
	const [selectedRole, setSelectedRole] = useState("");

	return (
		<div className="auth-container">
			<div className="auth-card">
				<div className="left-panel">
					<div className="brand-badge">WELCOME TO TRUST RIDE</div>

					{!selectedRole && (
						<>
							<h1>
								Welcome Back
								<br />
								<span>Sign in to continue.</span>
							</h1>

							<p className="left-description">
								Choose your account type to continue with Trust Ride. Whether
								you're booking a ride or driving with us, your journey starts
								with a secure login.
							</p>

							<div className="left-info">
								<div className="info-item">
									<i className="fas fa-fingerprint info-icon"></i>
									<p>Secure Authentication</p>
								</div>

								<div className="info-item">
									<i className="fas fa-right-to-bracket info-icon"></i>
									<p>Fast & Easy Access</p>
								</div>

								<div className="info-item">
									<i className="fas fa-user-shield info-icon"></i>
									<p>Trusted Ride Platform</p>
								</div>

								<div className="info-item">
									<i className="fas fa-headset info-icon"></i>
									<p>24×7 Customer Support</p>
								</div>
							</div>
						</>
					)}

					{selectedRole === "user" && (
						<>
							<h1>
								User
								<br />
								<span>Login</span>
							</h1>

							<p className="left-description">
								Sign in to book rides, manage your bookings, save favourite
								places, make secure payments and track every ride in real time.
							</p>

							<div className="left-info">
								<div className="info-item">
									<i className="fas fa-car-side info-icon"></i>
									<p>Book Rides Instantly</p>
								</div>

								<div className="info-item">
									<i className="fas fa-route info-icon"></i>
									<p>Live Ride Tracking</p>
								</div>

								<div className="info-item">
									<i className="fas fa-wallet info-icon"></i>
									<p>Secure Online Payments</p>
								</div>

								<div className="info-item">
									<i className="fas fa-user-gear info-icon"></i>
									<p>Manage Your Profile</p>
								</div>
							</div>
						</>
					)}

					{selectedRole === "driver" && (
						<>
							<h1>
								Driver
								<br />
								<span>Login</span>
							</h1>

							<p className="left-description">
								Access your driver dashboard to accept ride requests, manage
								earnings, view trip history and grow with Trust Ride.
							</p>

							<div className="left-info">
								<div className="info-item">
									<i className="fas fa-handshake info-icon"></i>
									<p>Accept Ride Requests</p>
								</div>

								<div className="info-item">
									<i className="fas fa-wallet info-icon"></i>
									<p>Track Your Earnings</p>
								</div>

								<div className="info-item">
									<i className="fas fa-chart-line info-icon"></i>
									<p>Manage Completed Trips</p>
								</div>

								<div className="info-item">
									<i className="fas fa-id-card info-icon"></i>
									<p>Verified Driver Dashboard</p>
								</div>
							</div>
						</>
					)}
				</div>

				<div className="right-panel">
					<img src={Logo} alt="Trust Ride" className="logo" />

					{!selectedRole ? (
						<>
							<h2>Welcome Back</h2>

							<p className="subtitle">Choose your account type to continue.</p>

							<div className="role-options">
								<button
									className="role-btn"
									onClick={() => setSelectedRole("user")}
								>
									<div className="role-icon">
										<i className="fa-solid fa-user"></i>
									</div>

									<div className="role-content">
										<h4>Continue as User</h4>
										<p>Book rides, manage trips and payments.</p>
									</div>

									<i className="fa-solid fa-arrow-right arrow"></i>
								</button>

								<button
									className="role-btn"
									onClick={() => setSelectedRole("driver")}
								>
									<div className="role-icon">
										<i className="fa-solid fa-car-side"></i>
									</div>

									<div className="role-content">
										<h4>Continue as Driver</h4>
										<p>Accept rides and manage your earnings.</p>
									</div>

									<i className="fa-solid fa-arrow-right arrow"></i>
								</button>
							</div>

							<p className="switch-text">
								Don't have an account?
								<Link to="/register"> Create Account</Link>
							</p>
						</>
					) : (
						<>
							<h2>{selectedRole === "user" ? "User Login" : "Driver Login"}</h2>

							<p className="subtitle">
								Enter your credentials to access your account.
							</p>

							<form className="auth-form">
								<div className="input-group">
									<label>Email Address</label>
									<input type="email" placeholder="Enter your email" />
								</div>

								<div className="input-group">
									<label>Password</label>
									<input type="password" placeholder="Enter your password" />
								</div>

								<div className="form-meta-row">
									<Link to="/forgot-password" className="forgot-link">
										Forgot Password?
									</Link>
								</div>

								<button className="submit-btn" type="submit">
									Sign In
								</button>
							</form>

							<p className="switch-text">
								Don't have an account?
								<Link to="/register"> Register Now</Link>
							</p>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
