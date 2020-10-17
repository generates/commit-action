# Commit Action
> Automate git commits with GitHub Actions

## About



## Usage

```yml
name: Ch-ch-changes
on:
  pull_request:
    types: [labeled]
jobs:
  changes:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Make Changes
        uses: some-action
      - name: Commit Changes
        uses: generates/commit-action@v1.0.0
```

## License

Hippocratic License - See [LICENSE][licenseUrl]

&nbsp;

Created by [Ian Walter](https://ianwalter.dev)

[licenseUrl]: https://github.com/generates/commit-action/blob/main/LICENSE
