import { SignInResult } from "./signin-result";

export class FacebookProvider {

    private resolve: ((result: SignInResult) => void) | null = null;
    private reject: ((error: any) => void) | null = null;

    static readonly apiUrl = "https://connect.facebook.net/en_US/sdk.js";

    constructor(private appId: string) {
        
    }

    signIn(): Promise<SignInResult> {
        this.resolve = null;
        this.reject = null;

        return new Promise<SignInResult>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.appendFacebookScript();
        });
    }

    private appendFacebookScript() {
        const fb = window.FB;
        if (!fb) {
            const scriptEl = window.document.createElement("script");
            scriptEl.async = true;
            scriptEl.src = FacebookProvider.apiUrl;
            scriptEl.onload = () => this.scriptLoadSucceded();
            scriptEl.onerror = (error) => this.scriptLoadFailed(error);
            window.document.head.appendChild(scriptEl);
        } else {
            this.init(fb);
        }
    }

    private scriptLoadSucceded() {
        const fb = window.FB;
        if (!fb) {
            this.reject?.("Facebook SDK loaded, but couldn't find window.FB");
        } else {
            this.init(fb);
        }
    }

    private scriptLoadFailed(error: string | Event) {
        console.error("Error loading Facebook SDK", error);
        this.reject?.(error);
    }

    private init(fb: facebook.FacebookStatic) {
        fb.init({
            appId: this.appId,
            cookie: true,
            xfbml: false,
            version: "v6.0"
        });
        fb.AppEvents.logPageView();
        fb.getLoginStatus(response => this.loginStatusFetched(response));
    }

    private loginStatusFetched(statusResponse: fb.StatusResponse) {
        if (statusResponse.status === "connected") {
            this.signInCompleted(statusResponse);
        } else {
            FB.login(res => this.signInCompleted(res), { scope: "email" });
        }
    }

    private signInCompleted(statusResponse: fb.StatusResponse) {
        if (statusResponse.status === "connected") {
            // If we're already connected, signal it.
            const requestArgs = {
                fields: "name, email, picture.width(1440).height(1440)"
            };
            FB.api("/me", requestArgs, res => this.userDetailsFetched(res));
        } else {
            this.reject?.({
                message: "Facebook sign in failed and may have been cancelled by the user.",
                status: statusResponse.status
            });
        }
    }

    private userDetailsFetched(userDetails: any) {
        if (userDetails && userDetails.email) {
            this.signInSucceeded(userDetails);
        } else {
            this.signInFailed("Facebook sign-in succeeded, but the resulting user details didn't contain an email. User details: " + JSON.stringify(userDetails));
        }
    }

    private signInSucceeded(userDetails: any) {
        const loginResult: SignInResult = {
            email: userDetails.email,
            name: userDetails.name,
            imageUrl: userDetails.picture?.data?.url,
            error: null,
            provider: "Facebook",
            info: userDetails
        }
        this.resolve?.(loginResult);
    }

    private signInFailed(error: any) {
        this.reject?.(error);
    }
}