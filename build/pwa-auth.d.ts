import { LitElement, TemplateResult } from 'lit-element';
declare type AuthProvider = "Microsoft" | "Google" | "Facebook" | "Apple";
export declare class PwaAuth extends LitElement {
    appearance: "button" | "list" | "none";
    signInButtonText: string;
    microsoftButtonText: string;
    googleButtonText: string;
    facebookButtonText: string;
    appleButtonText: string;
    appleRedirectUri: string | undefined | null;
    microsoftKey: string | undefined | null;
    googleKey: string | undefined | null;
    facebookKey: string | undefined | null;
    appleKey: string | undefined | null;
    credentialMode: "none" | "silent" | "prompt";
    menuOpened: boolean;
    menuPlacement: "start" | "end";
    disabled: boolean;
    static readonly providerUrls: Record<AuthProvider, string>;
    static styles: import("lit-element").CSSResult;
    firstUpdated(): void;
    render(): void | TemplateResult;
    /**
     * Starts the sign-in process using the specified provider.
     * @param provider The provider to sign-in with. Must be "Microsoft", "Google", "Facebook", or "Apple"
     */
    signIn(provider: AuthProvider): void;
    private get microsoftButtonIcon();
    private get googleButtonIcon();
    private get facebookButtonIcon();
    private get appleButtonIcon();
    private renderLoginButton;
    private renderListButtons;
    private renderNoKeysError;
    private dropdownFocusOut;
    private get hasAnyKey();
    private signInClicked;
    private toggleMenu;
    private signInMs;
    private signInGoogle;
    private signInFacebook;
    private signInApple;
    private signInWithProvider;
    private signInCompleted;
    private importMicrosoftProvider;
    private startMicrosoftSignInFlow;
    private importGoogleProvider;
    private startGoogleSignInFlow;
    private importFacebookProvider;
    private startFacebookSignInFlow;
    private importAppleProvider;
    private startAppleSignInFlow;
    private tryStoreCredential;
    private tryAutoSignIn;
    private tryLoginWithStoredCredential;
    private getStoredCredential;
    private credentialToSignInResult;
    private getProviderNameFromUrl;
    private isWebKit;
    private loadAllDependencies;
}
export {};
