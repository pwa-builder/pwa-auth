import { PublicClientApplication } from "@azure/msal-browser";
export class MicrosoftProvider {
    constructor(clientId) {
        this.clientId = clientId;
        this.scopes = ["user.read"];
        this.graphConfig = { graphMeEndpoint: "https://graph.microsoft.com/v1.0/me" };
        this.resolve = null;
        this.reject = null;
        this.app = null;
        this.account = null;
    }
    async signIn() {
        return this.signInWithMsal();
    }
    loadDependencies() {
        // Our dependencies are already loaded via import statement at the top of the file,
        // thanks to msal.js being a module.
        return Promise.resolve();
    }
    async signInWithMsal() {
        const msalConfig = {
            auth: {
                clientId: this.clientId,
                authority: "https://login.microsoftonline.com/consumers/"
            },
            cache: {
                cacheLocation: "localStorage",
                storeAuthStateInCookie: true
            }
        };
        this.app = new PublicClientApplication(msalConfig);
        try {
            debugger;
            //try to get accessToken to attempt silent signin
            let loginResponse = await this.getAccessToken();
            if (loginResponse) {
                const loginResult = await this.getLoginResult(loginResponse);
                if (loginResult) {
                    return loginResult;
                }
            }
            //if we get here, we need to call loginPopup
            loginResponse = await this.signInWithPopup();
            if (loginResponse) {
                const loginResult = await this.getLoginResult(loginResponse);
                if (loginResult) {
                    return loginResult;
                }
            }
            throw new Error("No login result");
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async signInWithPopup() {
        if (!this.app) {
            return Promise.reject("No app context");
        }
        const loginRequest = {
            scopes: this.scopes
        };
        const response = await this.app.loginPopup(loginRequest);
        return response;
    }
    // private signInSucceeded(loginResponse: AuthenticationResult) {
    //     const loginResult = this.getLoginResult(loginResponse);
    //     // Fetch the user's photo. 
    //     // MS provider supports this for work and edu accounts, but not for personal accounts.
    //     this.getAccessToken()
    //         .then(accessToken => loginResult.providerData ? (loginResult.providerData["accessToken"] = accessToken) : accessToken)
    //         .then(accessToken => this.getUserPhoto(accessToken))
    //         .then(photoUrl => loginResult.imageUrl = photoUrl)
    //         .catch(error => console.log("Error details: ", error))
    //         .finally(() => this.resolve?.(loginResult)); // Finally clause: regardless of whether we can get the user's photo, we consider it a successful signin.
    // }
    signInFailed(error) {
        var _a;
        (_a = this.reject) === null || _a === void 0 ? void 0 : _a.call(this, error);
    }
    async getAccessToken() {
        if (!this.app) {
            return Promise.reject("No app context");
        }
        const accessTokenRequest = {
            scopes: this.scopes,
            account: this.app.getAllAccounts()[0]
        };
        try {
            return await this.app.acquireTokenSilent(accessTokenRequest);
        }
        catch (error) {
            // we are probably not signed in or we need to get a token interactively
            return null;
        }
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
    async getLoginResult(tokenResponse) {
        var _a, _b;
        try {
            debugger;
            return {
                name: ((_a = tokenResponse.account) === null || _a === void 0 ? void 0 : _a.name) || "",
                email: ((_b = tokenResponse.account) === null || _b === void 0 ? void 0 : _b.username) || "",
                provider: "Microsoft",
                accessToken: tokenResponse.accessToken,
                accessTokenExpiration: tokenResponse.expiresOn,
                error: null,
                imageUrl: await this.getUserPhoto(tokenResponse.accessToken),
                providerData: { tokenResponse },
            };
        }
        catch (error) {
            return null;
        }
    }
}
//# sourceMappingURL=microsoft-provider.js.map