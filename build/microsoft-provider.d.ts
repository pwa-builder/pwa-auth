import { SignInResult } from "./signin-result";
export declare class MicrosoftAuth {
    private clientId;
    private readonly requestObj;
    private readonly graphConfig;
    private resolve;
    private reject;
    private app;
    constructor(clientId: string);
    signIn(): Promise<SignInResult>;
    private signInWithMsal;
    private signInSucceeded;
    private signInFailed;
    private redirectCallback;
    private getAccessToken;
    private getUserPhoto;
    private callGraphApi;
    private getImageUrlFromBlob;
    private getLoginResult;
}
