(function ($) {
    $(function () {
        var $heroCarousel = $('.hero-carousel');
        if (!$heroCarousel.length || typeof $heroCarousel.owlCarousel !== 'function') {
            return;
        }

        $heroCarousel.owlCarousel({
            loop: true,
            nav: false,
            dots: true,
            items: 1,
            autoplay: true,
            autoplayTimeout: 4000,
            autoplayHoverPause: true,
            autoHeight: (function () {
                var dataValue = $heroCarousel.data('auto-height');
                if (typeof dataValue === 'boolean') {
                    return dataValue;
                }
                if (typeof dataValue === 'string') {
                    return dataValue === 'true';
                }
                return true;
            }())
        });
    });
}(jQuery));