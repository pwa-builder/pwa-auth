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
        this.credentialMode = "silent";
        this.menuOpened = false;
        this.menuPlacement = "start";
        this.disabled = false;
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
     * @param provider The provider to sign-in with. Must be "Microsoft", "Google", or "Facebook".
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
        else {
            console.error("Unable to sign-in because of unsupported provider", provider);
        }
    }
    renderLoginButton() {
        return html `
            <div class="dropdown" @focusout="${this.dropdownFocusOut}">
                <button class="signin-btn" part="signInButton" @click="${this.signInClicked}">
                    ${this.signInButtonText}
                </button>
                <div class="menu ${this.menuOpened ? "open" : ""} ${this.menuPlacement === "end" ? "align-end" : ""}" part="dropdownMenu">
                    <button class="microsoft-menu-btn" ?disabled=${this.disabled} part="microsoftButton" @click="${this.signInMs}">
                        <svg part="microsoftIcon" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 439 439"><rect x="17" y="17" fill="#F35325" width="194" height="194"/><rect x="228" y="17" fill="#81BC06" width="194" height="194"/><rect x="17" y="228" fill="#05A6F0" width="194" height="194"/><rect x="228" y="228" fill="#FFBA08" width="194" height="194"/></svg>
                        <span>${this.microsoftButtonText}</span>
                    </button>

                    <button class="google-menu-btn" ?disabled=${this.disabled} part="googleButton" @click="${this.signInGoogle}">
                        <svg part="googleIcon" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 533.5 544.3"><g><path fill="#4285F4" d="M533.5,278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1,33.8-25.7,63.7-54.4,82.7v68h87.7 C503.9,431.2,533.5,361.2,533.5,278.4z"/><path fill="#34A853" d="M272.1,544.3c73.4,0,135.3-24.1,180.4-65.7l-87.7-68c-24.4,16.6-55.9,26-92.6,26c-71,0-131.2-47.9-152.8-112.3 H28.9v70.1C75.1,486.3,169.2,544.3,272.1,544.3z"/><path fill="#FBBC04" d="M119.3,324.3c-11.4-33.8-11.4-70.4,0-104.2V150H28.9c-38.6,76.9-38.6,167.5,0,244.4L119.3,324.3z"/><path fill="#EA4335" d="M272.1,107.7c38.8-0.6,76.3,14,104.4,40.8l0,0l77.7-77.7C405,24.6,339.7-0.8,272.1,0C169.2,0,75.1,58,28.9,150 l90.4,70.1C140.8,155.6,201.1,107.7,272.1,107.7z"/></g></svg>                        
                        <span>${this.googleButtonText}</span>
                    </button>

                    <button class="facebook-menu-btn" ?disabled=${this.disabled} part="facebookButton" @click="${this.signInFacebook}">
                        <svg part="facebookIcon" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 500 500"><path style="fill:#3A559F;" d="M0,0v455.73h242.704V279.691h-59.33v-71.864h59.33v-60.353c0-43.893,35.582-79.475,79.475-79.475 h62.025v64.622h-44.382c-13.947,0-25.254,11.307-25.254,25.254v49.953h68.521l-9.47,71.864h-59.051V455.73H455.73V0H0z"/></svg>
                        <span>${this.facebookButtonText}</span>
                    </button>
                </div>
            </div>
        `;
    }
    renderListButtons() {
        return html `
            <div class="provider">
                <button class="microsoft-list-btn" ?disabled=${this.disabled} part="microsoftButton" @click="${this.signInMs}">
                    <span>
                        <svg part="microsoftIcon" viewBox="0 0 500 500" style="width: 25px; height: 25px;"><g id="XMLID_1_"><polygon id="XMLID_3_" fill="white" points="67.5,118.8 216.7,98.5 216.7,242.3 67.6,243.2  "/><polygon id="XMLID_4_" fill="white" points="234.7,95.8 432.4,66.9 432.4,240.5 234.7,242.1  "/><polygon id="XMLID_5_" fill="white" points="216.6,258.9 216.7,402.9 67.6,382.4 67.6,258  "/><polygon id="XMLID_6_" fill="white" points="432.5,260.3 432.5,433.1 234.7,405.1 234.4,259.9  "/></g></svg>
                        ${this.microsoftButtonText}
                    </span>
                </button>
            </div>
            <div class="provider">
                <button class="google-list-btn" ?disabled=${this.disabled} part="googleButton" @click="${this.signInGoogle}">
                    <span>
                        <svg part="googleIcon" width="25px" height="25px" class="mk ml u"><g fill="none" fill-rule="evenodd"><path d="M20.66 12.7c0-.61-.05-1.19-.15-1.74H12.5v3.28h4.58a3.91 3.91 0 0 1-1.7 2.57v2.13h2.74a8.27 8.27 0 0 0 2.54-6.24z" fill="#4285F4"></path><path d="M12.5 21a8.1 8.1 0 0 0 5.63-2.06l-2.75-2.13a5.1 5.1 0 0 1-2.88.8 5.06 5.06 0 0 1-4.76-3.5H4.9v2.2A8.5 8.5 0 0 0 12.5 21z" fill="#34A853"></path><path d="M7.74 14.12a5.11 5.11 0 0 1 0-3.23v-2.2H4.9A8.49 8.49 0 0 0 4 12.5c0 1.37.33 2.67.9 3.82l2.84-2.2z" fill="#FBBC05"></path><path d="M12.5 7.38a4.6 4.6 0 0 1 3.25 1.27l2.44-2.44A8.17 8.17 0 0 0 12.5 4a8.5 8.5 0 0 0-7.6 4.68l2.84 2.2a5.06 5.06 0 0 1 4.76-3.5z" fill="#EA4335"></path></g></svg>
                        ${this.googleButtonText}
                    </span>
                </button>
            </div>
            <div class="provider">
                <button class="facebook-list-btn" ?disabled=${this.disabled} part="facebookButton" @click="${this.signInFacebook}">
                    <span>
                        <svg part="facebookIcon" width="25px" height="25px" fill="#3B5998" class="mk ml u"><path fill="white" d="M20.3 4H4.7a.7.7 0 0 0-.7.7v15.6c0 .38.32.7.7.7h8.33v-6.38h-2.12v-2.65h2.12V9.84c0-2.2 1.4-3.27 3.35-3.27.94 0 1.75.07 1.98.1v2.3H17c-1.06 0-1.31.5-1.31 1.24v1.76h2.65l-.53 2.65H15.7l.04 6.38h4.56a.7.7 0 0 0 .71-.7V4.7a.7.7 0 0 0-.7-.7" fill-rule="evenodd"></path></svg>
                        ${this.facebookButtonText}
                    </span>
                </button>
            </div>
            <div class="provider" style="display: none;">
                <button class="twitter-list-btn">
                    <span>
                        <svg width="25px" height="25px" viewBox="0 0 25 25" class="mo mk ml u"><path fill="white" d="M20.5 6.25c-.67.41-1.4.7-2.18.87a3.45 3.45 0 0 0-5.02-.1 3.49 3.49 0 0 0-1.02 2.47c0 .27.03.54.07.8a9.91 9.91 0 0 1-7.17-3.67 3.9 3.9 0 0 0-.5 1.74 3.6 3.6 0 0 0 1.56 2.92 3.36 3.36 0 0 1-1.55-.44v.06c0 1.67 1.2 3.08 2.8 3.42-.3.06-.6.1-.94.12l-.62-.06a3.5 3.5 0 0 0 3.24 2.43 7.34 7.34 0 0 1-4.36 1.5L4 18.24a9.96 9.96 0 0 0 5.36 1.56c6.4 0 9.91-5.32 9.9-9.9v-.5c.69-.48 1.28-1.1 1.74-1.8-.63.29-1.3.48-2 .55a3.33 3.33 0 0 0 1.5-1.93"></path></svg>
                        Log in with Twitter
                    </span>
                </button>
            </div>
        `;
    }
    renderNoKeysError() {
        return html `<div class="provider-error"><strong>❌ No available sign-ins</strong><br><em>To enable sign-in, pass a Microsoft key, Google key, or Facebook key to the &lt;pwa-auth&gt; component.</em><br><pre>&lt;pwa-auth microsoftkey="..."&gt;&lt;/pwa-auth&gt;</pre></div>`;
    }
    dropdownFocusOut(e) {
        // Close the dropdown if the focus is no longer within it.
        if (this.menuOpened) {
            const dropdown = this.shadowRoot?.querySelector(".dropdown");
            const dropdownContainsFocus = dropdown?.matches(":focus-within");
            if (!dropdownContainsFocus) {
                this.menuOpened = false;
            }
        }
    }
    get hasAnyKey() {
        return !!this.microsoftKey || !!this.googleKey || !!this.facebookKey;
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
    startMicrosoftSignInFlow(key) {
        return import("./microsoft-provider")
            .then(module => new module.MicrosoftAuth(key).signIn());
    }
    startGoogleSignInFlow(key) {
        return import("./google-provider")
            .then(module => new module.GoogleProvider(key, this.shadowRoot).signIn());
    }
    startFacebookSignInFlow(key) {
        return import("./facebook-provider")
            .then(module => new module.FacebookProvider(key).signIn());
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

        .google-list-btn {
            background-color: white;
            border: 1px solid rgb(192, 192, 192);
        }

        .google-list-btn:hover {
            background-color: rgb(245, 245, 246);
        }

        .microsoft-list-btn {
            color: white;
            background-color: rgb(84, 84, 84);
        }

        .microsoft-list-btn:hover {
            background-color: rgb(47, 51, 55);
        }

        .facebook-list-btn {
            color: white;
            background-color: #385499;
        }

        .facebook-list-btn:hover {
            background-color: #314a86;
        }

        .twitter-list-btn {
            background-color: rgb(85, 172, 238);
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
            cursor: pointer;
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
], PwaAuth.prototype, "microsoftKey", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "googleKey", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "facebookKey", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "credentialMode", void 0);
__decorate([
    property({ type: Boolean })
], PwaAuth.prototype, "menuOpened", void 0);
__decorate([
    property({ type: String })
], PwaAuth.prototype, "menuPlacement", void 0);
__decorate([
    property({ type: Boolean })
], PwaAuth.prototype, "disabled", void 0);
PwaAuth = PwaAuth_1 = __decorate([
    customElement('pwa-auth')
], PwaAuth);
export { PwaAuth };
//# sourceMappingURL=pwa-auth.js.map