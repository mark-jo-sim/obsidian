---
type: tool
---

## Links

- [Coda docs](https://coda.io/d/Engineering-Onboarding_d9V-_UQ8pWX/Dev-server-setup-v4_suOqEm4d#_luOEVeJ4)
- [Github repo with setup scripts](https://github.com/cresta/dev-server-setup/tree/master#)

## Background

Isolated EC2 server instances for high-compute resources, run for 12-48hrs based on usage.

## Connectivity

Connect with ``

## Terraform creation

- Edit [YAML file in terraform repo](https://github.com/cresta/terraform/blob/master/environments/aws/dev-servers-2/servers.yaml) and make PR
- Once approval is given and `cresta-robot` comments on PR, comment `atlantis apply` to PR
- `cresta-robot` will comment with shell output
	- Look for `exports = tomap({...` then find section resembling:
	
```sh
"markjos" = <<-EOT
export CRESTA_INSTANCE_V2=true
export CRESTA_INSTANCE_AZ=us-west-2c
export CRESTA_INSTANCE_ID=i-027e9cb7491f05687
export CRESTA_INSTANCE_NAME=lars.dev-servers-2.internal.cresta.ai
export CRESTA_SSH_USER=lars
```

Add following environment variable:

```sh
export CROSH_SSH_KEY_PATH="/path/to/key"
```

Then put all environment variables in `~/.profile`, `~/.zprofile`, `~/.zshrc` or similar config file.
**Or** add alias to instantiate all relevant environment variables, especially useful if using multiple dev servers.

## Glibc version error

Got error `GLIBC_2.38' not found` after running `dev-server-setup/first-time-setup/setup-dev-server.sh`
- $\Rightarrow$ compiled from source `brew reinstall --build-from-source awscli`

Similar issue with Capsule `.../setup-capsule.sh` with `GLIBC_2.32` and `GLIBC_2.34`
- Set `REPO_NAME` and `CONTAINER_NAME` to use updated image

## Capsule

Docker container running inside dev server.
Avoiding for now because it seems only necessary for providing dev dependencies, and I've found it simpler so far to use the SSH host environment.