(() => {
    const form = document.getElementById('contact-form');
    const statusEl = document.getElementById('form-status');

    const setError = (fieldName, message) => {
        const field = document.getElementById(fieldName);
        const error = document.querySelector(
            `.error-message[data-for="${fieldName}"]`
        );

        if (field) {
            field.classList.toggle('has-error', !!message);
        }

        if (error) {
            error.textContent = message || '';
        }
    };

    const clearErrors = (options = { clearStatus: true }) => {
        ['name', 'company', 'email', 'telephone', 'message'].forEach((field) =>
            setError(field, '')
        );

        if (statusEl && options.clearStatus) {
            statusEl.textContent = '';
            statusEl.classList.remove('status-error', 'status-success');
        }
    };

    const validateForm = () => {
        let valid = true;
        const messages = [];

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const telephone = document.getElementById('telephone');
        const messageEl = document.getElementById('message');

        if (!name || !email || !telephone || !messageEl) {
            return { valid: true, messages: [] };
        }

        const nameValue = name.value.trim();
        const emailValue = email.value.trim();
        const telephoneValue = telephone.value.trim();
        const messageValue = messageEl.value.trim();

        const addError = (fieldId, message) => {
            setError(fieldId, message);
            messages.push(message);
            valid = false;
        };

        if (!nameValue) {
            addError('name', 'Please enter your name.');
        }

        if (!emailValue) {
            addError('email', 'Please enter your email address.');
        } else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailValue)) {
                addError('email', 'Please enter a valid email address.');
            }
        }

        if (!telephoneValue) {
            addError('telephone', 'Please enter your telephone number.');
        } else {
            const phonePattern = /^[0-9+()\\s-]{9,}$/;
            if (!phonePattern.test(telephoneValue)) {
                addError('telephone', 'The telephone number format is incorrect.');
            }
        }

        if (!messageValue) {
            addError('message', 'Please enter your message.');
        } else if (messageValue.length < 5) {
            addError('message', 'Message must be at least 5 characters.');
        }

        return { valid, messages };
    };

    const attachFieldValidation = (fieldId, validator) => {
        const input = document.getElementById(fieldId);
        if (!input) return;

        input.addEventListener('input', () => {
            const value = input.value.trim();
            const message = validator(value);
            setError(fieldId, message);

             // Keep form-status in sync with current client-side validation
             if (!statusEl) return;

             const { valid, messages } = validateForm();

             if (!valid) {
                 statusEl.classList.remove('status-success');
                 statusEl.classList.add('status-error');
                 statusEl.innerHTML = messages
                     .map((msg) => `<p>${msg}</p>`)
                     .join('');
             } else {
                 statusEl.textContent = '';
                 statusEl.classList.remove('status-error', 'status-success');
             }
        });
    };

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            // Clear field errors and previous status before validating
            clearErrors();

            const { valid, messages } = validateForm();

            if (!valid) {
                if (statusEl) {
                    statusEl.classList.remove('status-success');
                    statusEl.classList.add('status-error');
                    statusEl.innerHTML = messages
                        .map((msg) => `<p>${msg}</p>`)
                        .join('');
                }
                return;
            }

            // Client-side validation passed – submit via AJAX to avoid reload
            if (statusEl) {
                statusEl.classList.remove('status-error', 'status-success');
                statusEl.textContent = 'Sending...';
            }

            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Network error');
                }

                const data = await response.json();

                if (data.success) {
                    if (statusEl) {
                        statusEl.classList.remove('status-error');
                        statusEl.classList.add('status-success');
                        statusEl.textContent =
                            data.message || 'Your message has been sent!';
                    }
                    form.reset();
                    // Reset pretty checkbox visual state
                    const prettyCheckboxLabel = document.querySelector(
                        '#contact-form label.pretty-checkbox'
                    );
                    if (prettyCheckboxLabel) {
                        prettyCheckboxLabel.classList.remove('active');
                    }
                    // Clear field errors but keep the success message
                    clearErrors({ clearStatus: false });
                } else if (data.errors) {
                    // Server-side validation errors (extra safety)
                    const serverMessages = Object.values(data.errors).filter(
                        Boolean
                    );
                    serverMessages.forEach((msg, index) => {
                        // Map back to known fields if possible
                        const fieldNames = ['name', 'company', 'email', 'telephone', 'message'];
                        const field = fieldNames[index] || null;
                        if (field && data.errors[field]) {
                            setError(field, data.errors[field]);
                        }
                    });
                    if (statusEl) {
                        statusEl.classList.remove('status-success');
                        statusEl.classList.add('status-error');
                        statusEl.innerHTML = serverMessages
                            .map((msg) => `<p>${msg}</p>`)
                            .join('');
                    }
                } else {
                    throw new Error('Invalid response');
                }
            } catch (error) {
                if (statusEl) {
                    statusEl.classList.remove('status-success');
                    statusEl.classList.add('status-error');
                    statusEl.textContent =
                        'There was a problem submitting your enquiry. Please try again.';
                }
            }
        });

        // Live per-field validation so error highlight is removed
        // as soon as the field becomes valid again.
        attachFieldValidation('name', (value) =>
            value ? '' : 'Please enter your name.'
        );

        attachFieldValidation('email', (value) => {
            if (!value) return 'Please enter your email address.';
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(value)
                ? ''
                : 'Please enter a valid email address.';
        });

        attachFieldValidation('telephone', (value) => {
            if (!value) return 'Please enter your telephone number.';
            const phonePattern = /^[0-9+()\\s-]{9,}$/;
            return phonePattern.test(value)
                ? ''
                : 'The telephone number format is incorrect.';
        });

        attachFieldValidation('message', (value) => {
            if (!value) return 'Please enter your message.';
            if (value.length < 5) return 'Message must be at least 5 characters.';
            return '';
        });
    }

    // Out of Hours accordion toggle
    const outOfHoursToggle = document.getElementById('out-of-hours-toggle');
    const outOfHoursContent = document.getElementById('out-of-hours-content');

    if (outOfHoursToggle && outOfHoursContent) {
        const question = outOfHoursToggle.closest('.question.out-of-hours');

        if (question) {
            const setMaxHeight = (value) => {
                outOfHoursContent.style.maxHeight = value;
            };

            const forceReflow = () => {
                void outOfHoursContent.offsetHeight;
            };

            const expandAccordion = () => {
                outOfHoursContent.classList.remove('is-collapsing');
                question.classList.add('active');

                const expandedHeight = outOfHoursContent.scrollHeight;
                setMaxHeight('0px');
                forceReflow();

                requestAnimationFrame(() => {
                    setMaxHeight(`${expandedHeight}px`);
                });
            };

            const collapseAccordion = () => {
                const currentHeight = outOfHoursContent.scrollHeight;
                outOfHoursContent.classList.add('is-collapsing');
                setMaxHeight(`${currentHeight}px`);
                forceReflow();

                requestAnimationFrame(() => {
                    setMaxHeight('0px');
                });

                question.classList.remove('active');
            };

            outOfHoursToggle.addEventListener('click', (event) => {
                event.preventDefault();

                if (question.classList.contains('active')) {
                    collapseAccordion();
                } else {
                    expandAccordion();
                }
            });

            outOfHoursContent.addEventListener('transitionend', (event) => {
                if (event.propertyName !== 'max-height') {
                    return;
                }

                if (question.classList.contains('active')) {
                    // Allow the content to grow naturally once fully expanded.
                    outOfHoursContent.style.maxHeight = 'none';
                } else {
                    outOfHoursContent.classList.remove('is-collapsing');
                    setMaxHeight('0px');
                }
            });

            window.addEventListener('resize', () => {
                if (question.classList.contains('active')) {
                    setMaxHeight(`${outOfHoursContent.scrollHeight}px`);
                }
            });
        }
    }

    // Pretty checkbox: fill on click
    const prettyCheckboxLabel = document.querySelector(
        '#contact-form label.pretty-checkbox'
    );

    if (prettyCheckboxLabel) {
        const checkbox = prettyCheckboxLabel.querySelector(
            'input[type="checkbox"]'
        );

        if (checkbox) {
            const syncPrettyCheckbox = () => {
                prettyCheckboxLabel.classList.toggle('active', checkbox.checked);
            };

            // Initial state
            syncPrettyCheckbox();

            checkbox.addEventListener('change', syncPrettyCheckbox);
        }
    }
})();
