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
        var _a;
        const fb = window.FB;
        if (!fb) {
            (_a = this.reject) === null || _a === void 0 ? void 0 : _a.call(this, "Facebook SDK loaded, but couldn't find window.FB");
        }
        else {
            this.init(fb);
        }
    }
    scriptLoadFailed(error) {
        var _a;
        console.error("Error loading Facebook SDK", error);
        (_a = this.reject) === null || _a === void 0 ? void 0 : _a.call(this, error);
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
        var _a;
        if (statusResponse.status === "connected") {
            // If we're already connected, signal it.
            const requestArgs = {
                fields: "name, email, picture.width(1440).height(1440)"
            };
            FB.api("/me", requestArgs, res => this.userDetailsFetched(res));
        }
        else {
            (_a = this.reject) === null || _a === void 0 ? void 0 : _a.call(this, {
                message: "Facebook sign in failed and may have been cancelled by the user.",
                status: statusResponse.status
            });
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
        var _a, _b, _c;
        const loginResult = {
            email: userDetails.email,
            name: userDetails.name,
            imageUrl: (_b = (_a = userDetails.picture) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.url,
            error: null,
            provider: "Facebook",
            providerData: userDetails
        };
        (_c = this.resolve) === null || _c === void 0 ? void 0 : _c.call(this, loginResult);
    }
    signInFailed(error) {
        var _a;
        (_a = this.reject) === null || _a === void 0 ? void 0 : _a.call(this, error);
    }
}
FacebookProvider.apiUrl = "https://connect.facebook.net/en_US/sdk.js";
//# sourceMappingURL=facebook-provider.js.map