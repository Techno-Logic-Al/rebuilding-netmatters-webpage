(() => {
    const body = document.body;
    const sidebar = document.getElementById('site-sidebar');
    const header = document.getElementById('site-header');
    if (!sidebar || !header) {
        return;
    }
    // Ensure a body-level overlay exists so it can cover sticky header too
    const ensureOverlay = () => {
        let overlay = document.getElementById('site-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'site-overlay';
            document.body.appendChild(overlay);
        }
        return overlay;
    };
    ensureOverlay();

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

        // Align any visible sticky header with content when sidebar toggles
        const sticky = document.querySelector('.sticky');
        if (sticky) {
            setStickyOffset(sticky, isOpen);
        }
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
    // Toggle sidebar via burger and any [data-toggle="sidebar"]
    document.addEventListener('click', (event) => {
        const toggleButton =
            event.target instanceof Element
                ? event.target.closest('[data-toggle="sidebar"]')
                : null;

        if (!toggleButton) {
            return;
        }

        event.preventDefault();
        lastTrigger = toggleButton;
        toggleSidebar();
    });
    // Close sidebar when clicking outside the menu
    document.addEventListener('click', (event) => {
        if (!body.classList.contains('sidebar-active')) {
            return;
        }
        const target = event.target instanceof Element ? event.target : null;
        if (!target) {
            return;
        }
        if (target.closest('#site-sidebar')) {
            return;
        }
        if (target.closest('[data-toggle="sidebar"]')) {
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

    // Helpers to keep sticky header aligned horizontally with content
    const getSidebarOffsetValue = () => (window.innerWidth >= 992 ? -350 : -275);

    const setStickyOffset = (stickyEl, isSidebarOpen) => {
        const offset = isSidebarOpen ? getSidebarOffsetValue() : 0;
        stickyEl.style.setProperty('--slide-offset-x', `${offset}px`);
        stickyEl.style.transform = `translate3d(${offset}px, 0, 0)`;
    };

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

            // Ensure correct horizontal alignment during vertical animation
            setStickyOffset(sticky, body.classList.contains('sidebar-active'));

            sticky.addEventListener(
                'animationend',
                (event) => {
                    if (event.target !== sticky) {
                        return;
                    }
                    if (event.animationName === 'slideInDown') {
                        sticky.classList.remove('slideInDown');
                    }
                },
                { once: false }
            );
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

        // Keep sticky X offset correct on resize while it is visible
        window.addEventListener('resize', () => {
            const sticky = document.querySelector('.sticky');
            if (sticky) {
                setStickyOffset(sticky, body.classList.contains('sidebar-active'));
            }
        });
    };

            initStickyHeader();

    const isTopNavLink = (el) => el && el.matches('li[data-service] > a');
    const isDropdownLink = (el) => el && !!el.closest('#site-nav .dropdown-list, .sticky #site-nav .dropdown-list');

    const clearNavFocus = () => {
        try { document.activeElement && document.activeElement.blur && document.activeElement.blur(); } catch {}
        try { focusElement(document.body, { preventScroll: true }); } catch {}
    };

    
    // Make all top-level and dropdown links inert placeholders; clear focus to avoid stuck highlights
    document.addEventListener('click', (event) => {
        const link =
            event.target instanceof Element
                ? event.target.closest('#site-nav a, .sticky #site-nav a')
                : null;

        if (!link) {
            return;
        }

        event.preventDefault();
        try { link.blur(); } catch {}
        const parentTop = link.closest('li[data-service]');
        if (parentTop) {
            const topAnchor = parentTop.querySelector(':scope > a');
            if (topAnchor) {
                try { topAnchor.blur(); } catch {}
            }
        }
        clearNavFocus();
    });})();