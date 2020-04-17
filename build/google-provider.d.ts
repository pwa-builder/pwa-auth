import { SignInResult } from "./signin-result";
import { SignInProvider } from "./signin-provider";
export declare class GoogleProvider implements SignInProvider {
    private clientId;
    static readonly apiUrl = "https://apis.google.com/js/api:client.js";
    constructor(clientId: string);
    signIn(): Promise<SignInResult>;
    loadDependencies(): Promise<void>;
    private appendGoogleScript;
    private loadAuth;
    private signInWithGoogleAuth2;
    private getSignInResultFromUser;
}
