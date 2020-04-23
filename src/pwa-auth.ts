import { LitElement, html, css, customElement, property, TemplateResult } from 'lit-element';
import { SignInResult } from './signin-result';
import { SignInProvider } from './signin-provider';
import { FederatedCredential } from './federated-credential';

type AuthProvider = "Microsoft" | "Google" | "Facebook" | "Apple";

@customElement('pwa-auth')
export class PwaAuth extends LitElement {

    @property({ type: String, reflect: true }) appearance: "button" | "list" | "none" = "button";
    @property({ type: String }) signInButtonText = "Sign in";
    @property({ type: String }) microsoftButtonText = "Sign in with Microsoft";
    @property({ type: String }) googleButtonText = "Sign in with Google";
    @property({ type: String }) facebookButtonText = "Sign in with Facebook";
    @property({ type: String }) appleButtonText = "Sign in with Apple";
    @property({ type: String }) appleRedirectUri: string | undefined | null;
    @property({ type: String }) microsoftKey: string | undefined | null;
    @property({ type: String }) googleKey: string | undefined | null;
    @property({ type: String }) facebookKey: string | undefined | null;
    @property({ type: String }) appleKey: string | undefined | null;
    @property({ type: String }) credentialMode: "none" | "silent" | "prompt" = "silent";
    @property({ type: Boolean }) menuOpened = false;
    @property({ type: String, reflect: true }) menuPlacement: "start" | "end" = "start";
    @property({ type: Boolean }) disabled = false;

    static readonly providerUrls: Record<AuthProvider, string> = {
        "Microsoft": "https://graph.microsoft.com",
        "Google": "https://account.google.com",
        "Facebook": "https://www.facebook.com",
        "Apple": "https://appleid.apple.com"
    };

	static styles = css`

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
    public signIn(provider: AuthProvider) {
        if (provider === "Microsoft") {
            this.signInMs();
        } else if (provider === "Google") {
            this.signInGoogle();
        } else if (provider === "Facebook") {
            this.signInFacebook();
        } else if (provider === "Apple") {
            this.signInApple();
        }
        else {
            console.error("Unable to sign-in because of unsupported provider", provider);
        }
	}

	private get microsoftButtonIcon(): TemplateResult {
		switch(this.appearance) {
			case 'list': return html`<img part="microsoftIcon" loading="lazy" width="25px" height="25px" src="https://github.com/pwa-builder/pwa-auth/blob/master/assets/microsoft-icon-list.svg?raw=true" />`;
			case 'button': return html`<img part="microsoftIcon" loading="lazy" width="25px" height="25px" src="https://github.com/pwa-builder/pwa-auth/blob/master/assets/microsoft-icon-button.svg?raw=true" />`;
			default: return html``;
		}
	}

	private get googleButtonIcon() {
        return html`<img part="googleIcon" loading="lazy" width="25px" height="25px" src="https://github.com/pwa-builder/pwa-auth/blob/master/assets/google-icon.svg?raw=true" />`;
	}

	private get facebookButtonIcon() {
		switch(this.appearance) {
			case 'list': return html`<img part="facebookIcon" loading="lazy" width="25px" height="25px" src="https://github.com/pwa-builder/pwa-auth/blob/master/assets/facebook-icon-list.svg?raw=true"`;
			case 'button': return html`<img part="facebookIcon" loading="lazy" width="25px" height="25px" src="https://github.com/pwa-builder/pwa-auth/blob/master/assets/facebook-icon-button.svg?raw=true"`;
			default: return '';
		}
	}

	private get appleButtonIcon() {
        switch(this.appearance) {
			case 'list': return html`<img part="appleIcon" loading="lazy" width="20px" height="20px" src="https://github.com/pwa-builder/pwa-auth/blob/master/assets/apple-icon-list.png?raw=true" />`;
			case 'button': return html`<img part="appleIcon" loading="lazy" width="20px" height="20px" src="https://github.com/pwa-builder/pwa-auth/blob/master/assets/apple-icon-button.png?raw=true" />`;
			default: return html``;
		}
    }

    private renderLoginButton(): TemplateResult {
        return html`
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

