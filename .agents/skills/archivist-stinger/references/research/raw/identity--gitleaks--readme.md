# gitleaks/gitleaks (README)
- URL: https://github.com/gitleaks/gitleaks
- Fetched: 2026-09-05
- Source type: official-docs

> [!WARNING]
> Gitleaks is feature complete. New features are no longer being merged into Gitleaks; future releases will be security patches only. Development focus has shifted to a successor project, Betterleaks.

Gitleaks is a tool for **detecting** secrets like passwords, API keys, and tokens in git repos, files, and whatever else you want to throw at it via `stdin`.

Example output:

```
Finding:     "export BUNDLE_ENTERPRISE__CONTRIBSYS__COM=cafebabe:deadbeef",
Secret:      cafebabe:deadbeef
RuleID:      sidekiq-secret
Entropy:     2.609850
File:        cmd/generate/config/rules/sidekiq.go
Line:        23
Commit:      cd5226711335c68be1e720b318b7bc3135a30eb2
Author:      John
Email:       john@users.noreply.github.com
Date:        2022-08-03T12:31:40Z
Fingerprint: cd5226711335c68be1e720b318b7bc3135a30eb2:cmd/generate/config/rules/sidekiq.go:sidekiq-secret:23
```

## Getting Started

Gitleaks can be installed using Homebrew, Docker, or Go. Gitleaks is also available in binary form for many popular platforms and OS types on the releases page. It can also be implemented as a pre-commit hook directly in a repo, or as a GitHub Action using gitleaks-action.

### Installing

```bash
# MacOS
brew install gitleaks

# Docker (DockerHub)
docker pull zricethezav/gitleaks:latest
docker run -v ${path_to_host_folder_to_scan}:/path zricethezav/gitleaks:latest [COMMAND] [OPTIONS] [SOURCE_PATH]

# Docker (ghcr.io)
docker pull ghcr.io/gitleaks/gitleaks:latest
docker run -v ${path_to_host_folder_to_scan}:/path ghcr.io/gitleaks/gitleaks:latest [COMMAND] [OPTIONS] [SOURCE_PATH]

# From Source (make sure `go` is installed)
git clone https://github.com/gitleaks/gitleaks.git
cd gitleaks
make build
```

### Pre-Commit

1. Install pre-commit from https://pre-commit.com/#install
2. Create a `.pre-commit-config.yaml` file at the root of your repository with the following content:
   ```
   repos:
     - repo: https://github.com/gitleaks/gitleaks
       rev: v8.24.2
       hooks:
         - id: gitleaks
   ```
   (for native execution), or use the `gitleaks-docker` pre-commit ID for executing gitleaks using the official Docker images.
3. Auto-update the config to the latest repos' versions by executing `pre-commit autoupdate`
4. Install with `pre-commit install`

```
git commit -m "this commit contains a secret"
Detect hardcoded secrets.................................................Failed
```

To disable the gitleaks pre-commit hook, prepend `SKIP=gitleaks` to the commit command and it will skip running gitleaks:

```
SKIP=gitleaks git commit -m "skip gitleaks check"
Detect hardcoded secrets................................................Skipped
```

If you are knowingly committing a test secret that gitleaks will catch, you can add a `gitleaks:allow` comment to that line, which will instruct gitleaks to ignore that secret. Example:

```
class CustomClass:
    discord_client_secret = '8dyfuiRyq=vVc3RRr_edRk-fK__JItpZ'  #gitleaks:allow
```

## Usage

