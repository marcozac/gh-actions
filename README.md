# @marcozac/gh-actions

A collection of GitHub actions.

## `read-ci v1`

This action reads CI configurations from `json`, `yaml` or `text` files.

### Usage

For `json` and `yaml` set an output for each key-value in the configuration file. The properties can be excluded from output by `exclude` option and `log` option will print the key value.

If the file is in `text` format, the output name is the same of the file one, replacing `.` with `_`. For example reading the configuration from `ci.txt` the output name is `ci_txt` with the file content as value.

```yaml

---
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
