var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PwaAuthImpl_1;
import { LitElement, html, css, customElement, property } from 'lit-element';
let PwaAuthImpl = PwaAuthImpl_1 = class PwaAuthImpl extends LitElement {
    constructor() {
        super(...arguments);
        this.appearance = "button";
        this.signInButtonText = "Sign in";
        this.microsoftButtonText = "Sign in with Microsoft";
        this.googleButtonText = "Sign in with Google";
        this.facebookButtonText = "Sign in with Facebook";
        this.appleButtonText = "Sign in with Apple";
        this.credentialMode = "silent";
        this.menuOpened = false;
        this.menuPlacement = "start";
        this.disabled = false;
        this.iconLoading = "lazy";
        this.requireNewAccessToken = false; // If true, user always goes through OAuth flow to acquire a new access token. If false, user can sign-in using a stored credential with possibly stale access token.
        this.providers = [
            {
                name: "Microsoft",
                url: "https://graph.microsoft.com",
                getKey: () => this.microsoftKey,
                getButtonText: () => this.microsoftButtonText,
                getIconUrl: () => this.getMicrosoftIconUrl(),
                import: (key) => this.importMicrosoftProvider(key),
                btnClass: "microsoft-btn",
                buttonPartName: "microsoftButton",
                containerPartName: "microsoftContainer",
                iconPartName: "microsoftIcon",
                signIn: () => this.signIn("Microsoft")
            },
            {
                name: "Google",
                url: "https://account.google.com",
                getKey: () => this.googleKey,
                getButtonText: () => this.googleButtonText,
                getIconUrl: () => this.getGoogleIconUrl(),
                import: (key) => this.importGoogleProvider(key),
                btnClass: "google-btn",
                buttonPartName: "googleButton",
                containerPartName: "googleContainer",
                iconPartName: "googleIcon",
                signIn: () => this.signIn("Google")
            },
            {
                name: "Facebook",
                url: "https://www.facebook.com",
                getKey: () => this.facebookKey,
                getButtonText: () => this.facebookButtonText,
                getIconUrl: () => this.getFacebookIconUrl(),
                import: (key) => this.importFacebookProvider(key),
                btnClass: "facebook-btn",
                buttonPartName: "facebookButton",
                containerPartName: "facebookContainer",
                iconPartName: "facebookIcon",
                signIn: () => this.signIn("Facebook")
            },
            {
                name: "Apple",
                url: "https://appleid.apple.com",
                getKey: () => this.appleKey,
                getButtonText: () => this.appleButtonText,
                getIconUrl: () => this.getAppleIconUrl(),
                import: (key) => this.importAppleProvider(key),
                btnClass: "apple-btn",
                buttonPartName: "appleButton",
                containerPartName: "appleContainer",
                iconPartName: "appleIcon",
                signIn: () => this.signIn("Apple")
            },
        ];
    }
    firstUpdated() {
        // If we're on Safari, we need to load dependencies up front to avoid Safari
        // blocking the first OAuth popup. See https://github.com/pwa-builder/pwa-auth/issues/3
        if (this.isWebKit()) {
            this.disabled = true;
            this.loadAllDependencies()
                .finally(() => this.disabled = false);
        }
    }
    render() {
        if (!this.hasAnyKey) {
            return this.renderNoKeysError();
        }
        if (this.appearance === "list") {
            return this.renderListButtons();
        }
        if (this.appearance === "button") {
            return this.renderLoginButton();
        }
        return super.render();
    }
    /**
     * Starts the sign-in process using the specified provider.
     * @param providerName The name provider to sign-in with. Must be "Microsoft", "Google", "Facebook", or "Apple"
     */
    signIn(providerName) {
        const provider = this.providers.find(p => p.name === providerName);
        if (!provider) {
            const errorMessage = "Unable to sign-in because of unsupported provider";
            console.error(errorMessage, providerName);
            return Promise.reject(errorMessage + " " + providerName);
        }
        return this.signInWithProvider(provider)
            .then(result => this.signInCompleted(result));
    }
    getMicrosoftIconUrl() {
        if (this.appearance === "button") {
            return `${PwaAuthImpl_1.assetBaseUrl}/microsoft-icon-button.svg`;
        }
        return `${PwaAuthImpl_1.assetBaseUrl}/microsoft-icon-list.svg`;
    }
    getGoogleIconUrl() {
        return `${PwaAuthImpl_1.assetBaseUrl}/google-icon.svg`;
    }
    getFacebookIconUrl() {
        if (this.appearance === "button") {
            return `${PwaAuthImpl_1.assetBaseUrl}/facebook-icon-button.svg`;
        }
        return `${PwaAuthImpl_1.assetBaseUrl}/facebook-icon-list.svg`;
    }
    getAppleIconUrl() {
        if (this.appearance === "button") {
            return `${PwaAuthImpl_1.assetBaseUrl}/apple-icon-button.svg`;
        }
        return `${PwaAuthImpl_1.assetBaseUrl}/apple-icon-list.svg`;
    }
    renderLoginButton() {
        return html `
            <div class="dropdown" @focusout="${this.dropdownFocusOut}">
                <button class="signin-btn" part="signInButton" ?disabled=${this.disabled} @click="${this.signInClicked}">
                    ${this.signInButtonText}
                </button>
                <div class="menu ${this.menuOpened ? "open" : ""} ${this.menuPlacement === "end" ? "align-end" : ""}" part="dropdownMenu">
					${this.renderListButtons()}
                </div>
            </div>
        `;
    }
    renderListButtons() {
        return html `
            ${this.providers
            .filter(provider => !!provider.getKey())
            .map(provider => html `
                <div class="provider" part="${provider.containerPartName}">
                    <button class="${provider.btnClass}" ?disabled=${this.disabled} part="${provider.buttonPartName}" @click="${provider.signIn}">
                        <img part="${provider.iconPartName}" loading="${this.iconLoading}" width="20px" height="20px" src="${provider.getIconUrl()}" />
                        ${provider.getButtonText()}
                    </button>
                </div>
            `)}
        `;
    }
    renderNoKeysError() {
        return html `<div class="provider-error"><strong>❌ No available sign-ins</strong><br><em>To enable sign-in, pass a Microsoft key, Google key, Facebook, or Apple key to the &lt;pwa-auth&gt; component.</em><br><pre>&lt;pwa-auth microsoftkey="..."&gt;&lt;/pwa-auth&gt;</pre></div>`;
    }
    dropdownFocusOut(e) {
        var _a;
        // Close the dropdown if the focus is no longer within it.
        if (this.menuOpened) {
            const dropdown = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector(".dropdown");
            const dropdownContainsFocus = dropdown === null || dropdown === void 0 ? void 0 : dropdown.matches(":focus-within");
            if (!dropdownContainsFocus) {
                this.menuOpened = false;
            }
        }
    }
    get hasAnyKey() {
        return this.providers.some(p => !!p.getKey());
    }
    async signInClicked() {
        // Are we configured to use browser credentials (the new CredentialStore API)?
        // If so, go ahead and sign in with whatever stored credential we have.
        if (this.credentialMode === "none") {
            this.toggleMenu();
        }
        else {
            const signedInCreds = await this.tryAutoSignIn();
            if (!signedInCreds) {
                // There was no stored credential to sign in with. Just show the menu.
                this.toggleMenu();
            }
        }
    }
    toggleMenu() {
        this.menuOpened = !this.menuOpened;
    }
    signInWithProvider(provider) {
        const key = provider.getKey();
        if (!key) {
            return Promise.reject("No key specified");
        }
        if (this.disabled) {
            return Promise.reject("Sign-in already in progress, rejecting new sign-in attempt");
        }
        this.disabled = true;
        this.menuOpened = false;
        return this.trySignInWithStoredCredential(provider.url)
            .then(storedCredSignInResult => {
            // Did we sign in with a stored credential? Good, we're done.
            if (storedCredSignInResult) {
                return storedCredSignInResult;
            }
            // Couldn't sign in with stored credential.
            // Kick off the provider-specified OAuth flow.
            return provider.import(key)
                .then(p => p.signIn())
                .catch(error => {
                // If the provider sends back an error, consider that a SignInResult
                const providerError = {
                    error: error,
                    provider: provider.name
                };
                return providerError;
            });
        })
            .finally(() => this.disabled = false);
    }
    signInCompleted(signIn) {
        this.rehydrateAccessToken(signIn);
        this.dispatchEvent(new CustomEvent("signin-completed", { detail: signIn }));
        this.tryStoreCredential(signIn);
        return signIn;
    }
    importMicrosoftProvider(key) {
        return import("./microsoft-provider")
            .then(module => new module.MicrosoftProvider(key));
    }
    importGoogleProvider(key) {
        return import("./google-provider")
            .then(module => new module.GoogleProvider(key));
    }
    importFacebookProvider(key) {
        return import("./facebook-provider")
            .then(module => new module.FacebookProvider(key));
    }
    importAppleProvider(key) {
        return import("./apple-provider")
            .then(module => new module.AppleProvider(key, this.appleRedirectUri));
    }
    tryStoreCredential(signIn) {
        var _a;
        // Use the new Credential Management API to store the credential, allowing for automatic sign-in next time the user visits the page.
        // https://developers.google.com/web/fundamentals/security/credential-management/
        const federatedCredentialCtor = window["FederatedCredential"];
        if (signIn.email && federatedCredentialCtor) {
            try {
                const cred = new federatedCredentialCtor({
                    id: signIn.email,
                    provider: ((_a = this.providers.find(p => p.name === signIn.provider)) === null || _a === void 0 ? void 0 : _a.url) || signIn.provider,
                    name: signIn.name || "",
                    iconURL: signIn.imageUrl || ""
                });
                navigator.credentials.store(cred);
            }
            catch (error) {
                console.error("Unable to store federated credential", error);
            }
        }
    }
    async tryAutoSignIn() {
        // Use the new Credential Management API to login the user automatically.
        // https://developers.google.com/web/fundamentals/security/credential-management/
        // Bail if we don't support Credential Management
        if (!window["FederatedCredential"]) {
            return null;
        }
        // Bail if we're forcing OAuth flow.
        if (this.requireNewAccessToken) {
            return null;
        }
        let credential = null;
        if (this.credentialMode === "prompt") {
            // Let the user choose.
            // The browser brings up the native "choose your sign in" dialog.
            credential = await this.getStoredCredential("required", this.providers.map(p => p.url));
        }
        else if (this.credentialMode === "silent") {
            // Go through the available providers and find one that the user has logged in with.
            for (let i = 0; i < this.providers.length; i++) {
                const provider = this.providers[i];
                credential = await this.getStoredCredential("silent", [provider.url]);
                if (credential) {
                    break;
                }
            }
        }
        if (credential) {
            const loginResult = this.credentialToSignInResult(credential);
            this.signInCompleted(loginResult);
        }
        return credential;
    }
    trySignInWithStoredCredential(providerUrl) {
        return this.getStoredCredential("silent", [providerUrl])
            .catch(error => console.warn("Error attempting to sign-in with stored credential", error))
            .then(credential => credential ? this.credentialToSignInResult(credential) : null);
    }
    getStoredCredential(mediation, providerUrls) {
        // Bail if we don't support Credential Management
        if (!window["FederatedCredential"]) {
            return Promise.resolve(null);
        }
        // Bail if we're not allowed to use stored credential.
        if (this.requireNewAccessToken) {
            return Promise.resolve(null);
        }
        const credOptions = {
            mediation: mediation,
            federated: {
                providers: providerUrls
            }
        };
        return navigator.credentials.get(credOptions);
    }
    credentialToSignInResult(cred) {
        return {
            name: cred.name,
            email: cred.id,
            providerData: null,
            imageUrl: cred.iconURL,
            error: null,
            provider: this.getProviderNameFromUrl(cred.provider)
        };
    }
    getProviderNameFromUrl(url) {
        const provider = this.providers.find(p => p.url === url);
        if (!provider) {
            console.warn("Unable to find provider matching URL", url);
            return "Microsoft";
        }
        return provider.name;
    }
    isWebKit() {
        // As of April 2020, Webkit-based browsers wrongfully blocks
        // the OAuth popup due to lazy-loading the auth library(s).
        const isIOS = !!navigator.userAgent.match(/ipad|iphone/i); // everything is WebKit on iOS
        const isSafari = !!navigator.vendor && navigator.vendor.includes("Apple");
        return isIOS || isSafari;
    }
    loadAllDependencies() {
        const dependencyLoadTasks = this.providers
            .filter(p => !!p.getKey())
            .map(p => p.import(p.getKey()).then(p => p.loadDependencies()));
        return Promise.all(dependencyLoadTasks)
            .catch(error => console.error("Error loading dependencies", error));
    }
    tryUpdateStoredTokenInfo(signIn) {
        const localStorageKey = this.getAuthTokenLocalStorageKeyName(signIn.provider);
        const storedToken = {
            token: signIn.accessToken || null,
            expiration: signIn.accessTokenExpiration || null,
            providerData: signIn.providerData
        };
        try {
            localStorage.setItem(localStorageKey, JSON.stringify(storedToken));
        }
        catch (error) {
            console.warn("Unable to store auth token in local storage", localStorageKey, signIn, error);
        }
    }
    tryReadStoredTokenInfo(providerName) {
        const localStorageKey = this.getAuthTokenLocalStorageKeyName(providerName);
        try {
            const tokenJson = localStorage.getItem(localStorageKey);
            return tokenJson ? JSON.parse(tokenJson) : null;
        }
        catch (error) {
            console.warn("Unable to read auth token from local storage", localStorageKey, error);
            return null;
        }
    }
    getAuthTokenLocalStorageKeyName(providerName) {
        return `${PwaAuthImpl_1.authTokenLocalStoragePrefix}-${providerName}`;
    }
    rehydrateAccessToken(signIn) {
        if (signIn.accessToken) {
            // If the user signed in with OAuth flow just now, we already have the auth token.
            // Store it for later.
            this.tryUpdateStoredTokenInfo(signIn);
        }
        else {
            // We don't have an access token, meaning we signed-in with a stored credential.
            // Thus, we'll fetch it from local storage.
            const tokenInfo = this.tryReadStoredTokenInfo(signIn.provider);
            if (tokenInfo) {
                signIn.accessToken = tokenInfo.token;
                signIn.accessTokenExpiration = tokenInfo.expiration;
                signIn.providerData = tokenInfo.providerData;
            }
        }
    }
};
PwaAuthImpl.assetBaseUrl = "https://cdn.jsdelivr.net/npm/@pwabuilder/pwaauth@latest/assets";
PwaAuthImpl.authTokenLocalStoragePrefix = "pwa-auth-token";
PwaAuthImpl.styles = css `

		:host {
			display: inline-block;
		}

        button {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }

        :host([appearance="list"]) .provider {
            width: 200px;
		}
		:host([appearance="list"]) .provider + .provider {
			margin-top: 10px;
		}

        :host([appearance="list"]) .provider button {
			display: block;
            width: 100%;
            padding: 10px;
            cursor: pointer;
            border-radius: 2px;
            border-width: 0;
            text-align: left;
        }

        :host([appearance="list"]) .provider button img {
            vertical-align: middle;
            margin-right: 10px;
            margin-left: 5px;
        }

        :host([appearance="list"]) .google-btn {
            background-color: white;
            border: 1px solid rgb(192, 192, 192);
        }

        :host([appearance="list"]) .google-btn:hover {
            background-color: rgb(245, 245, 246);
        }

        :host([appearance="list"]) .microsoft-btn {
            color: white;
            background-color: rgb(84, 84, 84);
        }

        :host([appearance="list"]) .microsoft-btn:hover {
            background-color: rgb(47, 51, 55);
        }

        :host([appearance="list"]) .facebook-btn {
            color: white;
            background-color: #385499;
        }

        :host([appearance="list"]) .facebook-btn:hover {
            background-color: #314a86;
        }

        :host([appearance="list"]) .apple-btn {
            background-color: black;
            color: white;
        }

        .signin-btn {
            background-color: rgb(225, 230, 234);
            border: 1px solid rgb(220, 224, 229);
            color: rgb(33, 37, 41);
            border-radius: 4px;
            padding: 12px;
            transition: all 0.15s ease-in-out;
            outline: none;
            cursor: pointer;
        }

            .signin-btn:hover:not(:disabled) {
                background-color: rgb(220, 224, 228);
                border-color: rgb(212, 218, 223);
            }

            .signin-btn:focus {
                background-color: rgb(219, 225, 230);
                border-color: rgb(212, 218, 224);
                box-shadow: rgba(216, 217, 219, 0.1) 0 0 0 3.2px;
            }

            .signin-btn:active {
                background-color: rgb(210, 214, 218);
                border-color: rgb(202, 208, 213);
            }

            .signin-btn:disabled {
                color: rgba(16, 16, 16, 0.3);
            }

        .dropdown {
            position: relative;
            display: inline-block;
        }

        .dropdown .menu {
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 1000;
            display: none;
            float: left;
            min-width: 10rem;
            padding: .5rem 0;
            margin: .125rem 0 0;
            font-size: 1rem;
            background-color: white;
            background-clip: padding-box;
            border: 1px solid rgba(0,0,0,.15);
            border-radius: .25rem;
            cursor: pointer;
        }

        .dropdown .menu.open {
            display: block;
            transform: translate3d(0px, 38px, 0px);
            top: 0;
            left: 0;

            animation-name: dropdown-animation;
            animation-duration: 300ms;
        }

        .dropdown .menu.open.align-end {
            left: auto;
            right: 0;
        }

        .dropdown .menu button {
            background-color: transparent;
            white-space: nowrap;
            border: none;
            outline: none;
            padding: 8px 24px 8px 24px;
            cursor: pointer;
            width: 100%;
            text-align: left;
        }

            .dropdown .menu button:hover {
                background-color: rgb(245, 246, 247);
            }

            .dropdown .menu button:active {
                background-color: rgb(240, 241, 242);
            }

        .dropdown .menu button img {
            vertical-align: middle;
            margin-right: 10px;
        }

        .provider-error {
            background-color: rgb(220, 53, 69);
            color: white;
            padding: 20px;
        }

        @keyframes dropdown-animation {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media(prefers-reduced-motion: reduce) {
            .dropdown .menu.open {
                animation: none;
            }
        }
    `;