```
Gitleaks scans code, past or present, for secrets

Usage:
  gitleaks [command]

Available Commands:
  completion  Generate the autocompletion script for the specified shell
  dir         scan directories or files for secrets
  git         scan git repositories for secrets
  help        Help about any command
  stdin       detect secrets from stdin
  version     display gitleaks version

Flags:
  -b, --baseline-path string          path to baseline with issues that can be ignored
  -c, --config string                 config file path
                                      order of precedence:
                                      1. --config/-c
                                      2. env var GITLEAKS_CONFIG
                                      3. env var GITLEAKS_CONFIG_TOML with the file content
                                      4. (target path)/.gitleaks.toml
                                      If none of the four options are used, then gitleaks will use the default config
      --diagnostics string            enable diagnostics (http OR comma-separated list: cpu,mem,trace)
      --diagnostics-dir string        directory to store diagnostics output files when not using http mode
      --enable-rule strings           only enable specific rules by id
      --exit-code int                 exit code when leaks have been encountered (default 1)
  -i, --gitleaks-ignore-path string   path to .gitleaksignore file or folder containing one (default ".")
  -h, --help                          help for gitleaks
      --ignore-gitleaks-allow         ignore gitleaks:allow comments
  -l, --log-level string              log level (trace, debug, info, warn, error, fatal) (default "info")
      --max-archive-depth int         allow scanning into nested archives up to this depth (default "0", no archive traversal is done)
      --max-decode-depth int          allow recursive decoding up to this depth (default "0", no decoding is done)
      --max-target-megabytes int      files larger than this will be skipped
      --no-banner                     suppress banner
      --no-color                      turn off color for verbose output
      --redact uint[=100]             redact secrets from logs and stdout. To redact only parts of the secret just apply a percent value from 0..100. For example --redact=20 (default 100%)
  -f, --report-format string          output format (json, csv, junit, sarif, template)
  -r, --report-path string            report file
      --report-template string        template file used to generate the report (implies --report-format=template)
      --timeout int                   set a timeout for gitleaks commands in seconds (default "0", no timeout is set)
  -v, --verbose                       show verbose output from scan
      --version                       version for gitleaks

Use "gitleaks [command] --help" for more information about a command.
```

### Commands

v8.19.0 introduced a change that deprecated `detect` and `protect`. Those commands are still available but are hidden in the `--help` menu.

There are three scanning modes: `git`, `dir`, and `stdin`.

#### Git

The `git` command lets you scan local git repos. Under the hood, gitleaks uses the `git log -p` command to scan patches. You can configure the behavior of `git log -p` with the `log-opts` option. For example, if you wanted to run gitleaks on a range of commits you could use the following command: `gitleaks git -v --log-opts="--all commitA..commitB" path_to_repo`. If there is no target specified as a positional argument, then gitleaks will attempt to scan the current working directory as a git repo.

#### Dir

The `dir` (aliases include `files`, `directory`) command lets you scan directories and files. Example: `gitleaks dir -v path_to_directory_or_file`. If there is no target specified as a positional argument, then gitleaks will scan the current working directory.

#### Stdin

You can also stream data to gitleaks with the `stdin` command. Example: `cat some_file | gitleaks -v stdin`

### Creating a baseline

When scanning large repositories or repositories with a long history, it can be convenient to use a baseline. When using a baseline, gitleaks will ignore any old findings that are present in the baseline. A baseline can be any gitleaks report. To create a gitleaks report, run gitleaks with the `--report-path` parameter.

```
gitleaks git --report-path gitleaks-report.json # This will save the report in a file called gitleaks-report.json
```

Once a baseline is created it can be applied when running the scan command again:

```
gitleaks git --baseline-path gitleaks-report.json --report-path findings.json
```

After running with the `--baseline-path` parameter, report output (findings.json) will only contain new issues.

## Load Configuration

The order of precedence is:

1. `--config/-c` option:
   ```bash
   gitleaks git --config /home/dev/customgitleaks.toml .
   ```
2. Environment variable `GITLEAKS_CONFIG` with the file path:
   ```bash
   export GITLEAKS_CONFIG="/home/dev/customgitleaks.toml"
   gitleaks git .
   ```
3. Environment variable `GITLEAKS_CONFIG_TOML` with the file content:
   ```bash
   export GITLEAKS_CONFIG_TOML=`cat customgitleaks.toml`
   gitleaks git .
   ```
4. A `.gitleaks.toml` file within the target path:
   ```bash
   gitleaks git .
   ```

If none of the four options are used, then gitleaks will use the default config.

## Configuration

Gitleaks offers a configuration format you can follow to write your own secret detection rules:

