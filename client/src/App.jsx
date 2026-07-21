import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Landing = lazy(() => import("./pages/Landing/LandingPage"));
const LoginPage = lazy(() => import("./pages/Auth/Login/LoginPage"));
const RegisterPage = lazy(() => import("./pages/Auth/Register/RegisterPage"));
const UserDashboard = lazy(() => import("./pages/Dashboard/UserDashboard"));


export default function App() {
	return (
		<Suspense fallback={<div className="page-loader">Loading...</div>}>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="user/dashboard" element={<UserDashboard />} />
			</Routes>
		</Suspense>
	);
}
