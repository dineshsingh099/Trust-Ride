import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Landing = lazy(() => import("./pages/Landing/LandingPage"));
const About = lazy(() => import("./pages/About/About"));

export default function App() {
	return (
		<Suspense fallback={<div className="page-loader">Loading...</div>}>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/about" element={<About />} />
			</Routes>
		</Suspense>
	);
}
