var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PwaAuth_1;
import { LitElement, html, css, customElement, property } from 'lit-element';
// This decorator defines the element.
let PwaAuth = PwaAuth_1 = class PwaAuth extends LitElement {
    constructor() {
        super(...arguments);
        this.appearance = "button";
        this.signInButtonText = "Sign in";
        this.microsoftButtonText = "Sign in with Microsoft";
        this.googleButtonText = "Sign in with Google";
        this.facebookButtonText = "Sign in with Facebook";
        this.autoSignIn = "none";
        this.menuOpened = false;
        this.menuPlacement = "start";
        this.disabled = false;
    }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        // // Close the popup if we click elsewhere. 
        // // TODO: is there a better way to do this?
        // window.addEventListener("click", (e: UIEvent) => {
        //     const isSignInBtn = !!e.target && !!e.target["matches"] && (e.target as HTMLElement).matches("pwa-auth");
        //     if (!isSignInBtn && this.menuOpened) {
        //         this.toggleMenu();
        //     }
        // })
    }
    render() {
        if (this.appearance === "list") {
            return this.renderProviderButtons();
        }
        return this.renderLoginButton();
    }
    renderLoginButton() {
        return html `
            <div class="dropdown" @focusout="${this.dropdownFocusOut}">
                <button class="signin-btn" @click="${this.signInClicked}">
                    ${this.signInButtonText}
                </button>
                <div class="menu ${this.menuOpened ? "open" : ""} ${this.menuPlacement === "end" ? "align-end" : ""}">
                    ${this.renderProviderButtons()}
                </div>
            </div>
        `;
    }
    dropdownFocusOut(e) {
        // See if we need to close the menu.
        if (this.menuOpened) {
            const dropdown = this.shadowRoot?.querySelector(".dropdown");
            const dropdownContainsFocus = !!e.relatedTarget && dropdown?.matches(":focus-within");
            if (!dropdownContainsFocus) {
                this.menuOpened = false;
            }
        }
    }
    renderProviderButtons() {
        return html `
            <div class="provider">
                <button class="microsoft" ?disabled=${this.disabled} @click="${this.signInMs}">
                    <span>
                        <svg viewBox="0 0 500 500" style="width: 25px; height: 25px;"><g id="XMLID_1_"><polygon id="XMLID_3_" fill="white" points="67.5,118.8 216.7,98.5 216.7,242.3 67.6,243.2  "/><polygon id="XMLID_4_" fill="white" points="234.7,95.8 432.4,66.9 432.4,240.5 234.7,242.1  "/><polygon id="XMLID_5_" fill="white" points="216.6,258.9 216.7,402.9 67.6,382.4 67.6,258  "/><polygon id="XMLID_6_" fill="white" points="432.5,260.3 432.5,433.1 234.7,405.1 234.4,259.9  "/></g></svg>
                        ${this.microsoftButtonText}
                    </span>
                </button>
            </div>
            <div class="provider">
                <button class="google" ?disabled=${this.disabled} @click="${this.signInGoogle}">
                    <span>
                        <svg width="25" height="25" class="mk ml u"><g fill="none" fill-rule="evenodd"><path d="M20.66 12.7c0-.61-.05-1.19-.15-1.74H12.5v3.28h4.58a3.91 3.91 0 0 1-1.7 2.57v2.13h2.74a8.27 8.27 0 0 0 2.54-6.24z" fill="#4285F4"></path><path d="M12.5 21a8.1 8.1 0 0 0 5.63-2.06l-2.75-2.13a5.1 5.1 0 0 1-2.88.8 5.06 5.06 0 0 1-4.76-3.5H4.9v2.2A8.5 8.5 0 0 0 12.5 21z" fill="#34A853"></path><path d="M7.74 14.12a5.11 5.11 0 0 1 0-3.23v-2.2H4.9A8.49 8.49 0 0 0 4 12.5c0 1.37.33 2.67.9 3.82l2.84-2.2z" fill="#FBBC05"></path><path d="M12.5 7.38a4.6 4.6 0 0 1 3.25 1.27l2.44-2.44A8.17 8.17 0 0 0 12.5 4a8.5 8.5 0 0 0-7.6 4.68l2.84 2.2a5.06 5.06 0 0 1 4.76-3.5z" fill="#EA4335"></path></g></svg>
                        ${this.googleButtonText}
                    </span>
                </button>
            </div>
            <div class="provider">
                <button class="facebook" @click="${this.signInFacebook}">
                    <span>
                        <svg width="25" height="25" fill="#3B5998" class="mk ml u"><path fill="white" d="M20.3 4H4.7a.7.7 0 0 0-.7.7v15.6c0 .38.32.7.7.7h8.33v-6.38h-2.12v-2.65h2.12V9.84c0-2.2 1.4-3.27 3.35-3.27.94 0 1.75.07 1.98.1v2.3H17c-1.06 0-1.31.5-1.31 1.24v1.76h2.65l-.53 2.65H15.7l.04 6.38h4.56a.7.7 0 0 0 .71-.7V4.7a.7.7 0 0 0-.7-.7" fill-rule="evenodd"></path></svg>
                        ${this.facebookButtonText}
                    </span>
                </button>
            </div>
            <div class="provider" style="display: none;">
                <button class="twitter">
                    <span>
                        <svg width="25" height="25" viewBox="0 0 25 25" class="mo mk ml u"><path fill="white" d="M20.5 6.25c-.67.41-1.4.7-2.18.87a3.45 3.45 0 0 0-5.02-.1 3.49 3.49 0 0 0-1.02 2.47c0 .27.03.54.07.8a9.91 9.91 0 0 1-7.17-3.67 3.9 3.9 0 0 0-.5 1.74 3.6 3.6 0 0 0 1.56 2.92 3.36 3.36 0 0 1-1.55-.44v.06c0 1.67 1.2 3.08 2.8 3.42-.3.06-.6.1-.94.12l-.62-.06a3.5 3.5 0 0 0 3.24 2.43 7.34 7.34 0 0 1-4.36 1.5L4 18.24a9.96 9.96 0 0 0 5.36 1.56c6.4 0 9.91-5.32 9.9-9.9v-.5c.69-.48 1.28-1.1 1.74-1.8-.63.29-1.3.48-2 .55a3.33 3.33 0 0 0 1.5-1.93"></path></svg>
                        Log in with Twitter
                    </span>
                </button>
            </div>
        `;
    }
    async signInClicked() {
        // Do we have auto-sign in? If so, go ahead and sign in with whatever stored credential we have.
        if (this.autoSignIn === "none") {
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
        if (this.msClientId && !this.disabled) {
            import("./microsoft-provider")
                .then(module => new module.MicrosoftAuth(this.msClientId).signIn())
                .then(result => this.loginCompleted(result))
                .catch(error => this.loginCompleted({
                error: error,
                provider: "Microsoft"
            }))
                .finally(() => this.disabled = false);
        }
    }
    signInGoogle() {
        const googleBtn = this.shadowRoot?.querySelector("button.google");
        if (this.googleClientId && googleBtn && !this.disabled) {
            this.disabled = true;
            import("./google-provider")
                .then(module => new module.GoogleProvider(this.googleClientId, googleBtn).signIn())
                .then(result => this.loginCompleted(result))
                .catch(error => this.loginCompleted({
                error: error,
                provider: "Google"
            }))
                .finally(() => this.disabled = false);
        }
    }
    signInFacebook() {
        if (this.facebookAppId && !this.disabled) {
            this.disabled = true;
            import("./facebook-provider")
                .then(module => new module.FacebookProvider(this.facebookAppId).signIn())
                .then(result => this.loginCompleted(result))
                .catch(error => this.loginCompleted({
                error: error,
                provider: "Facebook"
            }))
                .finally(() => this.disabled = false);
        }
    }
    loginCompleted(login) {
        this.dispatchEvent(new CustomEvent("login-completed", { detail: login }));
        this.tryStoreCredential(login);
    }
    tryStoreCredential(login) {
        // Use the new Credential Management API to store the credential, allowing for automatic sign-in next time the user visits the page.
        // https://developers.google.com/web/fundamentals/security/credential-management/
        const federatedCredentialCtor = window["FederatedCredential"];
        if (login.email && federatedCredentialCtor) {
            const cred = new federatedCredentialCtor({
                id: login.email,
                provider: PwaAuth_1.providerUrls[login.provider],
                name: login.name,
                iconURL: login.imageUrl || ""
            });
            navigator.credentials.store(cred);
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
        if (this.autoSignIn === "user-choice") {
            // Let the user choose. What this means:
            // The browser brings up the native "choose your sign in" dialog.
            credential = await this.getStoredCredential("required", Object.values(PwaAuth_1.providerUrls));
        }
        else if (this.autoSignIn === "first-available") {
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
            const loginResult = this.credentialToLoginResult(credential);
            this.loginCompleted(loginResult);
        }
        return credential;
    }
    getStoredCredential(mediation, providerUrls) {
        const credOptions = {
            mediation: mediation,
            federated: {
                providers: providerUrls
            }
        };
        return navigator.credentials.get(credOptions);
    }
    credentialToLoginResult(cred) {
        return {
            name: cred.name,
            email: cred.id,
            info: null,
            imageUrl: cred.iconURL,
            error: null,
            provider: this.getProviderNameFromUrl(cred.provider)
        };
    }
    getProviderNameFromUrl(url) {
        return Object.keys(PwaAuth_1.providerUrls)
            .find(key => PwaAuth_1.providerUrls[key] === url);
    }
};
PwaAuth.providerUrls = {
    "Microsoft": "https://graph.microsoft.com",
    "Google": "https://account.google.com",
    "Facebook": "https://www.facebook.com"
};
PwaAuth.styles = css `

        button {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }

        .provider {
            width: 200px;
            margin-bottom: 10px;
        }

        .provider button {
            width: 100%;
            padding: 5px;
            cursor: pointer;
            border-radius: 2px;
            border-width: 0;
            text-align: left;
        }

        .provider button span {
            display: block;
        }

        .provider button svg {
            vertical-align: middle;
            margin-right: 10px;
            margin-left: 5px;
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

            .signin-btn:hover {
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
        }

        .dropdown .menu.open {
            display: block;
            transform: translate3d(0px, 38px, 0px);
            top: 0;
            left: 0;
        }

        .dropdown .menu.open.align-end {
            left: auto;
            right: 0;
        }

        button.google {
            background-color: white;
            border: 1px solid rgb(192, 192, 192);
        }

        button.google:hover {
            background-color: rgb(250, 250, 251);
        }

        button.microsoft {
            color: white;
            background-color: rgb(84, 84, 84);
        }

        button.microsoft:hover {
            background-color: rgb(47, 51, 55);
        }

        button.facebook {
            color: white;
            background-color: #385499;
        }

        button.facebook:hover {
            background-color: #314a86;
        }

        button.twitter {
            background-color: rgb(85, 172, 238);
            color: white;
        }
    `;
__decorate([
    property({ type: String })
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
], PwaAuth.prototype, "msClientId", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "googleClientId", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "facebookAppId", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "autoSignIn", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "menuOpened", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "menuPlacement", void 0);
PwaAuth = PwaAuth_1 = __decorate([
    customElement('pwa-auth')
], PwaAuth);
export { PwaAuth };
//# sourceMappingURL=pwa-auth.js.map