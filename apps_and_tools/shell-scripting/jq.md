---
type: tool
tags:
  - bash
  - json
  - cli
---
## Usage

E.g. extracting the same attribute from every object in an array 

```sh
jq '.[].attribute' file.json
```

## Flags

- `-n` (null input): avoid reading entire file into memory (greedy parsing?)
- `-r` (raw output): strip double quotes from output
- `-s` (slurp)
## Functions

- **keys:** List keys for a given object

```sh
$ jq 'keys' file.json
[
  "foo",
  "bar",
  "baz",
]
$ jq 'keys[]' file.json
foo
bar
baz
```