import { SignInResult } from "./signin-result";
import { SignInProvider } from "./signin-provider";
export declare class AppleProvider implements SignInProvider {
    private clientId;
    private redirectUri?;
    static readonly scriptUrl = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    static readonly nameLocalStorageKeyPrefix = "pwa-auth-apple-email-";
    constructor(clientId: string, redirectUri?: string | null | undefined);
    signIn(): Promise<SignInResult>;
    loadDependencies(): Promise<void>;
    private appendAppleScript;
    private initAuth;
    private signInWithApple;
    private getAppleJS;
    private getSignInResult;
    private isErrorResult;
    private decodeUserDetails;
    private decodeJwt;
    private tryGetStoredNameFromEmail;
    private tryStoreNameWithEmail;
    private trimSlash;
}
