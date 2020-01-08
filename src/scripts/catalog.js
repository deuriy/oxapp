// Products slider
var swiperProducts = new Swiper('.Swiper-products', {
	loop: true,
	autoplay: {
    delay: 5000,
  },
  slidesPerView: 1,
  centeredSlides: true,
  pagination: {
    el: '.SwiperPagination-products',
    clickable: true,
    bulletClass: 'SwiperPagination_bullet',
    bulletActiveClass: 'SwiperPagination_bullet-active'
	}
});