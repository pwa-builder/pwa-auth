export interface SignInResult {
    /**
     * The user's email.
     */
    email?: string | null;
    /**
     * The user's first and last name.
     */
    name?: string | null;
    /**
     * The user's profile picture URL.
     */
    imageUrl?: string | null;
    /**
     * Additional details about the sign-in. Provider-specific.
     */
    info?: Object | null;
    /**
     * The error that occurred during sign in process.
     */
    error: Error | null;
    /**
     * The name of the login provider.
     */
    provider: "Microsoft" | "Google" | "Facebook";
}
