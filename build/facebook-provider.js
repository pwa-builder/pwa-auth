export class FacebookProvider {
    constructor(appId) {
        this.appId = appId;
        this.resolve = null;
        this.reject = null;
    }
    signIn() {
        this.resolve = null;
        this.reject = null;
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.appendFacebookScript();
        });
    }
    appendFacebookScript() {
        const fb = window.FB;
        if (!fb) {
            const scriptEl = window.document.createElement("script");
            scriptEl.async = true;
            scriptEl.src = FacebookProvider.apiUrl;
            scriptEl.onload = () => this.scriptLoadSucceded();
            scriptEl.onerror = (error) => this.scriptLoadFailed(error);
            window.document.head.appendChild(scriptEl);
        }
        else {
            this.init(fb);
        }
    }
    scriptLoadSucceded() {
        const fb = window.FB;
        if (!fb) {
            this.reject?.("Facebook SDK loaded, but couldn't find window.FB");
        }
        else {
            this.init(fb);
        }
    }
    scriptLoadFailed(error) {
        console.error("Error loading Facebook SDK", error);
        this.reject?.(error);
    }
    init(fb) {
        fb.init({
            appId: this.appId,
            cookie: true,
            xfbml: false,
            version: "v6.0"
        });
        fb.AppEvents.logPageView();
        fb.getLoginStatus(response => this.loginStatusFetched(response));
    }
    loginStatusFetched(statusResponse) {
        if (statusResponse.status === "connected") {
            this.signInCompleted(statusResponse);
        }
        else {
            FB.login(res => this.signInCompleted(res), { scope: "email" });
        }
    }
    signInCompleted(statusResponse) {
        if (statusResponse.status === "connected") {
            // If we're already connected, signal it.
            const requestArgs = {
                fields: "name, email, picture"
            };
            FB.api("/me", requestArgs, res => this.userDetailsFetched(res));
        }
        else {
            this.reject?.("Facebook sign-in resulted in a non-connected state: " + statusResponse.status);
        }
    }
    userDetailsFetched(userDetails) {
        if (userDetails && userDetails.email) {
            this.signInSucceeded(userDetails);
        }
        else {
            this.signInFailed("Facebook sign-in succeeded, but the resulting user details didn't contain an email. User details: " + JSON.stringify(userDetails));
        }
    }
    signInSucceeded(userDetails) {
        const loginResult = {
            email: userDetails.email,
            name: userDetails.name,
            imageUrl: userDetails.picture?.data?.url,
            info: userDetails,
            error: null,
            provider: "Facebook"
        };
        this.resolve?.(loginResult);
    }
    signInFailed(error) {
        this.reject?.(error);
    }
}
FacebookProvider.apiUrl = "https://connect.facebook.net/en_US/sdk.js";
//# sourceMappingURL=facebook-provider.js.map