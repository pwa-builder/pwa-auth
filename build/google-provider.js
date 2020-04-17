export class GoogleProvider {
    constructor(clientId) {
        this.clientId = clientId;
    }
    signIn() {
        return this.loadDependencies()
            .then(() => this.signInWithGoogleAuth2());
    }
    loadDependencies() {
        return this.appendGoogleScript()
            .then(() => this.loadAuth());
    }
    appendGoogleScript() {
        var _a;
        const gapiLoad = (_a = window.gapi) === null || _a === void 0 ? void 0 : _a.load;
        if (!gapiLoad) {
            return new Promise((resolve, reject) => {
                const scriptEl = window.document.createElement("script");
                scriptEl.async = true;
                scriptEl.src = GoogleProvider.apiUrl;
                scriptEl.onload = () => resolve();
                scriptEl.onerror = (error) => reject({ message: "Error loading Google Platform library", error: error });
                window.document.head.appendChild(scriptEl);
            });
        }
        // GApi is already loaded.
        return Promise.resolve();
    }
    loadAuth() {
        if (!window.gapi || !window.gapi.load) {
            return Promise.reject("Couldn't find gapi.load");
        }
        // If we already have auth2, cool, we're done.
        if (window.gapi.auth2) {
            return Promise.resolve();
        }
        // Otherwise, pull in auth2.
        return new Promise(resolve => window.gapi.load("auth2", () => resolve()));
    }
    signInWithGoogleAuth2() {
        if (!(gapi === null || gapi === void 0 ? void 0 : gapi.auth2)) {
            throw new Error("gapi.auth2 wasn't loaded");
        }
        const auth = gapi.auth2.init({
            client_id: this.clientId,
            cookie_policy: "single_host_origin"
        });
        // Speed through the process if we're already signed in.
        if (auth.isSignedIn.get()) {
            const user = auth.currentUser.get();
            return Promise.resolve(this.getSignInResultFromUser(user));
        }
        // Otherwise, kick off the OAuth flow.
        return auth.signIn()
            .then(user => this.getSignInResultFromUser(user));
    }
    getSignInResultFromUser(user) {
        const profile = user.getBasicProfile();
        return {
            email: profile.getEmail(),
            name: profile.getName(),
            imageUrl: profile.getImageUrl(),
            provider: "Google",
            error: null,
            providerData: user
        };
    }
}
GoogleProvider.apiUrl = "https://apis.google.com/js/api:client.js";
//# sourceMappingURL=google-provider.js.map