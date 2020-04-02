export class GoogleProvider {
    constructor(clientId, shadowRoot) {
        this.clientId = clientId;
        this.shadowRoot = shadowRoot;
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
        var _a;
        const gapiLoad = (_a = window.gapi) === null || _a === void 0 ? void 0 : _a.auth2;
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
        var _a;
        if (!(gapi === null || gapi === void 0 ? void 0 : gapi.load)) {
            (_a = this.reject) === null || _a === void 0 ? void 0 : _a.call(this, "Google Platform library loaded, but couldn't find window.gapi.load");
        }
        else {
            this.loadAuth();
        }
    }
    scriptLoadFailed(error) {
        var _a;
        console.error("Error loading Google Platform library", error);
        (_a = this.reject) === null || _a === void 0 ? void 0 : _a.call(this, error);
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
            const fakeBtn = this.getOrCreateFakeBtn();
            auth.attachClickHandler(fakeBtn, signInOptions, user => this.signInSucceeded(user), error => this.signInFailed(error));
            fakeBtn.click();
        }
    }
    getOrCreateFakeBtn() {
        // This needs to be done because Google Platform API requires you to attach a 
        // click handler to an actual element. This fake button will be our actual element.
        let fakeBtn = this.shadowRoot.querySelector("#pwa-auth-google-sign-in-pseudo-btn");
        if (!fakeBtn) {
            fakeBtn = document.createElement("button");
            fakeBtn.style.display = "none";
            this.shadowRoot.appendChild(fakeBtn);
        }
        ;
        return fakeBtn;
    }
    signInSucceeded(user) {
        var _a;
        const loginResult = this.getLoginResult(user);
        (_a = this.resolve) === null || _a === void 0 ? void 0 : _a.call(this, loginResult);
    }
    signInFailed(error) {
        var _a;
        (_a = this.reject) === null || _a === void 0 ? void 0 : _a.call(this, error);
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