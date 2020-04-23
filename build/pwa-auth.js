var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PwaAuth_1;
import { LitElement, html, css, customElement, property } from 'lit-element';
let PwaAuth = PwaAuth_1 = class PwaAuth extends LitElement {
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
     * @param provider The provider to sign-in with. Must be "Microsoft", "Google", "Facebook", or "Apple"
     */
    signIn(provider) {
        if (provider === "Microsoft") {
            this.signInMs();
        }
        else if (provider === "Google") {
            this.signInGoogle();
        }
        else if (provider === "Facebook") {
            this.signInFacebook();
        }
        else if (provider === "Apple") {
            this.signInApple();
        }
        else {
            console.error("Unable to sign-in because of unsupported provider", provider);
        }
    }
    get microsoftButtonIcon() {
        switch (this.appearance) {
            case 'list': return html `<img part="microsoftIcon" loading="lazy" width="25px" height="25px" src="https://github.com/pwa-builder/pwa-auth/blob/master/assets/microsoft-icon-list.svg?raw=true" />`;
            case 'button': return html `<img part="microsoftIcon" loading="lazy" width="25px" height="25px" src="https://github.com/pwa-builder/pwa-auth/blob/master/assets/microsoft-icon-button.svg?raw=true" />`;
            default: return html ``;
        }
    }
    get googleButtonIcon() {
        return html `<img part="googleIcon" loading="lazy" width="25px" height="25px" src="https://github.com/pwa-builder/pwa-auth/blob/master/assets/google-icon.svg?raw=true" />`;
    }
    get facebookButtonIcon() {
        switch (this.appearance) {
            case 'list': return html `<img part="facebookIcon" loading="lazy" width="25px" height="25px" src="https://github.com/pwa-builder/pwa-auth/blob/master/assets/facebook-icon-list.svg?raw=true"`;
            case 'button': return html `<img part="facebookIcon" loading="lazy" width="25px" height="25px" src="https://github.com/pwa-builder/pwa-auth/blob/master/assets/facebook-icon-button.svg?raw=true"`;
            default: return '';
        }
    }
    get appleButtonIcon() {
        switch (this.appearance) {
            case 'list': return html `<img part="appleIcon" loading="lazy" width="20px" height="20px" src="https://github.com/pwa-builder/pwa-auth/blob/master/assets/apple-icon-list.png?raw=true" />`;
            case 'button': return html `<img part="appleIcon" loading="lazy" width="20px" height="20px" src="https://github.com/pwa-builder/pwa-auth/blob/master/assets/apple-icon-button.png?raw=true" />`;
            default: return html ``;
        }
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
            <div class="provider">
                <button class="microsoft-btn" ?disabled=${this.disabled} part="microsoftButton" @click="${this.signInMs}">
                    ${this.microsoftButtonIcon}
                	${this.microsoftButtonText}
                </button>
            </div>
            <div class="provider">
                <button class="google-btn" ?disabled=${this.disabled} part="googleButton" @click="${this.signInGoogle}">
					${this.googleButtonIcon}
					${this.googleButtonText}
                </button>
            </div>
            <div class="provider">
                <button class="facebook-btn" ?disabled=${this.disabled} part="facebookButton" @click="${this.signInFacebook}">
					${this.facebookButtonIcon}
					${this.facebookButtonText}
                </button>
            </div>
            <div class="provider">
                <button class="apple-btn" ?disabled=${this.disabled} part="appleButton" @click="${this.signInApple}">
					${this.appleButtonIcon}
					${this.appleButtonText}
                </button>
            </div>
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
        return !!this.microsoftKey || !!this.googleKey || !!this.facebookKey || !!this.appleKey;
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
    signInMs() {
        this.signInWithProvider(this.microsoftKey, "Microsoft", key => this.startMicrosoftSignInFlow(key))
            .then(result => this.signInCompleted(result));
    }
    signInGoogle() {
        this.signInWithProvider(this.googleKey, "Google", key => this.startGoogleSignInFlow(key))
            .then(result => this.signInCompleted(result));
    }
    signInFacebook() {
        this.signInWithProvider(this.facebookKey, "Facebook", key => this.startFacebookSignInFlow(key))
            .then(result => this.signInCompleted(result));
    }
    signInApple() {
        this.signInWithProvider(this.appleKey, "Apple", key => this.startAppleSignInFlow(key))
            .then(result => this.signInCompleted(result));
    }
    signInWithProvider(key, provider, providerSignIn) {
        if (!key) {
            return Promise.reject("No key specified");
        }
        if (this.disabled) {
            return Promise.reject("Sign-in already in progress, rejecting new sign-in attempt");
        }
        this.disabled = true;
        this.menuOpened = false;
        return this.tryLoginWithStoredCredential(PwaAuth_1.providerUrls[provider])
            .then(storedCredSignInResult => {
            // Did we sign in with a stored credential? Good, we're done.
            if (storedCredSignInResult) {
                return storedCredSignInResult;
            }
            // Couldn't sign in with stored credential.
            // Kick off the provider-specified OAuth flow.
            return providerSignIn(key)
                .catch(error => {
                // If the provider sends back an error, consider that a SignInResult
                const providerError = {
                    error: error,
                    provider: provider
                };
                return providerError;
            });
        })
            .finally(() => this.disabled = false);
    }
    signInCompleted(signIn) {
        this.dispatchEvent(new CustomEvent("signin-completed", { detail: signIn }));
        this.tryStoreCredential(signIn);
        return signIn;
    }
    importMicrosoftProvider(key) {
        return import("./microsoft-provider")
            .then(module => new module.MicrosoftProvider(key));
    }
    startMicrosoftSignInFlow(key) {
        return this.importMicrosoftProvider(key)
            .then(prov => prov.signIn());
    }
    importGoogleProvider(key) {
        return import("./google-provider")
            .then(module => new module.GoogleProvider(key));
    }
    startGoogleSignInFlow(key) {
        return this.importGoogleProvider(key)
            .then(prov => prov.signIn());
    }
    importFacebookProvider(key) {
        return import("./facebook-provider")
            .then(module => new module.FacebookProvider(key));
    }
    startFacebookSignInFlow(key) {
        return this.importFacebookProvider(key)
            .then(prov => prov.signIn());
    }
    importAppleProvider(key) {
        return import("./apple-provider")
            .then(module => new module.AppleProvider(key, this.appleRedirectUri));
    }
    startAppleSignInFlow(key) {
        return this.importAppleProvider(key)
            .then(prov => prov.signIn());
    }
    tryStoreCredential(signIn) {
        // Use the new Credential Management API to store the credential, allowing for automatic sign-in next time the user visits the page.
        // https://developers.google.com/web/fundamentals/security/credential-management/
        const federatedCredentialCtor = window["FederatedCredential"];
        if (signIn.email && federatedCredentialCtor) {
            try {
                const cred = new federatedCredentialCtor({
                    id: signIn.email,
                    provider: PwaAuth_1.providerUrls[signIn.provider],
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
        let credential = null;
        if (this.credentialMode === "prompt") {
            // Let the user choose.
            // The browser brings up the native "choose your sign in" dialog.
            credential = await this.getStoredCredential("required", Object.values(PwaAuth_1.providerUrls));
        }
        else if (this.credentialMode === "silent") {
            // Go through the available providers and find one that the user has logged in with.
            for (let providerName in PwaAuth_1.providerUrls) {
                const providerUrl = PwaAuth_1.providerUrls[providerName];
                credential = await this.getStoredCredential("silent", [providerUrl]);
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
    tryLoginWithStoredCredential(providerUrl) {
        return this.getStoredCredential("silent", [providerUrl])
            .catch(error => console.warn("Error attempting to sign-in with stored credential", error))
            .then(credential => credential ? this.credentialToSignInResult(credential) : null);
    }
    getStoredCredential(mediation, providerUrls) {
        // Bail if we don't support Credential Management
        if (!window["FederatedCredential"]) {
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
        return Object.keys(PwaAuth_1.providerUrls)
            .find(key => PwaAuth_1.providerUrls[key] === url);
    }
    isWebKit() {
        // As of April 2020, Webkit-based browsers wrongfully blocks
        // the OAuth popup due to lazy-loading the auth library(s).
        const isIOS = !!navigator.userAgent.match(/ipad|iphone/i); // everything is WebKit on iOS
        const isSafari = !!navigator.vendor && navigator.vendor.includes("Apple");
        return isIOS || isSafari;
    }
    loadAllDependencies() {
        const dependencyLoaders = [
            { key: this.microsoftKey, importer: (key) => this.importMicrosoftProvider(key) },
            { key: this.googleKey, importer: (key) => this.importGoogleProvider(key) },
            { key: this.facebookKey, importer: (key) => this.importFacebookProvider(key) },
            { key: this.appleKey, importer: (key) => this.importAppleProvider(key) }
        ];
        const dependencyLoadTasks = dependencyLoaders
            .filter(dep => !!dep.key)
            .map(dep => dep.importer(dep.key).then((p) => p.loadDependencies()));
        return Promise.all(dependencyLoadTasks)
            .catch(error => console.error("Error loading dependencies", error));
    }
};
PwaAuth.providerUrls = {
    "Microsoft": "https://graph.microsoft.com",
    "Google": "https://account.google.com",
    "Facebook": "https://www.facebook.com",
    "Apple": "https://appleid.apple.com"
};
PwaAuth.styles = css `

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
            padding: 5px;
            cursor: pointer;
            border-radius: 2px;
            border-width: 0;
            text-align: left;
        }

        :host([appearance="list"]) .provider button svg {
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

        .dropdown .menu button svg {
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
], PwaAuth.prototype, "appearance", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "signInButtonText", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "microsoftButtonText", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "googleButtonText", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "facebookButtonText", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "appleButtonText", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "appleRedirectUri", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "microsoftKey", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "googleKey", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "facebookKey", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "appleKey", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "credentialMode", void 0);
__decorate([
    property({ type: Boolean })
], PwaAuth.prototype, "menuOpened", void 0);
__decorate([
    property({ type: String, reflect: true })
], PwaAuth.prototype, "menuPlacement", void 0);
__decorate([
    property({ type: Boolean })
], PwaAuth.prototype, "disabled", void 0);
PwaAuth = PwaAuth_1 = __decorate([
    customElement('pwa-auth')
], PwaAuth);
export { PwaAuth };
//# sourceMappingURL=pwa-auth.js.map