# ifttt-ghpages

Hello! 👋 This is a script which lets you create Jekyll entries in a Github repo from IFTTT events, using the IFTTT Webhook action. You can see it in use on [https://webrender.net](https://webrender.net).

# Setup

* [Remix this project](https://glitch.com/~ifttt-ghpages) (or [clone the repo](https://github.com/webrender/ifttt-ghpages) if you'd prefer to run it yourself)
* in the .env file, enter your username, the repo you'd like to commit to, and your Github user token.  You can generate a Personal Access Token for use with this script here: [https://github.com/settings/tokens](https://github.com/settings/tokens)
* for the `WEBHOOK_TOKEN` env variable, generate/create a token of your choice.  We'll use this to verify requests are coming from our webhook.
* Go to IFTTT and create a new applet. For the "that" action, choose the `Webhooks` service, and then the `Make a web request` option.  Fill in the fields as follows:
  * URL: The URL of your node server, with a `token` parameter. Example:
    * `https://ifttt-ghpages.glitch.me/?token=your-token`
  * Method: POST
  * Content Type: text/plain
  * Body: A YAML-formatted Jekyll document, with newlines replaced with `|||`. Example from `examples/twitter`:
    * `---|||layout: post|||title: {{UserName}} - Tweet|||network: twitter|||date: {{CreatedAt}}|||---|||{{TweetEmbedCode}}`