# Cloudflare trigger for the OCI capacity bot

This Worker is an optional reliability layer for the GitHub Actions capacity bot.

Every 5 minutes it checks whether the GitHub workflow is still active. If it is,
the Worker sends a `workflow_dispatch` request. When the OCI bot eventually
creates `jarvis-server`, the workflow disables itself and this Worker stops
dispatching new runs automatically.

## Cost target

The Worker performs only one or two GitHub API requests every five minutes. It
is designed to fit comfortably inside the Cloudflare Workers Free plan limits.

## Required secret

Create a fine-grained GitHub personal access token scoped only to
`XanderLex05/oci-capacity-bot` with **Actions: Read and write** permission.
Store it in Cloudflare as a Worker secret named:

```
GITHUB_PAT
```

Never commit the token to this repository.

## Deploy with Wrangler

After authenticating Wrangler with your Cloudflare account:

```bash
cd cloudflare-trigger
npx wrangler secret put GITHUB_PAT
npx wrangler deploy
```

The cron trigger is defined in `wrangler.jsonc` and runs every five minutes.
