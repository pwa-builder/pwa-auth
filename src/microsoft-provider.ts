import * as Msal from "msal";
import { LoginResult } from "./login-result";

export class MicrosoftAuth {

    private readonly requestObj = { scopes: ["user.read"] };
    private readonly graphConfig = { graphMeEndpoint: "https://graph.microsoft.com/v1.0/me" };
    private resolve: ((result: LoginResult) => void) | null = null;
    private reject: ((error: any) => void) | null = null;
    private app: Msal.UserAgentApplication | null = null;
    
    constructor (private clientId: string) {
    }

    signIn(): Promise<LoginResult> {
        this.resolve = null;
        this.reject = null;

        return new Promise<LoginResult>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.signInWithMsal();
        });
    }

    private signInWithMsal() {
        const msalConfig: Msal.Configuration = {
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

    private signInSucceeded(loginResponse: Msal.AuthResponse) {
        const loginResult = this.getLoginResult(loginResponse);

        // Try to the user's photo.
        this.getUserPhoto()
            .then(photoUrl => loginResult.imageUrl = photoUrl)
            .catch(error => console.log("Unable to fetch user profile image", error))
            .finally(() => this.resolve?.(loginResult));
    }

    private signInFailed(error: any) {
        this.reject?.(error);
    }

    private redirectCallback(
        error: Msal.AuthError | null, 
        response: Msal.AuthResponse | undefined) {

        if (error) {
            this.signInFailed(error);
            console.error("Msal redirect callback failure", error);
        } else if (response) {
            this.signInSucceeded(response);
        } else {
            console.log("Unexpected redirect: no error, but no login response", error, response);
        }
    }

    private getUserPhoto(): Promise<string | null> {
        if (!this.app) {
            return Promise.reject("No app context");
        }

        return this.app.acquireTokenSilent(this.requestObj)
            .then(tokenResponse => this.callGraphApi("/photo/$value", tokenResponse.accessToken))
            .then(result => result.blob())
            .then(blob => URL.createObjectURL(blob));
    }

    private callGraphApi(relativeUrl: string, accessToken: string): Promise<Response> {
        const url = `${this.graphConfig.graphMeEndpoint}${relativeUrl}`;
        return fetch(url, {
            method: "GET",
            headers: new Headers({
                "Authorization": `Bearer ${accessToken}`
            })
        });
    }
    
    // private graphAPICallback(data) {
    //     console.log("graph api callback: ", data);
    // }

    private getLoginResult(loginResponse: any | null): LoginResult {
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