(function ($) {
    $(function () {
        var $carousels = $(".sliding-partners");

        if (!$carousels.length || typeof $.fn.owlCarousel !== "function") {
            return;
        }

        $carousels.each(function () {
            var $carousel = $(this);

            $carousel.owlCarousel({
                margin: 50,
                loop: true,
                nav: false,
                dots: false,
                autoWidth: true,
                items: 8,
                autoplay: true,
                autoplayTimeout: 3000,
                autoplayHoverPause: true,
                touchDrag: false,
                mouseDrag: false,
                stagePadding: 60
            });
        });
    });
}(jQuery));
