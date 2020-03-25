import { LoginResult } from "./login-result";
export declare class TwitterProvider {
    private accessToken;
    private resolve;
    private reject;
    private static readonly requestTokenApiUrl;
    private static readonly callbackUrlZanz;
    constructor(accessToken: string);
    signIn(): Promise<LoginResult>;
    acquireRequestToken(): void;
}
