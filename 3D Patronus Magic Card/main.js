const card = document.querySelector(".card");
const layers = document.querySelectorAll(".parallax-layer");
let isHovered = false;

function applyParallaxEffect(x, y) {
	const tiltY = (x - 0.5) * 60;
	layers.forEach((layer, index) => {
		const depthX = index * 30;
		const depthY = index * 13;
		const moveX = (x - 0.5) * depthX;
		const moveY = (y - 0.5) * depthY;
		layer.style.transform = `translate(${moveX}px, ${moveY}px) rotateY(${tiltY}deg)`;
	});
}

card.addEventListener("mousemove", (e) => {
	const rect = card.getBoundingClientRect();
	const x = (e.clientX - rect.left) / rect.width;
	const y = (e.clientY - rect.top) / rect.height;
	isHovered = true;
	applyParallaxEffect(x, y);
});

window.addEventListener("load", () => {
	let progress = 0;

	function animate() {
		if (isHovered) return;
		progress += 0.005;
		const x = Math.sin(progress) * 0.5 + 0.5;
		const y = 0.5;
		applyParallaxEffect(x, y);
		if (progress < Math.PI * 2) {
			requestAnimationFrame(animate);
		}
	}
	animate();
});
