import { LoginResult } from "./login-result";
export declare class MicrosoftAuth {
    private clientId;
    private readonly requestObj;
    private readonly graphConfig;
    private resolve;
    private reject;
    private app;
    constructor(clientId: string);
    signIn(): Promise<LoginResult>;
    private signInWithMsal;
    private signInSucceeded;
    private signInFailed;
    private redirectCallback;
    private getAccessToken;
    private getUserPhoto;
    private callGraphApi;
    private getLoginResult;
}
