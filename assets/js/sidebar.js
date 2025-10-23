(() => {
    const body = document.body;
    const sidebar = document.getElementById('site-sidebar');
    const header = document.getElementById('site-header');
    if (!sidebar || !header) {
        return;
    }

    const focusableSelector =
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

    let lastTrigger = null;

    const focusElement = (element, options = {}) => {
        if (!(element instanceof HTMLElement) || !document.contains(element)) {
            return;
        }

        try {
            element.focus(options);
        } catch (error) {
            element.focus();
        }
    };

    const updateTriggerState = (isOpen) => {
        document
            .querySelectorAll('[data-toggle="sidebar"]')
            .forEach((toggle) => {
                toggle.classList.toggle('is-active', isOpen);
                toggle.setAttribute('aria-expanded', String(isOpen));
            });
        sidebar.setAttribute('aria-hidden', String(!isOpen));
    };

    const openSidebar = () => {
        body.classList.add('sidebar-active');
        updateTriggerState(true);

        const firstFocusable = sidebar.querySelector(focusableSelector);
        focusElement(firstFocusable, { preventScroll: true });
    };

    const closeSidebar = () => {
        body.classList.remove('sidebar-active');
        updateTriggerState(false);

        const fallbackTrigger =
            (lastTrigger && document.contains(lastTrigger)
                ? lastTrigger
                : document.querySelector('[data-toggle="sidebar"]')) || null;
        focusElement(fallbackTrigger, { preventScroll: true });
    };

    const toggleSidebar = (force) => {
        const shouldOpen =
            typeof force === 'boolean'
                ? force
                : !body.classList.contains('sidebar-active');

        if (shouldOpen) {
            openSidebar();
        } else {
            closeSidebar();
        }
    };

    sidebar.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        if (target.closest('a')) {
            toggleSidebar(false);
        }
    });

    document.addEventListener('click', (event) => {
        const toggleButton =
            event.target instanceof Element
                ? event.target.closest('[data-toggle="sidebar"]')
                : null;

        if (toggleButton) {
            event.preventDefault();
            lastTrigger = toggleButton;
            toggleSidebar();
            return;
        }

        if (!body.classList.contains('sidebar-active')) {
            return;
        }

        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        if (target.closest('#site-sidebar')) {
            return;
        }

        toggleSidebar(false);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && body.classList.contains('sidebar-active')) {
            toggleSidebar(false);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992 && body.classList.contains('sidebar-active')) {
            toggleSidebar(false);
        }
    });

    const initStickyHeader = () => {
        if (document.getElementById('game-container')) {
            return;
        }

        let lastScroll = window.pageYOffset || 0;
        let stickyActive = false;
        let scrollTimeoutId = null;
        const headerHeight = header.offsetHeight;

        const removeSticky = () => {
            const sticky = document.querySelector('.sticky');
            if (!sticky) {
                return;
            }

            sticky.classList.remove('slideInDown');
            sticky.classList.add('slideOutUp');
            window.setTimeout(() => {
                sticky.remove();
            }, 250);
            stickyActive = false;
            header.style.visibility = '';
        };

        const createSticky = () => {
            if (stickyActive) {
                return;
            }

            header.style.visibility = 'hidden';
            const sticky = document.createElement('div');
            sticky.className = 'sticky animated';
            sticky.innerHTML = header.innerHTML;
            document.body.appendChild(sticky);
            sticky.classList.add('slideInDown');
            stickyActive = true;
            updateTriggerState(body.classList.contains('sidebar-active'));
        };

        window.addEventListener(
            'scroll',
            () => {
                const currentScroll =
                    window.pageYOffset || document.documentElement.scrollTop || 0;

                if (scrollTimeoutId) {
                    window.clearTimeout(scrollTimeoutId);
                }

                scrollTimeoutId = window.setTimeout(() => {
                    if (currentScroll > lastScroll) {
                        if (stickyActive) {
                            removeSticky();
                        }
                    } else {
                        if (currentScroll > headerHeight && !stickyActive) {
                            createSticky();
                        } else if (currentScroll === 0 && stickyActive) {
                            removeSticky();
                        }
                    }

                    lastScroll = currentScroll;
                }, 50);
            },
            { passive: true }
        );
    };

    initStickyHeader();
})();
