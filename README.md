# @marcozac/gh-actions

A collection of GitHub actions.

## `read-ci`

This action reads CI configurations from `json`, `yaml` or `text` files.

### Usage

For `json` and `yaml` set an output for each key-value in the configuration file. The properties can be excluded from output by `exclude` option and `log` option will print the key value.

If the file is in `text` format, the output name is the same of the file one, replacing `.` with `_`. For example reading the configuration from `ci.txt` the output name is `ci_txt` with the file content as value.

```yaml
jobs:
  read_ci:
    outputs:
      os: ${{ steps.run.outputs.os }}
    steps:
      - uses: actions/checkout@v3
      - id: run
        uses: marcozac/gh-actions/read-ci@v1
        with:
          # Configuration file to read
          ciFile: path/to/file.json
          # The configuration file type. May be json, yaml or text
          # Default: json
          type: json
          # For json and yaml files, a list of properties to exclude from output
          exclude: ''
          # For json and yaml files, log the value of a list of properties
          log: ''

      - uses: marcozac/gh-actions/read-ci@v1
        with:
          ciFile: path/to/file.yaml
          type: yaml
          exclude: |
            node
          log: |
            os
            node

  example:
    steps:
      - needs: read_ci
        # Reads the runners from `read_ci` output
        # path/to/file.json
        # {"os": ["ubuntu-20.04", "ubuntu-18.04"]}
        strategy:
          matrix:
            os: ${{ fromJson(needs.read-ci.outputs.os) }}
        runs-on: ${{ matrix.os }}
        run: |
          echo ...
```

## `docker-tags`

This action generates a combination of a Docker image tags.

The tags are generated from a `{[key: string]: string[]}` object, combining all the occurences of each key separated by `-`.

For example, using `image-name/example` and following the object below, the generated tags are:

- image-name/example:8.1.5-ubuntu20.04
- image-name/example:8.1.5-ubuntu
- image-name/example:8.1.5-focal
- image-name/example:8.1-ubuntu20.04
- image-name/example:8.1-ubuntu
- image-name/example:8.1-focal
- image-name/example:8-ubuntu20.04
- image-name/example:8-ubuntu
- image-name/example:8-focal

```json
{
  "php": ["8.1.5", "8.1", "8"],
  "ubuntu": ["ubuntu20.04", "ubuntu", "focal"]
}
```

### Usage

```yaml
jobs:
  docker_build:
    runs-on: ubuntu-latest
    steps:
      - id: gen_tags
        uses: marcozac/gh-actions/docker-tags@v1
        with:
          # The Docker image to tag
          image: myrepo/myimage

          # The ordered list of keys to use from `combine` object
          # NOTE: The tag combinations are generated only for the listed keys in the order they appear
          order: |
            php
            ubuntu

          # A string serialized `{[key: string]: string[]}` object with the items to combine
          combine: '{"php": ["8.1.5", "8.1", "8"], "ubuntu": ["ubuntu20.04", "ubuntu", "focal"]}'

          # The action output type
          # Use `command` to generate a string ready to be in included in `docker build` command. E.g. `-t myrepo/myimage:8.1.5 -t myrepo/myimage:8.1`
          # Use `list` to generate an array-like output, without `-t` in front of each tag. E.g. [\"myrepo/myimage:8.1.5\", \"myrepo/myimage:8.1\"]
          # Default: "command"
          outputType: command

          # Include `latest` tag
          # Default: "false"
          latest: 'false'

          # Use the first key in `order` to generate a sequence of tags without combinations
          # For example: `myrepo/myimage:8.1.5`, `myrepo/myimage:8.1`, `myrepo/myimage:8`
          # Default: "false"
          main: 'false'

      - id: build
        run: |
          docker build ${{ steps.gen_tags.outputs.tags }} .
```

### Inputs

| Name       | Type     | Description                                                                                                                                                             |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| image      | String   | The Docker image to tag                                                                                                                                                 |
| order      | List/CSV | The ordered list of keys in `combine` to use for combinations                                                                                                           |
| combine    | String   | The string serialized object that lists the combinations                                                                                                                |
| outputType | String   | The action output type. `command` returns a string with `-t` in front of each tag to use in `docker build` command. `list` returns the plain list of the generated tags |
| latest     | Boolean  | Add the `latest` tag to the image                                                                                                                                       |
| main       | Boolean  | Use the first `order` key to generate a sequence of tags without any combination.                                                                                       |

### Outputs

| Name | Type        | Description                                                                |
| ---- | ----------- | -------------------------------------------------------------------------- |
| tags | String/List | A `-t <image>:tag0 -t <image>:tag1` string or a list of the generated tags |