```toml
# Title for the gitleaks configuration file.
title = "Custom Gitleaks configuration"

# You have basically two options for your custom configuration:
#
# 1. define your own configuration, default rules do not apply
#    use e.g., the default configuration as starting point:
#    https://github.com/gitleaks/gitleaks/blob/master/config/gitleaks.toml
#
# 2. extend a configuration, the rules are overwritten or extended
#    When you extend a configuration the extended rules take precedence over the
#    default rules. Another thing to know with extending configurations is you can chain
#    together multiple configuration files to a depth of 2. Allowlist arrays are
#    appended and can contain duplicates.

# useDefault and path can NOT be used at the same time. Choose one.
[extend]
# useDefault will extend the default gitleaks config built in to the binary
useDefault = true
# or you can provide a path to a configuration to extend from.
# path = "common_config.toml"
# If there are any rules you don't want to inherit, they can be specified here.
disabledRules = [ "generic-api-key"]

# An array of tables that contain information that define instructions
# on how to detect secrets
[[rules]]
# Unique identifier for this rule
id = "awesome-rule-1"

# Short human-readable description of the rule.
description = "awesome rule 1"

# Golang regular expression used to detect secrets. Note Golang's regex engine
# does not support lookaheads.
regex = '''one-go-style-regex-for-this-rule'''

# Int used to extract secret from regex match and used as the group that will have
# its entropy checked if `entropy` is set.
secretGroup = 3

# Float representing the minimum shannon entropy a regex group must have to be considered a secret.
entropy = 3.5

# Golang regular expression used to match paths. This can be used as a standalone rule or it can be used
# in conjunction with a valid `regex` entry.
path = '''a-file-path-regex'''

# Keywords are used for pre-regex check filtering. Rules that contain
# keywords will perform a quick string compare check to make sure the
# keyword(s) are in the content being scanned.
keywords = [
  "auth",
  "password",
  "token",
]

# Array of strings used for metadata and reporting purposes.
tags = ["tag","another tag"]

    # In v8.21.0 [rules.allowlist] was replaced with [[rules.allowlists]].
    # This change was backwards-compatible: instances of [rules.allowlist] still work.
    #
    # You can define multiple allowlists for a rule to reduce false positives.
    # A finding will be ignored if ANY [[rules.allowlists]] matches.
    [[rules.allowlists]]
    description = "ignore commit A"
    # When multiple criteria are defined the default condition is "OR".
    condition = "OR"
    commits = [ "commit-A", "commit-B"]
    paths = [
      '''go\.mod''',
      '''go\.sum'''
    ]
    # note: stopwords targets the extracted secret, not the entire regex match
    stopwords = [
      '''client''',
      '''endpoint''',
    ]

    [[rules.allowlists]]
    # The "AND" condition can be used to make sure all criteria match.
    condition = "AND"
    # note: regexes defaults to check the Secret in the finding.
    # Acceptable values for regexTarget are "secret" (default), "match", and "line".
    regexTarget = "match"
    regexes = [ '''(?i)parseur[il]''' ]
    paths = [ '''package-lock\.json''' ]

# You can extend a particular rule from the default config, e.g. gitlab-pat,
# if you have defined a custom token prefix on your GitLab instance
[[rules]]
id = "gitlab-pat"
# all the other attributes from the default rule are inherited

    [[rules.allowlists]]
    regexTarget = "line"
    regexes = [ '''MY-glpat-''' ]

# In v8.25.0 [allowlist] was replaced with [[allowlists]].
#
# Global allowlists have a higher order of precedence than rule-specific allowlists.
# If a commit listed in the commits field below is encountered then that commit will be skipped and no
# secrets will be detected for said commit. The same logic applies for regexes and paths.
[[allowlists]]
description = "global allow list"
commits = [ "commit-A", "commit-B", "commit-C"]
paths = [
  '''gitleaks\.toml''',
  '''(.*?)(jpg|gif|doc)'''
]
# note: (global) regexTarget defaults to check the Secret in the finding.
# Acceptable values for regexTarget are "match" and "line"
regexTarget = "match"
regexes = [
  '''219-09-9999''',
  '''078-05-1120''',
  '''(9[0-9]{2}|666)-\d{2}-\d{4}''',
]
stopwords = [
  '''client''',
  '''endpoint''',
]

# In v8.25.0, [[allowlists]] have a new field called targetRules.
#
# Common allowlists can be defined once and assigned to multiple rules using targetRules.
# This will only run on the specified rules, not globally.
[[allowlists]]
targetRules = ["awesome-rule-1", "awesome-rule-2"]
description = "Our test assets trigger false-positives in a couple rules."
paths = ['''tests/expected/._\.json$''']
```

