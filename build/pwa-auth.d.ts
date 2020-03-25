import { LitElement } from 'lit-element';
declare type AuthProvider = "Microsoft" | "Google" | "Facebook";
export declare class PwaAuth extends LitElement {
    appearance: "button" | "list";
    microsoftButtonText: string;
    googleButtonText: string;
    facebookButtonText: string;
    msClientId: string | undefined | null;
    googleClientId: string | undefined | null;
    facebookAppId: string | undefined | null;
    autoLogin: "none" | "user-choice" | "first-available";
    disabled: boolean;
    static readonly providerUrls: Record<AuthProvider, string>;
    static styles: import("lit-element").CSSResult;
    firstUpdated(changedProperties: any): void;
    render(): import("lit-element").TemplateResult;
    private signInMs;
    private signInGoogle;
    private signInFacebook;
    private loginCompleted;
    private tryStoreCredential;
    private tryUseStoredCredential;
    private getStoredCredential;
    private credentialToLoginResult;
    private getProviderNameFromUrl;
}
export {};
