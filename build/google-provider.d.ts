import { SignInResult } from "./signin-result";
export declare class GoogleProvider {
    private clientId;
    private shadowRoot;
    private resolve;
    private reject;
    static readonly apiUrl = "https://apis.google.com/js/api:client.js";
    constructor(clientId: string, shadowRoot: ShadowRoot);
    signIn(): Promise<SignInResult>;
    private appendGoogleScript;
    private scriptLoadSucceded;
    private scriptLoadFailed;
    private loadAuth;
    private initAuth;
    private getOrCreateFakeBtn;
    private signInSucceeded;
    private signInFailed;
    private getLoginResult;
}
