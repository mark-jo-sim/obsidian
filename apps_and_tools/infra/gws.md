---
type: tool
tags:
  - cli
  - google_workspace
---
## Resources

- [Github](https://github.com/googleworkspace/cli)

## Dev server authentication

Need to create credentials locally then copy to dev server and set environment variable pointing to credentials file.

```shell
# on laptop
gws auth export --unmasked > /tmp/gws-creds.JSON

# copy to dev server, then on dev server
mkdir -p ~/.config/gws
cp /path/to/copied/gws-creds.json ~/.config/gws/credentials.JSON
rm -f ~/.config/gws/token_cache.JSON
unset GOOGLE_WORKSPACE_CLI_CLIENT_ID GOOGLE_WORKSPACE_CLI_CLIENT_secret
export GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE=~/.config/gws/credentials.json gws auth status
```

## Drive

- List all files in a folder:

```shell
gws drive files list --params "{\"q\": \"'$FOLDER_ID' in parents\"}"
```

- Pass `--page-all` param to auto-navigate pages until end of query is hit
## Calendar

`gws` command for importing:

```bash
gws calendar +agenda --today --format json --calendar $CALENDAR --timezone $TIMEZONE
```

Obsidian snippet:

```js
<%* tR += await tp.user.gcal_agenda(tp, {
  timezone: "America/Los_Angeles",
}) %>
```

