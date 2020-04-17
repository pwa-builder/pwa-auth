import { SignInResult } from "./signin-result";
import { SignInProvider } from "./sign-in-provider";
export declare class FacebookProvider implements SignInProvider {
    private appId;
    static readonly apiUrl = "https://connect.facebook.net/en_US/sdk.js";
    constructor(appId: string);
    signIn(): Promise<SignInResult>;
    loadDependencies(): Promise<void>;
    private appendFacebookScript;
    private initFacebookSdk;
    private signInWithFacebookSdk;
    private fetchUserDetails;
    private getSignInResultFromUserDetails;
}
