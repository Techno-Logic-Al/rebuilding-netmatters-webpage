    /**
     *  Cookies Bar Accept
     */
    const siteConsent = document.querySelector("#site-consent");
    const consentManage = document.querySelector("#consent-btn-manage");
    const consentSettings = document.querySelector("#consent-btn-settings");
    const consentAccept = document.querySelector("#consent-btn-accept");

    const hideManageButton = () => {
        if (!consentManage) {
            return;
        }

        consentManage.setAttribute("hidden", "");
    };

    const showManageButton = () => {
        if (!consentManage) {
            return;
        }

        consentManage.removeAttribute("hidden");
    };

    const settingsHandler = () => {
        // Temp Clears Consent
        localStorage.removeItem("hasGivenConsent");
    };

    const acceptHandler = () => {
        localStorage.setItem("hasGivenConsent", "true");
        toggleConsentBar();
        hideManageButton();
    };

    const toggleConsentBar = () => {
        siteConsent.classList.toggle("active");
    };

    const consentHandler = () => {
        let hasGivenConsent = localStorage.getItem("hasGivenConsent");

        if (!hasGivenConsent) {
            showManageButton();
            toggleConsentBar();
            return;
        }

        hideManageButton();
    };

    document.addEventListener("DOMContentLoaded", consentHandler);
    consentManage.addEventListener("click", toggleConsentBar);
    consentAccept.addEventListener("click", acceptHandler);
    consentSettings.addEventListener("click", settingsHandler);
