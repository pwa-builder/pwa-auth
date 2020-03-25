import { LoginResult } from "./login-result";
import * as TwitterLite from "twitter-lite";

export class TwitterProvider {

    private resolve: ((result: LoginResult) => void) | null = null;
    private reject: ((error: any) => void) | null = null;

    private static readonly requestTokenApiUrl = "https://api.twitter.com/oauth/request_token";
    private static readonly callbackUrlZanz = "https://d6e9c486.ngrok.io/public#twitter-callback";

    constructor(private accessToken: string) {
        
    }

    signIn(): Promise<LoginResult> {
        this.resolve = null;
        this.reject = null;

        return new Promise<LoginResult>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.acquireRequestToken();
        });
    }

    acquireRequestToken() {
        console.log("zanz", TwitterLite);
        const client = new Twitter({
            consumer_key: "Cb3FPhNQWXEye0zADGiG7JaIP",
            consumer_secret: "t3zz2TguZ4qWPOG79J0xsrzXmo5bMcsjyCQKNpmQDBwA99dVJi"
          } as any);
          
          client
            .getRequestToken(TwitterProvider.callbackUrlZanz)
            .then(res => console.log("zanz twitter response!", res))
            .catch(console.error);
    }
}