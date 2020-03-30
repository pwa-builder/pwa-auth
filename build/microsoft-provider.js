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
        this.getAccessToken(loginResponse)
            .then(accessToken => loginResult.providerData ? (loginResult.providerData["accessToken"] = accessToken) : accessToken)
            .then(accessToken => this.getUserPhoto(accessToken))
            .then(photoUrl => loginResult.imageUrl = photoUrl)
            .catch(error => console.log("Unable to fetch user profile image. Note that Microsoft Graph cannot fetch profile pictures for personal accounts; only work and education accounts are supported. Error details: ", error))
            .finally(() => this.resolve?.(loginResult)); // Finally clause: regardless of whether we can get the user's photo, we consider it a successful signin.
    }
    signInFailed(error) {
        this.reject?.(error);
    }
    redirectCallback(error, response) {
        if (response) {
            this.signInSucceeded(response);
        }
        else {
            this.signInFailed(error || "Unexpected redirect: no error and no login response");
        }
    }
    getAccessToken(loginResponse) {
        if (!this.app) {
            return Promise.reject("No app context");
        }
        return this.app.acquireTokenSilent(this.requestObj)
            .then(tokenResponse => tokenResponse.accessToken);
    }
    getUserPhoto(accessToken) {
        return this.callGraphApi("/photo/$value", accessToken)
            .then(result => result.blob())
            .then(blob => this.getImageUrlFromBlob(blob));
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
    getImageUrlFromBlob(blob) {
        // COMMENTED OUT: 
        // This works initially, creating a blob:// url. 
        // However, storing this credential for use in a later page load results in a broken image because the blob no longer exists in memory.
        // return URL.createObjectURL(blob)); 
        // Use a FileReader to read the image as a base 64 URL string
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.addEventListener("error", error => reject(error));
            fileReader.addEventListener("loadend", () => resolve(fileReader.result));
            fileReader.readAsDataURL(blob);
        });
    }
    getLoginResult(loginResponse) {
        return {
            name: loginResponse?.account?.name || "",
            email: loginResponse?.account?.userName || "",
            provider: "Microsoft",
            error: null,
            imageUrl: null,
            providerData: loginResponse,
        };
    }
}
//# sourceMappingURL=microsoft-provider.js.map