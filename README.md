# pwa-auth
Web component that lets your users sign-in/sign-up using their Microsoft, Google, or Facebook account. Your app receives their email address, name, and profile picture. Built with ❤ by the <a href="https://pwabuilder.com">PWABuilder</a> team.

😎 Bonus:  It's super lightweight, pulling in the authentication libraries <em>only</em> when the user tries to sign-in with one.

😎😎 Double bonus: It uses the new [Credential Management APIs](https://developers.google.com/web/fundamentals/security/credential-management/retrieve-credentials) to speed through sign-ins without bulky pop-ups or redirects.

## Using this component

### Install
1. Add this script tag to your `<head>`

```javascript
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@pwabuilder/pwaauth"
></script>
```

2. Place a `<pwa-auth>` Sign In button in your html:

```html
<pwa-auth 
    microsoftkey="..."
    googlekey="..."
    facebookkey="...">
</pwa-auth>
```

You'll need to provide at least one key. Each key you specify allows the user to sign-in with that service. To create a key for each service, see [creating keys](#creating-keys).

### NPM

You can also use this component via NPM:
1. `npm install @pwabuilder/pwaauth`
2. `import @pwabuilder/pwaauth`

Then you can use the `<pwa-auth>` element anywhere in your template, JSX, HTML, etc.

## What does it look like?

pwa-auth can appear as a single dropdown button:
```html
<pwa-auth appearance="button"></pwa-auth>
```
<img loading="lazy" src="/assets/install-btn-dropdown.png">

Or it can displayed as a list of provider buttons:
```html
<pwa-auth appearance="list"></pwa-auth>
```
<img loading="lazy" src="/assets/list.png">

All the buttons are stylable and customizable. See [styling](https://ZANZ) for details.

## What happens when a user signs in?

You'll get a `signin-completed` event containing the user's <strong>email</strong>, <strong>name</strong>, and <strong>image URL</strong>, as well as additional raw data from the provider (e.g. authentication token):

```javascript
const pwaAuth = document.querySelector("pwa-auth");
pwaAuth.addEventListener("signin-completed", ev => {
    const signIn = ev.detail;
    if (signIn.error) {
        console.error("Sign in failed", signIn.error);
    } else {
        console.log("Email: ", signIn.email);
        console.log("Name: ", signIn.name);
        console.log("Picture: ", signIn.imageUrl);
        console.log("Provider (MS, Google, FB): ", signIn.provider);
        console.log("Raw data from provider: ", signIn.providerData);
    }
});
```

Once the `signin-completed` event fires, you can do whatever you normally do when your users sign in: set an authentication cookie, create a JWT token, etc.

If there's an error, or the user backs out of the authentication process, `signin-completed` will contain an `error`:

```javascript
pwaAuth.addEventListener("signin-completed", ev => {
    const signIn = ev.detail;
    if (signIn.error) {
        console.error("There was an error during sign-in", signIn.error);
    }
});
```

## What does the user see?

The <em>first time</eM> a user signs in, he'll see the familiar OAuth flow asking the user to sign-in. For example, signing in with Google looks like this:

<img loading="lazy" src="/assets/oauth.png?v=1">

Once your user signs in or cancels, `signin-completed` event will fire.

When the user signs in successfully the first time, the browser asks to save your credentials:

<img loading="lazy" src="/assets/save-cred.png"/>

If the user saves his credentials, it will be stored using the new [Credential Management API](https://developers.google.com/web/fundamentals/security/credential-management/retrieve-credentials), enabling fast successive sign-ins.

## Successive sign-ins
#### (Or, [Credential Management](https://developers.google.com/web/fundamentals/security/credential-management/retrieve-credentials) FTW)

If a user has signed-in previously, future sign-ins will be instantaneous. 😎 The next time the user taps `Sign In`, he'll have a streamlined experience without needing any OAuth prompts or pop-ups:

```html
<!-- When tapping sign-in, use the saved credential to sign in silently -->
<pwa-auth credentialsmode="silent"></pwa-auth>
```
<img loading="lazy" src="/assets/first-cred.png" />

In the above screenshot, the user tapped Sign In, and was automatically signed-in using the first saved credential; no OAuth dialogs, pop-ups, or redirects needed! 😎 The browser typically displays a "Signing in as..." info bar during this process.

Alternately, you can have the browser <em>prompt</em> the user to confirm his sign-in:

```html
<!-- When tapping sign in, prompt the user to confirm -->
<pwa-auth credentialmode="prompt"></pwa-auth>
```
<img loading="lazy" src="/assets/signin-prompt.png" />

If the user had previously signed-in with multiple accounts (e.g. once with Google, once with Microsoft), he'll be given a choice of which provider to sign-in with:

<img loading="lazy" src="/assets/multiple-accounts.png" />

Finally, you can disable credential management entirely:
```html
<!-- When tapping sign in, the user will enter the OAuth flow popup -->
<pwa-auth credentialmode="none"></pwa-auth>
```

When `credentialmode="none"` and the user taps `Sign In`, pwa-auth behaves as if the user is signing in for the first time: launching the OAuth popup window to authorize.

With regards to browser support, pwa-auth credential management is a <em>progressive</em> enhancement: on browsers that don't support Credential Management, pwa-auth will fallback to `credentialmode="none"` behavior.

### Creating keys

When you add a `<pwa-auth>` component to your page, you'll need to specify one or more keys:

```html
<pwa-auth 
    microsoftkey="..."
    googlekey="..."
    facebookkey="...">
</pwa-auth>
```

Each key lets your users sign-in with the corresponding service (e.g. a Microsoft key lets your users sign-in with their Microsoft account).

To create a key, see:
- [Creating a Microsoft key](/creating-microsoft-key.md)
- [Creating a Google key](/creating-google-key.md)
- [Creating a Facebook key](https://ZANZ)