    private renderListButtons(): TemplateResult {
        return html`
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

    private renderNoKeysError(): TemplateResult {
        return html`<div class="provider-error"><strong>❌ No available sign-ins</strong><br><em>To enable sign-in, pass a Microsoft key, Google key, Facebook, or Apple key to the &lt;pwa-auth&gt; component.</em><br><pre>&lt;pwa-auth microsoftkey="..."&gt;&lt;/pwa-auth&gt;</pre></div>`;
    }

    private dropdownFocusOut(e: FocusEvent) {
        // Close the dropdown if the focus is no longer within it.
        if (this.menuOpened) {
            const dropdown = this.shadowRoot?.querySelector(".dropdown");
            const dropdownContainsFocus = dropdown?.matches(":focus-within");
            if (!dropdownContainsFocus) {
                this.menuOpened = false;
            }
        }
    }

    private get hasAnyKey(): boolean {
        return !!this.microsoftKey || !!this.googleKey || !!this.facebookKey || !!this.appleKey;
    }

    private async signInClicked() {
        // Are we configured to use browser credentials (the new CredentialStore API)?
        // If so, go ahead and sign in with whatever stored credential we have.
        if (this.credentialMode === "none") {
            this.toggleMenu();
        } else {
            const signedInCreds = await this.tryAutoSignIn();
            if (!signedInCreds) {
                // There was no stored credential to sign in with. Just show the menu.
                this.toggleMenu();
            }
        }
    }

    private toggleMenu() {
        this.menuOpened = !this.menuOpened;
    }

    private signInMs() {
        this.signInWithProvider(this.microsoftKey, "Microsoft", key => this.startMicrosoftSignInFlow(key))
            .then(result => this.signInCompleted(result));
    }

    private signInGoogle() {
        this.signInWithProvider(this.googleKey, "Google", key => this.startGoogleSignInFlow(key))
            .then(result => this.signInCompleted(result));
    }

    private signInFacebook() {
        this.signInWithProvider(this.facebookKey, "Facebook", key => this.startFacebookSignInFlow(key))
            .then(result => this.signInCompleted(result));
    }

    private signInApple() {
        this.signInWithProvider(this.appleKey, "Apple", key => this.startAppleSignInFlow(key))
            .then(result => this.signInCompleted(result));
    }

    private signInWithProvider(key: string | undefined | null, provider: AuthProvider, providerSignIn: (key: string) => Promise<SignInResult>) {
        if (!key) {
            return Promise.reject("No key specified");
        }
        if (this.disabled) {
            return Promise.reject("Sign-in already in progress, rejecting new sign-in attempt");
        }

        this.disabled = true;
        this.menuOpened = false;
        return this.tryLoginWithStoredCredential(PwaAuth.providerUrls[provider])
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
                        const providerError: SignInResult = {
                            error: error,
                            provider: provider
                        };
                        return providerError;
                    })
            })
            .finally(() => this.disabled = false);
    }

    private signInCompleted(signIn: SignInResult): SignInResult {
        this.dispatchEvent(new CustomEvent("signin-completed", { detail: signIn }));
        this.tryStoreCredential(signIn);
        return signIn;
    }

    private importMicrosoftProvider(key: string): Promise<any> {
        return import("./microsoft-provider")
            .then(module => new module.MicrosoftProvider(key));
    }

    private startMicrosoftSignInFlow(key: string): Promise<any> {
        return this.importMicrosoftProvider(key)
            .then(prov => prov.signIn());
    }

    private importGoogleProvider(key: string): Promise<any> {
        return import("./google-provider")
            .then(module => new module.GoogleProvider(key));
    }

    private startGoogleSignInFlow(key: string): Promise<SignInResult> {
        return this.importGoogleProvider(key)
            .then(prov => prov.signIn());
    }

    private importFacebookProvider(key: string): Promise<any> {
        return import ("./facebook-provider")
            .then(module => new module.FacebookProvider(key));
    }

    private startFacebookSignInFlow(key: string): Promise<SignInResult> {
        return this.importFacebookProvider(key)
            .then(prov => prov.signIn());
    }

    private importAppleProvider(key: string): Promise<any> {
        return import ("./apple-provider")
            .then(module => new module.AppleProvider(key, this.appleRedirectUri));
    }

    private startAppleSignInFlow(key: string): Promise<SignInResult> {
        return this.importAppleProvider(key)
            .then(prov => prov.signIn());
    }

    private tryStoreCredential(signIn: SignInResult) {
        // Use the new Credential Management API to store the credential, allowing for automatic sign-in next time the user visits the page.
        // https://developers.google.com/web/fundamentals/security/credential-management/
        const federatedCredentialCtor = window["FederatedCredential"];
        if (signIn.email && federatedCredentialCtor) {
            try {
                const cred = new federatedCredentialCtor({
                    id: signIn.email,
                    provider: PwaAuth.providerUrls[signIn.provider],
                    name: signIn.name || "",
                    iconURL: signIn.imageUrl || ""
                });
                navigator.credentials.store(cred);
            } catch (error) {
                console.error("Unable to store federated credential", error);
            }
        }
    }

    private async tryAutoSignIn(): Promise<FederatedCredential | null> {
        // Use the new Credential Management API to login the user automatically.
        // https://developers.google.com/web/fundamentals/security/credential-management/

        // Bail if we don't support Credential Management
        if (!window["FederatedCredential"]) {
            return null;
        }

        let credential: FederatedCredential | null = null;
        if (this.credentialMode === "prompt") {
            // Let the user choose.
            // The browser brings up the native "choose your sign in" dialog.
            credential = await this.getStoredCredential("required", Object.values(PwaAuth.providerUrls));
        } else if (this.credentialMode === "silent") {
            // Go through the available providers and find one that the user has logged in with.
            for (let providerName in PwaAuth.providerUrls) {
                const providerUrl = PwaAuth.providerUrls[providerName];
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

    private tryLoginWithStoredCredential(providerUrl: string): Promise<SignInResult | null> {
        return this.getStoredCredential("silent", [providerUrl])
            .catch(error => console.warn("Error attempting to sign-in with stored credential", error))
            .then(credential => credential ? this.credentialToSignInResult(credential) : null);
    }

    private getStoredCredential(mediation: string, providerUrls: string[]): Promise<FederatedCredential | null> {
        // Bail if we don't support Credential Management
        if (!window["FederatedCredential"]) {
            return Promise.resolve(null);
        }

        const credOptions: any = {
            mediation: mediation,
            federated: {
                providers: providerUrls
            }
        };

        return navigator.credentials.get(credOptions);
    }

    private credentialToSignInResult(cred: FederatedCredential): SignInResult {
        return {
            name: cred.name,
            email: cred.id,
            providerData: null,
            imageUrl: cred.iconURL,
            error: null,
            provider: this.getProviderNameFromUrl(cred.provider!) as AuthProvider
        };
    }

    private getProviderNameFromUrl(url: string): AuthProvider {
        return Object.keys(PwaAuth.providerUrls)
            .find(key => PwaAuth.providerUrls[key] === url) as AuthProvider;
    }

    private isWebKit(): boolean {
        // As of April 2020, Webkit-based browsers wrongfully blocks
        // the OAuth popup due to lazy-loading the auth library(s).
        const isIOS = !!navigator.userAgent.match(/ipad|iphone/i);  // everything is WebKit on iOS
        const isSafari = !!navigator.vendor && navigator.vendor.includes("Apple");
        return isIOS || isSafari;
    }

    private loadAllDependencies(): Promise<any> {
        const dependencyLoaders = [
            { key: this.microsoftKey, importer: (key: string) => this.importMicrosoftProvider(key) },
            { key: this.googleKey, importer: (key: string) => this.importGoogleProvider(key) },
            { key: this.facebookKey, importer: (key: string) => this.importFacebookProvider(key) },
            { key: this.appleKey, importer: (key: string) => this.importAppleProvider(key) }
        ];
        const dependencyLoadTasks = dependencyLoaders
            .filter(dep => !!dep.key)
            .map(dep => dep.importer(dep.key!).then((p: SignInProvider) => p.loadDependencies()));

        return Promise.all(dependencyLoadTasks)
            .catch(error => console.error("Error loading dependencies", error));
    }
}
