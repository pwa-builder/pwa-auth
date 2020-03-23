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
        this.resolve?.(loginResult);
    }

    private signInFailed(error: any) {
        this.reject?.(error);
    }

    private requiresInteraction(errorCode: string | any[]) {
        if (!errorCode || !errorCode.length) {
            return false;
        }
        return errorCode === "consent_required" ||
            errorCode === "interaction_required" ||
            errorCode === "login_required";
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