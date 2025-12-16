// Copyright (c) 2025 by Matt Cannon (https://codepen.io/matt-cannon/pen/wBaBQvo)
// ♡ This pen is a remix of https://codepen.io/jh3y/pen/jORQyzZ by @jh3y

const UPDATE = ({ x, y }) => {
	const xNorm = (x / window.innerWidth - 0.5) * 2;
	const yNorm = (y / window.innerHeight - 0.5) * 2;

	document.documentElement.style.setProperty("--x", xNorm);
	document.documentElement.style.setProperty("--y", yNorm);
};

window.addEventListener("mousemove", UPDATE);

const handleOrientation = ({ beta, gamma }) => {
	const isLandscape = window.matchMedia("(orientation: landscape)").matches;
	const xVal = Math.max(
		-1,
		Math.min(1, isLandscape ? (beta || 0) / 45 : (gamma || 0) / 45)
	);
	const yVal = Math.max(
		-1,
		Math.min(1, isLandscape ? Math.abs(gamma || 0) / 45 : (beta || 0) / 45)
	);

	document.documentElement.style.setProperty("--x", xVal);
	document.documentElement.style.setProperty("--y", yVal);
};

const START = () => {
	if (DeviceOrientationEvent?.requestPermission) {
		DeviceOrientationEvent.requestPermission().then((result) => {
			if (result === "granted") {
				window.addEventListener("deviceorientation", handleOrientation);
			}
		});
	} else {
		window.addEventListener("deviceorientation", handleOrientation);
	}
};

document.body.addEventListener("click", START, { once: true });
