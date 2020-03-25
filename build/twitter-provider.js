import * as TwitterLite from "twitter-lite";
export class TwitterProvider {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.resolve = null;
        this.reject = null;
    }
    signIn() {
        this.resolve = null;
        this.reject = null;
        return new Promise((resolve, reject) => {
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
        });
        client
            .getRequestToken(TwitterProvider.callbackUrlZanz)
            .then(res => console.log("zanz twitter response!", res))
            .catch(console.error);
    }
}
TwitterProvider.requestTokenApiUrl = "https://api.twitter.com/oauth/request_token";
TwitterProvider.callbackUrlZanz = "https://d6e9c486.ngrok.io/public#twitter-callback";
//# sourceMappingURL=twitter-provider.js.map