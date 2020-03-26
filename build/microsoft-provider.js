import * as Msal from "msal";
export class MicrosoftAuth {
    constructor(clientId) {
        this.clientId = clientId;
        this.requestObj = { scopes: ["user.read"] };
        this.graphConfig = { graphMeEndpoint: "https://graph.microsoft.com/v1.0/me" };
        this.resolve = null;
        this.reject = null;
        this.app = null;
    }
    signIn() {
        this.resolve = null;
        this.reject = null;
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.signInWithMsal();
        });
    }
    signInWithMsal() {
        const msalConfig = {
            auth: {
                clientId: this.clientId,
                authority: "https://login.microsoftonline.com/common/"
            },
            cache: {
                cacheLocation: "localStorage",
                storeAuthStateInCookie: true
            }
        };
        this.app = new Msal.UserAgentApplication(msalConfig);
        this.app.handleRedirectCallback((error, response) => this.redirectCallback(error, response));
        this.app.loginPopup(this.requestObj)
            .then(loginResponse => this.signInSucceeded(loginResponse))
            .catch(error => this.signInFailed(error));
    }
    signInSucceeded(loginResponse) {
        const loginResult = this.getLoginResult(loginResponse);
        // Fetch the user's photo. 
        // MS provider supports this for work and edu accounts, but not for personal accounts.
        // Finally clause: regardless of whether we can get the user's photo, we consider it a successful signin.
        this.getUserPhoto()
            .then(photoUrl => loginResult.imageUrl = photoUrl)
            .catch(error => console.log("Unable to fetch user profile image. Note that Microsoft Graph cannot fetch profile pictures for personal accounts; only work and education accounts are supported. Error details: ", error))
            .finally(() => this.resolve?.(loginResult));
    }
    signInFailed(error) {
        this.reject?.(error);
    }
    redirectCallback(error, response) {
        if (error) {
            this.signInFailed(error);
            console.error("Msal redirect callback failure", error);
        }
        else if (response) {
            this.signInSucceeded(response);
        }
        else {
            console.log("Unexpected redirect: no error, but no login response", error, response);
        }
    }
    getUserPhoto() {
        if (!this.app) {
            return Promise.reject("No app context");
        }
        return this.app.acquireTokenSilent(this.requestObj)
            .then(tokenResponse => this.callGraphApi("/photo/$value", tokenResponse.accessToken))
            .then(result => result.blob())
            .then(blob => URL.createObjectURL(blob));
    }
    callGraphApi(relativeUrl, accessToken) {
        const url = `${this.graphConfig.graphMeEndpoint}${relativeUrl}`;
        return fetch(url, {
            method: "GET",
            headers: new Headers({
                "Authorization": `Bearer ${accessToken}`
            })
        }).then(res => {
            // If we got a 404, punt.
            if (res.status == 404) {
                return Promise.reject(`Graph API returned 404 for ${relativeUrl}`);
            }
            return res;
        });
    }
    getLoginResult(loginResponse) {
        return {
            name: loginResponse?.account?.name || "",
            email: loginResponse?.account?.userName || "",
            provider: "Microsoft",
            error: null,
            imageUrl: null,
            info: loginResponse,
        };
    }
}
//# sourceMappingURL=microsoft-provider.js.map