Refer to the default gitleaks config (https://github.com/gitleaks/gitleaks/blob/master/config/gitleaks.toml) for examples, or the contributing guidelines to contribute to the default configuration.

### Additional Configuration

#### Composite Rules (Multi-part or `required` Rules)

In v8.28.0 Gitleaks introduced composite rules, made up of a single "primary" rule and one or more auxiliary or `required` rules. To create a composite rule, add a `[[rules.required]]` table to the primary rule specifying an `id` and optionally `withinLines` and/or `withinColumns` proximity constraints. A fragment is a chunk of content that Gitleaks processes at once (typically a file, part of a file, or git diff); proximity matching instructs the primary rule to only report a finding if the auxiliary required rules also find matches within the specified area of the fragment. `withinLines: N` requires findings within N lines vertically; `withinColumns: N` requires findings within N characters horizontally; both together create a rectangular search area; neither means fragment-level matching (required findings can be anywhere in the same fragment). Composite rules are called out as an experimental feature subject to change.

#### .gitleaksignore

You can ignore specific findings by creating a `.gitleaksignore` file at the root of your repo. In release v8.10.0 Gitleaks added a `Fingerprint` value to the Gitleaks report. Each leak, or finding, has a Fingerprint that uniquely identifies a secret. Add this fingerprint to the `.gitleaksignore` file to ignore that specific secret. This feature is marked experimental and subject to change in the future.

#### Decoding

Sometimes secrets are encoded in a way that can make them difficult to find with just regex. Gitleaks can be told to automatically find and decode encoded text via the `--max-decode-depth` flag (the default value "0" means the feature is disabled by default). Recursive decoding is supported since decoded text can also contain encoded text; `--max-decode-depth` sets the recursion limit. Findings for encoded text differ from normal findings: the location points to the bounds of the encoded text (adjusted if the rule also matches outside it); the match and secret contain the decoded value; and two tags are added, `decoded:` and `decode-depth:`.

Currently supported encodings:

- **percent** - Any printable ASCII percent encoded values
- **hex** - Any printable ASCII hex encoded values >= 32 characters
- **base64** - Any printable ASCII base64 encoded values >= 16 characters

#### Archive Scanning

Secrets are sometimes packaged within archive files like zip files or tarballs. The `--max-archive-depth` flag tells gitleaks to automatically extract and scan the contents of archives, for both `dir` and `git` scan types (default "0" disables it). Recursive scanning is supported since archives can contain other archives; `--max-archive-depth` sets the recursion limit. Findings for secrets located within an archive include the path to the file inside the archive, with inner paths separated by `!`. Example (shortened):

```
Finding:     DB_PASSWORD=8ae31cacf141669ddfb5da
...
File:        testdata/archives/nested.tar.gz!archives/files.tar!files/.env.prod
Line:        4
Commit:      6e6ee6596d337bb656496425fb98644eb62b4a82
...
Fingerprint: 6e6ee6596d337bb656496425fb98644eb62b4a82:testdata/archives/nested.tar.gz!archives/files.tar!files/.env.prod:generic-api-key:4
```

## Reporting

Gitleaks has built-in support for several report formats: `json`, `csv`, `junit`, and `sarif`. If none of these formats fit your need, you can create your own report format with a Go `text/template` `.tmpl` file and the `--report-template` flag. Usage:

```sh
$ gitleaks dir ~/leaky-repo/ --report-path "report.json" --report-format template --report-template testdata/report/jsonextra.tmpl
```

## Exit Codes

You can always set the exit code when leaks are encountered with the `--exit-code` flag. Default exit codes:

```
0 - no leaks present
1 - leaks or error encountered
126 - unknown flag
```

## Note on this excerpt

This excerpt covers installation, pre-commit usage, the full `--help` flag reference, the `git`/`dir`/`stdin` command forms (noting `detect`/`protect` as deprecated-but-available aliases for `git`/pre-commit protection), the config-file resolution order, a full annotated example `.gitleaks.toml` covering rule-level and global allowlists, `.gitleaksignore`, decoding, archive scanning, report formats, and exit codes. Omitted as out of scope for this excerpt: the GitHub-repo metadata block (star/fork/watcher counts, contributor list, topic tags), the Sponsorships section, and the composite-rules proximity-matching diagrams. On the specific ask for "categories of secrets the default rules cover": the README itself does not enumerate the default ruleset's secret categories inline. It only points readers to the separate default configuration file at https://github.com/gitleaks/gitleaks/blob/master/config/gitleaks.toml, which is not part of the README's own text and was not fetched as part of this excerpt.
