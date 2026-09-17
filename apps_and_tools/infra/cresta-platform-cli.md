---
type: tool
tags:
  - cli
  - prod
---
## Overview

**Note:** abbreviated to `crp` in `~/shell-env/base.env`

## Authentication

```shell
# opens browser, use locally
crp login $CLUSTER_ID $CUSTOMER_ID

# prints device code to stdout, use in ssh or w/ agents
crp login $CLUSTER_ID $CUSTOMER_ID --use-device-code
```

## Data access

```shell
# metadata (languages, use cases, hints)
# -c $CLUSTER --customer $CUSTOMER_ID -p $PROFILE_STRING
crp customer -c us-west-2-prod --customer snapfinance -p us-west-2

# list conversations for a customer
crp conversation search -c us-west-2-prod --customer snapfinance -p us-west-2
```