import { LoginResult } from "./login-result";
export declare class GoogleProvider {
    private clientId;
    private signInButton;
    private resolve;
    private reject;
    static readonly apiUrl = "https://apis.google.com/js/api:client.js";
    constructor(clientId: string, signInButton: HTMLElement);
    signIn(): Promise<LoginResult>;
    private appendGoogleScript;
    private scriptLoadSucceded;
    private scriptLoadFailed;
    private loadAuth;
    private initAuth;
    private signInSucceeded;
    private signInFailed;
    private getLoginResult;
}
