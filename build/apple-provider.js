export class AppleProvider {
    constructor(clientId, redirectUri) {
        this.clientId = clientId;
        this.redirectUri = redirectUri;
    }
    signIn() {
        return this.loadDependencies()
            .then(() => this.signInWithApple());
    }
    loadDependencies() {
        return this.appendAppleScript()
            .then(() => this.initAuth());
    }
    appendAppleScript() {
        const apple = this.getAppleJS();
        if (!apple) {
            return new Promise((resolve, reject) => {
                const scriptEl = window.document.createElement("script");
                scriptEl.async = true;
                scriptEl.src = AppleProvider.scriptUrl;
                scriptEl.onload = () => resolve();
                scriptEl.onerror = (error) => reject({ message: "Error loading Apple JS", error: error });
                window.document.head.appendChild(scriptEl);
            });
        }
        // AppleJS is already loaded.
        return Promise.resolve();
    }
    initAuth() {
        const apple = this.getAppleJS();
        if (!apple) {
            return Promise.reject("AppleJS not loaded");
        }
        apple.auth.init({
            clientId: this.clientId,
            scope: "name email",
            redirectURI: this.redirectUri || this.trimSlash(location.href),
            state: "",
            usePopup: true
        });
        return Promise.resolve();
    }
    signInWithApple() {
        const apple = this.getAppleJS();
        if (!apple) {
            return Promise.reject("AppleJS not loaded");
        }
        return apple.auth.signIn()
            .then(result => this.getSignInResult(result));
    }
    getAppleJS() {
        return window["AppleID"];
    }
    getSignInResult(rawResult) {
        var _a;
        if (this.isErrorResult(rawResult)) {
            return {
                error: new Error(rawResult.error),
                provider: "Apple"
            };
        }
        const userDetails = this.decodeUserDetails(rawResult);
        return {
            email: userDetails.email,
            name: userDetails.name,
            accessToken: (_a = rawResult === null || rawResult === void 0 ? void 0 : rawResult.authorization) === null || _a === void 0 ? void 0 : _a.code,
            accessTokenExpiration: userDetails.appleToken ? new Date(userDetails.appleToken.exp * 1000) : null,
            imageUrl: null,
            providerData: rawResult,
            provider: "Apple",
            error: null
        };
    }
    isErrorResult(result) {
        return !!result.error;
    }
    decodeUserDetails(result) {
        // Decode the user's email from the JWT token.
        const webToken = this.decodeJwt(result.authorization.id_token);
        const email = webToken === null || webToken === void 0 ? void 0 : webToken.email;
        if (!email) {
            throw new Error("Unable to decode user's email from JWT token: " + result.authorization.id_token);
        }
        // Apple sends the user's name only the first time they sign in.
        // See if it's here.
        let name = null;
        if (result.user && result.user.name) {
            name = [result.user.name.firstName, result.user.name.lastName]
                .filter(n => !!n)
                .join(" ");
            this.tryStoreNameWithEmail(name, email);
        }
        else {
            // Subsequent sign-in, user details not present. 
            // See if we have it in local storage.
            name = this.tryGetStoredNameFromEmail(email);
        }
        if (!name) {
            name = "";
        }
        return {
            name,
            email,
            appleToken: webToken
        };
    }
    decodeJwt(token) {
        // https://stackoverflow.com/a/38552302/536
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }
    tryGetStoredNameFromEmail(email) {
        const key = this.getUserNameLocalStorageKey(email);
        try {
            return localStorage.getItem(key);
        }
        catch (error) {
            console.warn("Error fetching user from local storage.", key, error);
            return null;
        }
    }
    tryStoreNameWithEmail(name, email) {
        const key = this.getUserNameLocalStorageKey(email);
        try {
            localStorage.setItem(key, name);
        }
        catch (error) {
            console.warn("Error storing user name in local storage. Subsequent sign-ins may not have a user name.", key, name, error);
        }
    }
    getUserNameLocalStorageKey(email) {
        return `${AppleProvider.nameLocalStorageKeyPrefix}-${email}`;
    }
    trimSlash(input) {
        let length = 0;
        for (let i = input.length - 1; i >= 0; i--) {
            if (input[i] !== '/') {
                length = i + 1;
                break;
            }
        }
        return input.substr(0, length);
    }
}
AppleProvider.scriptUrl = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
AppleProvider.nameLocalStorageKeyPrefix = "pwa-auth-apple-email";
//# sourceMappingURL=apple-provider.js.map