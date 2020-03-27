import { SignInResult } from "./signin-result";
export declare class TwitterProvider {
    private accessToken;
    private resolve;
    private reject;
    private static readonly requestTokenApiUrl;
    constructor(accessToken: string);
    signIn(): Promise<SignInResult>;
    acquireRequestToken(): void;
}
