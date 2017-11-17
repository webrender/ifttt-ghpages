# ifttt-jekyll

Hello! 👋 This is a script which lets you create Jekyll entries in a Github repo from IFTTT events, using the IFTTT Webhook action.

# Setup

* [Remix this project](https://glitch.com/~ifttt-ghpages) (or [clone the repo](https://github.com/webrender/ifttt-ghpages) if you'd prefer to run it yourself)
* in the .env file, enter your username, the repo you'd like to commit to, and your Github user token.  You can generate a Personal Access Token for use with this script here: [https://github.com/settings/tokens](https://github.com/settings/tokens)
* Go to IFTTT and create a new applet. For the "that" action, choose the `Webhooks` service, and then the `Make a web request` option.  Fill in the fields as follows:
  * URL: The URL of your node server
  * Method: POST
  * Content Type: application/json
  * Body: A JSON object in the following format:
  ```
  [
    {
      key1: value1
      key2: value2
      ...
    },
    'URI-ENCODED-POST-CONTENT'
  ]
  ```
* `body[0]` will be translated into a Jekyll front matter block. 
* `body[1]` will be URI-decoded and used as the post content.
* IFTTT values should be escaped using IFTTT's `<<<{{}}>>>` syntax.
* I use [https://meyerweb.com/eric/tools/dencoder/](https://meyerweb.com/eric/tools/dencoder/) for easy URI encoding of my post content.
* Coming soon: post content examples for common social network embeds