__decorate([
    property({ type: String, reflect: true })
], PwaAuthImpl.prototype, "appearance", void 0);
__decorate([
    property({ type: String })
], PwaAuthImpl.prototype, "signInButtonText", void 0);
__decorate([
    property({ type: String })
], PwaAuthImpl.prototype, "microsoftButtonText", void 0);
__decorate([
    property({ type: String })
], PwaAuthImpl.prototype, "googleButtonText", void 0);
__decorate([
    property({ type: String })
], PwaAuthImpl.prototype, "facebookButtonText", void 0);
__decorate([
    property({ type: String })
], PwaAuthImpl.prototype, "appleButtonText", void 0);
__decorate([
    property({ type: String })
], PwaAuthImpl.prototype, "appleRedirectUri", void 0);
__decorate([
    property({ type: String })
], PwaAuthImpl.prototype, "microsoftKey", void 0);
__decorate([
    property({ type: String })
], PwaAuthImpl.prototype, "googleKey", void 0);
__decorate([
    property({ type: String })
], PwaAuthImpl.prototype, "facebookKey", void 0);
__decorate([
    property({ type: String })
], PwaAuthImpl.prototype, "appleKey", void 0);
__decorate([
    property({ type: String })
], PwaAuthImpl.prototype, "credentialMode", void 0);
__decorate([
    property({ type: Boolean })
], PwaAuthImpl.prototype, "menuOpened", void 0);
__decorate([
    property({ type: String, reflect: true })
], PwaAuthImpl.prototype, "menuPlacement", void 0);
__decorate([
    property({ type: Boolean })
], PwaAuthImpl.prototype, "disabled", void 0);
__decorate([
    property({ type: String })
], PwaAuthImpl.prototype, "iconLoading", void 0);
__decorate([
    property({ type: Boolean })
], PwaAuthImpl.prototype, "requireNewAccessToken", void 0);
PwaAuthImpl = PwaAuthImpl_1 = __decorate([
    customElement('pwa-auth')
], PwaAuthImpl);
export { PwaAuthImpl };
//# sourceMappingURL=pwa-auth.js.map