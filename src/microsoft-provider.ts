import {AccountInfo, AuthenticationResult, Configuration, PopupRequest, PublicClientApplication, SilentRequest} from "@azure/msal-browser";
import { SignInResult } from "./signin-result";
import { SignInProvider } from "./signin-provider";

export class MicrosoftProvider implements SignInProvider {

    private readonly scopes: string[] = ["user.read"];
    private readonly graphConfig = { graphMeEndpoint: "https://graph.microsoft.com/v1.0/me" };
    private resolve: ((result: SignInResult) => void) | null = null;
    private reject: ((error: any) => void) | null = null;
    private app: PublicClientApplication | null = null;
    private account: AccountInfo | null = null;
    
    constructor (private clientId: string) {
    }

    async signIn(): Promise<SignInResult> {
        return this.signInWithMsal();
    }

    loadDependencies(): Promise<void> {
        // Our dependencies are already loaded via import statement at the top of the file,
        // thanks to msal.js being a module.
        return Promise.resolve();
    }

    private async signInWithMsal() {
        const msalConfig: Configuration = {
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
            
        } catch(error) {
            throw new Error(error);
        }
    }

    private async signInWithPopup() {
        if (!this.app) {
            return Promise.reject("No app context");
        }

        const loginRequest: PopupRequest = {
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

    private signInFailed(error: any) {
        this.reject?.(error);
    }

    private async getAccessToken(): Promise<AuthenticationResult | null> {
        if (!this.app) {
            return Promise.reject("No app context");
        }

        const accessTokenRequest: SilentRequest = {
            scopes: this.scopes,
            account: this.app.getAllAccounts()[0]
        };

        try {
            return await this.app.acquireTokenSilent(accessTokenRequest)
        } catch (error) {
            // we are probably not signed in or we need to get a token interactively
            return null;
        }
    }

    private getUserPhoto(accessToken: string): Promise<string> {
        return this.callGraphApi("/photo/$value", accessToken)
            .then(result => result.blob())
            .then(blob => this.getImageUrlFromBlob(blob))
    }

    private callGraphApi(relativeUrl: string, accessToken: string): Promise<Response> {
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
        })
    }

    private getImageUrlFromBlob(blob: Blob): Promise<string> {
        // COMMENTED OUT: 
        // This works initially, creating a blob:// url. 
        // However, storing this credential for use in a later page load results in a broken image because the blob no longer exists in memory.
        // return URL.createObjectURL(blob)); 

        // Use a FileReader to read the image as a base 64 URL string
        return new Promise<string>((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.addEventListener("error", error => reject(error));
            fileReader.addEventListener("loadend", () => resolve(fileReader.result as string));
            fileReader.readAsDataURL(blob);
        });
    }

    private async getLoginResult(tokenResponse: AuthenticationResult): Promise<SignInResult | null> {
        try {
            debugger;
            return {
                name: tokenResponse.account?.name || "",
                email: tokenResponse.account?.username || "",
                provider: "Microsoft", 
                accessToken: tokenResponse.accessToken,
                accessTokenExpiration: tokenResponse.expiresOn,
                error: null,
                imageUrl: await this.getUserPhoto(tokenResponse.accessToken),
                providerData: {tokenResponse},
            };
        } catch (error) {
            return null;
        }
    }
}