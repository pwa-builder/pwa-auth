import { LoginResult } from "./login-result";

export class GoogleProvider {

    private resolve: ((result: LoginResult) => void) | null = null;
    private reject: ((error: any) => void) | null = null;

    static readonly apiUrl = "https://apis.google.com/js/api:client.js";

    constructor(private clientId: string, private signInButton: HTMLElement) {
        
    }

    signIn(): Promise<LoginResult> {
        this.resolve = null;
        this.reject = null;

        return new Promise<LoginResult>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.appendGoogleScript();
        });
    }

    private appendGoogleScript() {
        const gapiLoad = window.gapi?.auth2;
        if (!gapiLoad) {
            const scriptEl = window.document.createElement("script");
            scriptEl.async = true;
            scriptEl.src = GoogleProvider.apiUrl;
            scriptEl.onload = () => this.scriptLoadSucceded();
            scriptEl.onerror = (error) => this.scriptLoadFailed(error);
            window.document.head.appendChild(scriptEl);
        } else {
            this.loadAuth();
        }
    }

    private scriptLoadSucceded() {
        const gapiLoad = window.gapi?.load;
        if (!gapi.load) {
            this.reject?.("Google Platform library loaded, but couldn't find window.gapi.load");
        } else {
            this.loadAuth();
        }
    }

    private scriptLoadFailed(error: string | Event) {
        console.error("Error loading Google Platform library", error);
        this.reject?.(error);
    }

    private loadAuth() {
        window.gapi.load("auth2", () => this.initAuth());
    }

    private initAuth() {
        const auth = gapi.auth2.init({
            client_id: this.clientId,
            cookie_policy: "single_host_origin"
        });
        const signInOptions: gapi.auth2.SigninOptions = { };

        // Speed through the process if we're already signed in.
        if (auth.isSignedIn.get()) {
            const user = auth.currentUser.get();
            this.signInSucceeded(user);
        } else {
            auth.attachClickHandler(this.signInButton, 
                signInOptions, 
                user => this.signInSucceeded(user),
                error => this.signInFailed(error));
            this.signInButton.click();
        }
    }

    private signInSucceeded(user: gapi.auth2.GoogleUser) {
        const loginResult = this.getLoginResult(user);
        this.resolve?.(loginResult);
    }

    private signInFailed(error: any) {
        this.reject?.(error);
    }

    private getLoginResult(user: gapi.auth2.GoogleUser): LoginResult {
        const profile = user.getBasicProfile();
        return {
            email: profile.getEmail(),
            name: profile.getName(),
            imageUrl: profile.getImageUrl(),
            info: user,
            provider: "Google",
            error: null
        };
    }
}