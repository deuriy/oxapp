// Thumbs gallery
const activeImage = document.querySelector(".ProductCard_img img");
const productImages = document.querySelectorAll(".ProductCard_thumb img");

function changeImage(e) {
	activeImage.src = e.target.src;
	activeImage.parentNode.href = e.target.src;
	
	baguetteBox.destroy();
	baguetteBox.run('.ProductCard_img', {
		filter: /.+/i
	});
}

productImages.forEach(image => image.addEventListener("click", changeImage));

// Baguette Box
baguetteBox.run('.ProductCard_img', {
	filter: /.+/i
});

// Tabs
document.querySelectorAll('.Tabs').forEach(function(item) {
  item.querySelectorAll('.Tabs_itemTitle').forEach(function(item) {
    item.addEventListener('click', function(e) {
			var parentContainer = this.parentNode.parentNode;

			parentContainer.querySelectorAll('.Tabs_item').forEach(function (item) {
				item.querySelector('.Tabs_itemTitle').classList.remove('Tabs_itemTitle-active');
				item.querySelector('.Tabs_itemContent').classList.remove('Tabs_itemContent-isOpen');
			});

			this.classList.add('Tabs_itemTitle-active');
			this.nextElementSibling.classList.add('Tabs_itemContent-isOpen');

			e.preventDefault();
    });
  });
});

// Similar Products Slider
var reviewsSwiper = new Swiper('.Swiper-similarProducts', {
	loop: true,
	slidesPerView: 4,
	slideActiveClass: 'Swiper_slide-active',
	slideNextClass: 'Swiper_slide-next',
  pagination: {
    el: '.SwiperPagination-similarProducts',
    clickable: true,
    bulletClass: 'SwiperPagination_bullet',
    bulletActiveClass: 'SwiperPagination_bullet-active'
	},
	breakpoints: {
		767: {
			slidesPerView: 1
		},
		1279: {
			slidesPerView: 3
		},
		1023: {
			slidesPerView: 2
		}
	}
});