# Scoring proxy (optional)

Keeps your Azure Speech key off the phone and makes Android scoring work (it converts m4a/3gp to WAV with ffmpeg).

1. Install Node 18+ and ffmpeg on a small server (Render, Fly.io, Railway, any VPS).
2. Start it:
   `AZURE_KEY=xxxx AZURE_REGION=eastus APP_TOKEN=a-long-random-secret node server/score-proxy.mjs`
3. Put it behind HTTPS (these hosts do that for you).
4. In the app: Parents, PIN, Settings, "Scoring server": paste the server address and the token.

Nothing is stored. Audio is deleted right after scoring. Mention in your privacy policy that, when a scoring server is set, the recording is sent to it and to Microsoft Azure for that one word.
Note: a token inside a public app can be extracted. For a store release, issue per-install tokens or add Apple App Attest / Play Integrity before launch.

## Deploy in about 10 minutes (Render, easiest)
1. Put this project in a private GitHub repository.
2. On render.com choose **New, Blueprint**, pick the repository and `server/render.yaml`.
3. Fill in the three secrets: `AZURE_KEY`, `AZURE_REGION`, `APP_TOKEN` (make the token long and random).
4. When it is live, open `https://YOUR-NAME.onrender.com/health`. It should say `{"ok":true}`.
5. In the app: Parents, PIN, Settings, **Scoring server**: paste the address and the token.

Other hosts (Fly.io, Railway, any VPS with Docker) work the same way: build `server/Dockerfile`, set the same three variables.

## Test it from your Mac before you launch
`curl -s https://YOUR-NAME.onrender.com/health`
then record a word on an Android phone with the server set. The result in Parents should say it was scored by "pronunciation score" instead of "practice score".
