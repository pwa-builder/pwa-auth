import { SignInResult } from "./signin-result";
import { SignInProvider } from "./signin-provider";
export declare class MicrosoftProvider implements SignInProvider {
    private clientId;
    private readonly scopes;
    private readonly graphConfig;
    private resolve;
    private reject;
    private app;
    private account;
    constructor(clientId: string);
    signIn(): Promise<SignInResult>;
    loadDependencies(): Promise<void>;
    private signInWithMsal;
    private signInWithPopup;
    private signInFailed;
    private getAccessToken;
    private getUserPhoto;
    private callGraphApi;
    private getImageUrlFromBlob;
    private getLoginResult;
}
