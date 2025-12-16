const swiper = new Swiper(".swiper", {
	direction: "horizontal",
	loop: true,
	effect: "cube",
	cubeEffect: {
		slideShadows: false
	},

	autoplay: {
		delay: 4000
	},

	pagination: {
		el: ".swiper-pagination"
	},

	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev"
	}
});
