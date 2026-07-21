import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../../assets/images/logo.png";
import "./RegisterPage.css";

export default function RegisterPage() {
	const [selectedRole, setSelectedRole] = useState("");

	return (
		<div className="auth-container">
			<div className="auth-card">
				<div className="left-panel">
					<div className="brand-badge">WELCOME TO TRUST RIDE</div>

					{!selectedRole && (
						<>
							<h1>
								Create Your
								<br />
								<span>Account</span>
							</h1>

							<p className="left-description">
								Join Trust Ride today and unlock a safer, faster, and smarter
								way to travel. Register as a passenger or become a trusted
								driver and start your journey with us.
							</p>

							<div className="left-info">
								<div className="info-item">
									<span>✓</span>
									<p>Quick Registration</p>
								</div>

								<div className="info-item">
									<span>✓</span>
									<p>Verified Accounts</p>
								</div>

								<div className="info-item">
									<span>✓</span>
									<p>Safe & Secure Platform</p>
								</div>

								<div className="info-item">
									<span>✓</span>
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
								<span>Registration</span>
							</h1>

							<p className="left-description">
								Create your passenger account to book rides, save favourite
								destinations, enjoy secure payments, and travel comfortably with
								Trust Ride.
							</p>

							<div className="left-info">
								<div className="info-item">
									<span>🚖</span>
									<p>Book Rides Anytime</p>
								</div>

								<div className="info-item">
									<span>📍</span>
									<p>Track Every Ride</p>
								</div>

								<div className="info-item">
									<span>💳</span>
									<p>Secure Payments</p>
								</div>

								<div className="info-item">
									<span>⭐</span>
									<p>Save Favourite Places</p>
								</div>
							</div>
						</>
					)}

					{selectedRole === "driver" && (
						<>
							<h1>
								Driver
								<br />
								<span>Registration</span>
							</h1>

							<p className="left-description">
								Register as a Trust Ride driver to receive ride requests, manage
								your earnings, grow your business, and drive with confidence.
							</p>

							<div className="left-info">
								<div className="info-item">
									<span>🚗</span>
									<p>Receive Ride Requests</p>
								</div>

								<div className="info-item">
									<span>💰</span>
									<p>Earn More Every Day</p>
								</div>

								<div className="info-item">
									<span>📊</span>
									<p>Manage Trips Easily</p>
								</div>

								<div className="info-item">
									<span>🛡️</span>
									<p>Verified Driver Profile</p>
								</div>
							</div>
						</>
					)}
				</div>

				<div className="right-panel">
					<img src={Logo} alt="Trust Ride" className="logo" />

					{!selectedRole ? (
						<>
							<h2>Create Account</h2>

							<p className="subtitle">
								Choose your account type to get started.
							</p>

							<div className="role-options">
								<button
									className="role-btn"
									onClick={() => setSelectedRole("user")}
								>
									<div className="role-icon">
										<i className="fa-solid fa-user"></i>
									</div>

									<div className="role-content">
										<h4>Register as User</h4>
										<p>Book rides, save locations and travel safely.</p>
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
										<h4>Register as Driver</h4>
										<p>Accept rides and earn with your vehicle.</p>
									</div>

									<i className="fa-solid fa-arrow-right arrow"></i>
								</button>
							</div>

							<p className="switch-text">
								Already have an account?
								<Link to="/login"> Login</Link>
							</p>
						</>
					) : (
						<>
							<div className="form-header">
								<button
									className="back-btn"
									onClick={() => setSelectedRole("")}
								>
									<i className="fa-solid fa-arrow-left"></i>
									Back
								</button>

								<span className="role-tag">
									{selectedRole === "user" ? "User Signup" : "Driver Signup"}
								</span>
							</div>

							<h2>
								{selectedRole === "user"
									? "Create User Account"
									: "Create Driver Account"}
							</h2>

							<p className="subtitle">
								Fill in your details to create your account.
							</p>

							<form className="auth-form">
								<div className="input-group">
									<label>Full Name</label>
									<input type="text" placeholder="Enter your full name" />
								</div>

								<div className="form-row-split">
									<div className="input-group">
										<label>Email Address</label>
										<input type="email" placeholder="Enter your email" />
									</div>

									<div className="input-group">
										<label>Phone Number</label>
										<input type="tel" placeholder="+91 9876543210" />
									</div>
								</div>

								{selectedRole === "driver" && (
									<div className="form-row-split">
										<div className="input-group">
											<label>Vehicle Number</label>
											<input type="text" placeholder="RJ14 AB 1234" />
										</div>

										<div className="input-group">
											<label>License Number</label>
											<input type="text" placeholder="DL-XXXXXXXXXXXX" />
										</div>
									</div>
								)}

								<div className="form-row-split">
									<div className="input-group">
										<label>Password</label>
										<input type="password" placeholder="Create password" />
									</div>

									<div className="input-group">
										<label>Confirm Password</label>
										<input type="password" placeholder="Confirm password" />
									</div>
								</div>

								<button className="submit-btn" type="submit">
									{selectedRole === "user"
										? "Create Account"
										: "Register as Driver"}
								</button>
							</form>

							<p className="switch-text">
								Already have an account?
								<Link to="/login"> Login</Link>
							</p>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
