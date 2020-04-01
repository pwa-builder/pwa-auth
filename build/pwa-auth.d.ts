import { LitElement, TemplateResult } from 'lit-element';
declare type AuthProvider = "Microsoft" | "Google" | "Facebook";
export declare class PwaAuth extends LitElement {
    appearance: "button" | "list" | "none";
    signInButtonText: string;
    microsoftButtonText: string;
    googleButtonText: string;
    facebookButtonText: string;
    microsoftKey: string | undefined | null;
    googleKey: string | undefined | null;
    facebookKey: string | undefined | null;
    credentialMode: "none" | "silent" | "prompt";
    menuOpened: boolean;
    menuPlacement: "start" | "end";
    disabled: boolean;
    static readonly providerUrls: Record<AuthProvider, string>;
    static styles: import("lit-element").CSSResult;
    render(): void | TemplateResult;
    /**
     * Starts the sign-in process using the specified provider.
     * @param provider The provider to sign-in with. Must be "Microsoft", "Google", or "Facebook".
     */
    signIn(provider: AuthProvider): void;
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
    private signInWithProvider;
    private signInCompleted;
    private startMicrosoftSignInFlow;
    private startGoogleSignInFlow;
    private startFacebookSignInFlow;
    private tryStoreCredential;
    private tryAutoSignIn;
    private tryLoginWithStoredCredential;
    private getStoredCredential;
    private credentialToSignInResult;
    private getProviderNameFromUrl;
}
export {};
