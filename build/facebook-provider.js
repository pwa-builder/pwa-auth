export class FacebookProvider {
    constructor(appId) {
        this.appId = appId;
    }
    signIn() {
        return this.appendFacebookScript()
            .then(() => this.initFacebookSdk())
            .then(response => this.signInWithFacebookSdk(response))
            .then(response => this.fetchUserDetails(response));
    }
    loadDependencies() {
        return this.appendFacebookScript()
            .then(() => this.initFacebookSdk());
    }
    appendFacebookScript() {
        const fb = window.FB;
        if (fb) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            const scriptEl = window.document.createElement("script");
            scriptEl.async = true;
            scriptEl.src = FacebookProvider.apiUrl;
            scriptEl.onload = () => resolve();
            scriptEl.onerror = (error) => reject(error);
            window.document.head.appendChild(scriptEl);
        });
    }
    initFacebookSdk() {
        if (!window.FB) {
            return Promise.reject("Couldn't find window.FB");
        }
        FB.init({
            appId: this.appId,
            version: "v6.0",
            frictionlessRequests: true
        });
        return new Promise(resolve => FB.getLoginStatus(response => resolve(response)));
    }
    signInWithFacebookSdk(statusResponse) {
        // Speed through if we're already signed in to FB.
        if (statusResponse.status === "connected") {
            return Promise.resolve(statusResponse);
        }
        return new Promise(resolve => FB.login(loginResponse => resolve(loginResponse), { scope: "email" }));
    }
    fetchUserDetails(statusResponse) {
        if (statusResponse.status !== "connected") {
            return Promise.reject({
                message: "Facebook sign in failed and may have been cancelled by the user.",
                status: statusResponse.status
            });
        }
        const authResponse = statusResponse.authResponse;
        return new Promise((resolve, reject) => {
            const requestArgs = {
                fields: "name, email, picture.width(1440).height(1440)"
            };
            FB.api("/me", requestArgs, (userDetails) => {
                resolve(this.getSignInResultFromUserDetails(userDetails, authResponse));
            });
        });
    }
    getSignInResultFromUserDetails(userDetails, authResponse) {
        var _a, _b;
        if (!(userDetails === null || userDetails === void 0 ? void 0 : userDetails.email)) {
            throw new Error("Facebook sign-in succeeded, but the resulting user details didn't contain an email. User details: " + JSON.stringify(userDetails));
        }
        // authResponse.expiresIn is specified in seconds from now.
        const expiresInSeconds = authResponse.expiresIn;
        const expiration = new Date();
        expiration.setSeconds(expiresInSeconds || 10000);
        return {
            email: userDetails.email,
            name: userDetails.name,
            imageUrl: (_b = (_a = userDetails.picture) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.url,
            error: null,
            accessToken: authResponse === null || authResponse === void 0 ? void 0 : authResponse.accessToken,
            accessTokenExpiration: expiration,
            provider: "Facebook",
            providerData: {
                user: userDetails,
                auth: authResponse
            }
        };
    }
}
FacebookProvider.apiUrl = "https://connect.facebook.net/en_US/sdk.js";
//# sourceMappingURL=facebook-provider.js.map