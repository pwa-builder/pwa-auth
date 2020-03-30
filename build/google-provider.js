export class GoogleProvider {
    constructor(clientId, signInButton) {
        this.clientId = clientId;
        this.signInButton = signInButton;
        this.resolve = null;
        this.reject = null;
    }
    signIn() {
        this.resolve = null;
        this.reject = null;
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.appendGoogleScript();
        });
    }
    appendGoogleScript() {
        const gapiLoad = window.gapi?.auth2;
        if (!gapiLoad) {
            const scriptEl = window.document.createElement("script");
            scriptEl.async = true;
            scriptEl.src = GoogleProvider.apiUrl;
            scriptEl.onload = () => this.scriptLoadSucceded();
            scriptEl.onerror = (error) => this.scriptLoadFailed(error);
            window.document.head.appendChild(scriptEl);
        }
        else {
            this.loadAuth();
        }
    }
    scriptLoadSucceded() {
        const gapiLoad = window.gapi?.load;
        if (!gapi.load) {
            this.reject?.("Google Platform library loaded, but couldn't find window.gapi.load");
        }
        else {
            this.loadAuth();
        }
    }
    scriptLoadFailed(error) {
        console.error("Error loading Google Platform library", error);
        this.reject?.(error);
    }
    loadAuth() {
        window.gapi.load("auth2", () => this.initAuth());
    }
    initAuth() {
        const auth = gapi.auth2.init({
            client_id: this.clientId,
            cookie_policy: "single_host_origin"
        });
        const signInOptions = {};
        // Speed through the process if we're already signed in.
        if (auth.isSignedIn.get()) {
            const user = auth.currentUser.get();
            this.signInSucceeded(user);
        }
        else {
            auth.attachClickHandler(this.signInButton, signInOptions, user => this.signInSucceeded(user), error => this.signInFailed(error));
            this.signInButton.click();
        }
    }
    signInSucceeded(user) {
        const loginResult = this.getLoginResult(user);
        this.resolve?.(loginResult);
    }
    signInFailed(error) {
        this.reject?.(error);
    }
    getLoginResult(user) {
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