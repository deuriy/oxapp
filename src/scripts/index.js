// Business Slider
var swiperBusiness = new Swiper('.Swiper-business', {
	loop: true,
	autoplay: {
    delay: 5000,
  },
  slidesPerView: 'auto',
  centeredSlides: true,
  pagination: {
    el: '.SwiperPagination-businessSlider',
    clickable: true,
    bulletClass: 'SwiperPagination_bullet',
    bulletActiveClass: 'SwiperPagination_bullet-active'
	},
	breakpoints: {
		1023: {
			slidesPerView: 1
		}
	}
});

// Reviews Slider
var reviewsSwiper = new Swiper('.Swiper-reviews', {
	loop: true,
	slidesPerView: 2,
	slideActiveClass: 'Swiper_slide-active',
	slideNextClass: 'Swiper_slide-next',
  pagination: {
    el: '.SwiperPagination-reviews',
    clickable: true,
    bulletClass: 'SwiperPagination_bullet',
    bulletActiveClass: 'SwiperPagination_bullet-active'
	},
	breakpoints: {
		767: {
			slidesPerView: 1
		}
	}
});

// FAQ
var $faqItems = document.querySelectorAll('.FaqItem_question a');

for (var i = 0; i < $faqItems.length; i++) {
  $faqItems[i].addEventListener('click', function () {
		var $faqItem = this.parentNode.parentNode;
    $faqItem.classList.toggle("FaqItem-open");
    event.preventDefault();
  });
}