import { SignInResult } from "./signin-result";
export declare class FacebookProvider {
    private appId;
    private resolve;
    private reject;
    static readonly apiUrl = "https://connect.facebook.net/en_US/sdk.js";
    constructor(appId: string);
    signIn(): Promise<SignInResult>;
    private appendFacebookScript;
    private scriptLoadSucceded;
    private scriptLoadFailed;
    private init;
    private loginStatusFetched;
    private signInCompleted;
    private userDetailsFetched;
    private signInSucceeded;
    private signInFailed;
}
