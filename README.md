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

pwa-auth can be displayed in different ways:

### `Sign In` dropdown button
pwa-auth can appear as a single dropdown button:
```html
<pwa-auth appearance="button"></pwa-auth>
```
<img loading="lazy" src="/assets/install-btn-dropdown.png">

Or it can be displayed as a list of provider buttons:
```html
<pwa-auth appearance="list"></pwa-auth>
```
<img loading="lazy" src="/assets/list.png">

Finally, pwa-auth can be totally headless -- no UI -- letting you create your own sign-in buttons and drive the functionality using the [signIn(...) method](/#methods).
```html
<!-- No UI at all -->
<pwa-auth appearance="none"></pwa-auth>
```
```javascript
// Use your own UI buttons to invoke pwa-auth sign-in
const pwaAuth = document.querySelector("pwa-auth");
myOwnSignInBtn.addEventHandler("click", () => pwaAuth.signIn("Microsoft"));
```

All UI in pwa-auth is stylable using CSS. See [styling](#styling) for details. Additionally, all text in pwa-auth is customizable, see [pwa-auth properties](#/properties).

## What happens when a user signs in?

You'll get a `signin-completed` event containing the user's `email`, `name`, and `imageUrl`, as well as additional raw data from the provider (e.g. authentication token):

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

Once your user signs-in or cancels, `signin-completed` event will fire.

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

As an alternative, you can have the browser <em>prompt</em> the user to confirm his sign-in:

```html
<!-- When tapping sign in, prompt the user to confirm -->
<pwa-auth credentialmode="prompt"></pwa-auth>
```
<img loading="lazy" src="/assets/signin-prompt.png" />

In the above image, the user tapped the gray `Sign In` button, and then was prompted by the browser to sign in using his stored credential.

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
- [Creating a Facebook key](/creating-facebook-key.md)

## API

You can customize the appearance and behavior of pwa-auth component.

### Properties
| Property             | Attribute            | Description                                                                     | Type      | Default |
| - | - | - | - | - |
| `appearance` | `appearance` | Whether to render a single `Sign In` dropdown button or a list of sign-in provider buttons. See [what does it look like?](#what-does-it-look-like) for details. <br><br>`button`: <br><img loading="lazy" src="/assets/install-btn.png" /><br><br>`list`: <br><img loading="lazy" src="/assets/list.png" /> | `string`: should be `button`, `list`, or `none`. | `'button'` |
| `credentialMode` | `credentialmode` | How to sign-in users who had previously signed-in. See [successive sign-ins](#successive-sign-ins) for details. <br><br>`silent`: <br><img loading="lazy" src="/assets/first-cred.png" /><br><br>`prompt`: <br><img loading="lazy" src="/assets/signin-prompt.png" /><br><br>`none`: <img loading="lazy" style="vertical-align: top" src="/assets/oauth.png"> | `string`. Must be `silent`, `prompt`, or `none` | `'silent'` |
| `microsoftKey` | `microsoftkey`  | The `Application (client) ID` of the Microsoft App you created. See [creating a Microsoft key](/creating-microsoft-key.md). header | `string|null`  | `null` |
| `googleKey` | `googlekey`  | The `Client ID` of the Google credential you created. See [creating a Google key](/creating-google-key.md) | `string|null` | `null` |
| `facebookKey` | `facebookkey`  | The `App ID` of the Facebook App you created. See [creating a Facebook key](/creating-facebook-key.md) | `string|null`  | `null` |
| `signInButtonText` | `signinbuttontext` | The text of the `Sign In` button, displayed when `appearance="button"`                                                            | `string` | "Sign in" |
| `microsoftButtonText` | `microsoftbuttontext` | The label for the `Sign in with Microsoft` button | `string`  | "Sign in with Microsoft" |
| `googleButtonText` | `googlebuttontext` | The label for the `Sign in with Google` button | `string`  | "Sign in with Google" |
| `facebookButtonText` | `facebookbuttontext` | The label for the `Sign in with Facebook` button | `string`  | Sign in with Facebook |
| `menuOpened` | `menuopened`   | Whether the dropdown menu of the `Sign In` button is opened | `boolean`  | `false` |
| `menuPlacement` | `menuplacement` | The placement of the dropdown menu of the `Sign In` button. <br><br>`start`: <img loading="lazy" style="vertical-align: top" src="/assets/menu-start.png"> <br><br>`end`: <img loading="lazy" style="vertical-align: top" src="/assets/menu-end.png"> | `'start'|'end'`  | `'start'` |
| `disabled` | `disabled` | Whether the Sign In button(s) are disabled. They will be disabled while a sign-in is in-progress. | `boolean`  | `false` |

### Events
| Name | Type | Event Data | Description | 
| - | - | - | - | 
| `signin-completed` | `CustomEvent` | `e.detail` will contain the details of the sign-in event.<br><ul><li>`e.detail.email`: The email address of the signed-in user.</li><li>`e.detail.name`: The name of the signed-in user.</li><li>`e.detail.imageUrl`: URL of the user's profile picture. May be null in some scenarios.</li><li>`e.detail.provider`: The name of the provider the user signed-in with.</li><li>`e.detail.error`: The error that occurred during sign-in. Will be null if sign-in was successful.</li><li>`e.detail.providerData`: The raw sign-in data received from an OAuth flow sign-in. Maybe be null during successive sign-ins.</li></ul> | Fired when a sign-in completes successfully or unsuccessfully. If the sign-in failed, `e.detail.error` will be non-null. <br><br>[View code sample](#what-happens-when-a-user-signs-in).

### Methods
| Name | Arguments | Description |
| - | - | - |
| `signIn(provider: string)` | `provider`: `'Microsoft'|'Google'|'Facebook'` | Kicks off the sign-in process. If the user hasn't previously authenticated, he'll be prompted to sign-in via OAuth flow. If the user saved a previous credential, it will be used to sign-in quickly without the need for OAuth flow. |

## Styling

### Shadow parts

You can style the different parts of pwa-auth using [CSS ::part selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::part). Below are the list of parts available for styling:

| Part Name | Description |
| - | - |
| `signInButton` | The sign-in button displayed when `appearance="button"`. |
| `microsoftButton` | The `Sign in with Microsoft` button. |
| `microsoftIcon` | The icon for the `Sign in with Microsoft` button. |
| `googleButton` | The `Sign in with Google` button. |
| `googleIcon` | The icon for the `Sign in with Google` button. |
| `facebookButton` | The `Sign in with Facebook` button. |
| `facebookIcon` | The icon for the `Sign in with Facebook` button. |
| `dropdownMenu` | The dropdown menu of the `Sign In` button displayed when `appearance="button"` |

### Styling samples

Jazz up the Sign In button:
```css
pwa-auth::part(signInButton) {
    background-color: green;
    color: white;
    transform: rotate3d(0, 0, 1, 25deg);
}
```
<img loading="lazy" src="/assets/signin-part.png">