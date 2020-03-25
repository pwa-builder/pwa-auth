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
        this.resolve?.(loginResult);
    }
    signInFailed(error) {
        this.reject?.(error);
    }
    requiresInteraction(errorCode) {
        if (!errorCode || !errorCode.length) {
            return false;
        }
        return errorCode === "consent_required" ||
            errorCode === "interaction_required" ||
            errorCode === "login_required";
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
    getLoginResult(loginResponse) {
        return {
            name: loginResponse?.account?.name || "",
            email: loginResponse?.account?.userName || "",
            info: loginResponse,
            provider: "Microsoft",
            error: null,
            imageUrl: null
        };
    }
}
//# sourceMappingURL=microsoft-provider.js.map