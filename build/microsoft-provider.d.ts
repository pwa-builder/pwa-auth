import { SignInResult } from "./signin-result";
import { SignInProvider } from "./sign-in-provider";
export declare class MicrosoftProvider implements SignInProvider {
    private clientId;
    private readonly requestObj;
    private readonly graphConfig;
    private resolve;
    private reject;
    private app;
    constructor(clientId: string);
    signIn(): Promise<SignInResult>;
    loadDependencies(): Promise<void>;
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
