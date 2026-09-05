# trufflesecurity/trufflehog (README)
- URL: https://github.com/trufflesecurity/trufflehog
- Fetched: 2026-09-05
- Source type: official-docs

TruffleHog: Find, verify, and analyze leaked credentials.

## What is TruffleHog

TruffleHog is a secrets **Discovery, Classification, Validation,** and **Analysis** tool. In this context, secret refers to a credential a machine uses to authenticate itself to another machine. This includes API keys, database passwords, private encryption keys, and more.

- **Discovery**: TruffleHog can look for secrets in many places including Git, chats, wikis, logs, API testing platforms, object stores, filesystems and more.
- **Classification**: TruffleHog classifies over 800 secret types, mapping them back to the specific identity they belong to (AWS secret? Stripe secret? Cloudflare secret? Postgres password? SSL Private key?).
- **Validation**: For every secret TruffleHog can classify, it can also log in to confirm if that secret is live or not. This step is critical to know if there's an active present danger or not.
- **Analysis**: For the 20 or so most commonly leaked credential types, instead of sending one request to check if the secret can log in, TruffleHog can send many requests to learn everything there is to know about the secret (who created it, what resources it can access, what permissions it has).

## Demo

```bash
docker run --rm -it -v "$PWD:/pwd" trufflesecurity/trufflehog:latest github --org=trufflesecurity
```

## Installation

```bash
# MacOS
brew install trufflehog

# Docker, Unix
docker run --rm -it -v "$PWD:/pwd" trufflesecurity/trufflehog:latest github --repo https://github.com/trufflesecurity/test_keys

# Docker, Windows Command Prompt
docker run --rm -it -v "%cd:/=\%:/pwd" trufflesecurity/trufflehog:latest github --repo https://github.com/trufflesecurity/test_keys

# Docker, Windows PowerShell
docker run --rm -it -v "${PWD}:/pwd" trufflesecurity/trufflehog github --repo https://github.com/trufflesecurity/test_keys

# Docker, M1/M2 Mac
docker run --platform linux/arm64 --rm -it -v "$PWD:/pwd" trufflesecurity/trufflehog:latest github --repo https://github.com/trufflesecurity/test_keys

# Binary releases: download and unpack from https://github.com/trufflesecurity/trufflehog/releases

# Compile from source (requires go)
git clone https://github.com/trufflesecurity/trufflehog.git
cd trufflehog; go install

# Install via script
curl -sSfL https://raw.githubusercontent.com/trufflesecurity/trufflehog/main/scripts/install.sh | sh -s -- -b /usr/local/bin

# Install via script, verifying checksum signature (requires cosign)
curl -sSfL https://raw.githubusercontent.com/trufflesecurity/trufflehog/main/scripts/install.sh | sh -s -- -v -b /usr/local/bin

# Install a specific version via script
curl -sSfL https://raw.githubusercontent.com/trufflesecurity/trufflehog/main/scripts/install.sh | sh -s -- -b /usr/local/bin <ReleaseTag like v3.56.0>
```

## Quick Start: git and filesystem scan command forms

### 1: Scan a repo for only verified secrets

```bash
trufflehog git https://github.com/trufflesecurity/test_keys --results=verified
```

Expected output:

```
Found verified result
Detector Type: AWS
Decoder Type: PLAIN
Raw result: [REDACTED_RESEARCH_AWS_ACCESS_KEY]
Line: 4
Commit: fbc14303ffbf8fb1c2c1914e8dda7d0121633aca
File: keys
Email: counter <counter@counters-MacBook-Air.local>
Repository: https://github.com/trufflesecurity/test_keys
Timestamp: 2022-06-16 10:17:40 -0700 PDT
...
```

### 3: Scan a GitHub repo for only verified secrets and get JSON output

```bash
trufflehog git https://github.com/trufflesecurity/test_keys --results=verified --json
```

### 8: Scan individual files or directories (filesystem scan)

```bash
trufflehog filesystem path/to/file1.txt path/to/file2.txt path/to/dir
```

### 9: Scan a local git repo

```bash
git clone git@github.com:trufflesecurity/test_keys.git
# Run trufflehog from the parent directory (outside the git repo)
trufflehog git file://test_keys --results=verified,unknown
```

To guard against malicious git configs in local scanning (CVE-2025-41390), TruffleHog clones local git repositories to a temporary directory prior to scanning. Use `--clone-path` to specify a custom clone directory, or `--trust-local-git-config` to skip the local cloning step and scan the repository directly (only for trusted repos).

### 12: Scan in CI (a git-scan variant with branch/since-commit)

```bash
trufflehog git file://. --since-commit main --branch feature-1 --results=verified,unknown --fail
```

Set `--since-commit` to the default branch people merge into (e.g. "main"), and `--branch` to the PR's branch name. The `--fail` flag returns exit code 183 if valid credentials are found.

Other scan targets shown in the README's numbered Quick Start list (not git/filesystem, included for context): scanning a GitHub org (`trufflehog github --org=...`), a GitHub repo plus its issues/PRs (`--issue-comments --pr-comments`), S3 buckets, S3 via IAM roles, a GitHub repo over SSH in Docker, GCS buckets, Docker images (registry, local daemon, or tarball), Postman workspaces, a Jenkins server, an Elasticsearch cluster (local or Elastic Cloud), GitHub cross-fork object references and deleted commits (`github-experimental --object-discovery`), Hugging Face models/datasets/spaces, and stdin input.

## What is credential verification? (verified vs. unverified)

For every potential credential that is detected, TruffleHog implements programmatic verification against the API it thinks the credential belongs to. Verification eliminates false positives and provides three result statuses:

- **verified**: Credential confirmed as valid and active by API testing
- **unverified**: Credential detected but not confirmed valid (may be invalid, expired, or verification disabled)
- **unknown**: Verification attempted but failed due to errors, such as a network or API failure

For example, the AWS credential detector performs a `GetCallerIdentity` API call against the AWS API to verify if an AWS credential is active.

## FAQ

- All I see is the banner and the program exits, what gives? That means no secrets were detected.
- Why is the scan taking a long time when scanning a GitHub org? Unauthenticated GitHub scans have rate limits; include the `--token` flag with a personal access token to improve rate limits.
- It says a private key was verified, what does that mean? A verified result means TruffleHog confirmed the credential is valid by testing it against the service's API. For private keys, this means the key can be used live for SSH or SSL authentication (see the "Driftwood" blog post).
- Is there an easy way to ignore specific secrets? If the scanned source supports line numbers, add a `trufflehog:ignore` comment on the line containing the secret.

## What's new in v3

TruffleHog v3 is a complete rewrite in Go with many new features: over 700 credential detectors supporting active verification against their respective APIs; native support for scanning GitHub, GitLab, Docker, filesystems, S3, GCS, Circle CI and Travis CI; instant verification of private keys against millions of GitHub users and billions of TLS certificates (Driftwood technology); scanning of binaries, documents, and other file formats; and availability as a GitHub Action and a pre-commit hook.

## Usage

TruffleHog has a sub-command for each source of data you may want to scan: `git`, `github`, `gitlab`, `docker`, `s3`, `filesystem` (files and directories), `syslog`, `circleci`, `travisci`, `gcs` (Google Cloud Storage), `postman`, `jenkins`, `elasticsearch`, `stdin`, `multi-scan`.

Each subcommand's options can be seen with `--help`:

```
$ trufflehog git --help
usage: TruffleHog [<flags>] <command> [<args> ...]

TruffleHog is a tool for finding credentials.

Flags:
  -h, --[no-]help                Show context-sensitive help (also try --help-long and --help-man).
      --log-level=0              Logging verbosity on a scale of 0 (info) to 5 (trace). Can be
                                 disabled with "-1".
      --[no-]profile             Enables profiling and sets a pprof and fgprof server on :18066.
  -j, --[no-]json                Output in JSON format.
      --[no-]json-legacy         Use the pre-v3.0 JSON format. Only works with git, gitlab,
                                 and github sources.
      --[no-]github-actions      Output in GitHub Actions format.
      --concurrency=12           Number of concurrent workers.
      --[no-]no-verification     Don't verify the results.
      --results=RESULTS          Specifies which type(s) of results to output: verified (confirmed
                                 valid by API), unknown (verification failed due to error),
                                 unverified (detected but not verified), filtered_unverified
                                 (unverified but would have been filtered out). Defaults to
                                 verified,unverified,unknown.
      --[no-]no-color            Disable colorized output
      --[no-]allow-verification-overlap
                                 Allow verification of similar credentials across detectors
      --[no-]filter-unverified   Only output first unverified result per chunk per detector if there
                                 are more than one results.
      --filter-entropy=FILTER-ENTROPY
                                 Filter unverified results with Shannon entropy. Start with 3.0.
      --config=CONFIG            Path to configuration file.
      --[no-]print-avg-detector-time
                                 Print the average time spent on each detector.
      --[no-]no-update           Don't check for updates.
      --[no-]fail                Exit with code 183 if results are found.
      --[no-]fail-on-scan-errors
                                 Exit with non-zero error code if an error occurs during the scan.
      --verifier=VERIFIER ...    Set custom verification endpoints.
      --[no-]custom-verifiers-only
                                 Only use custom verification endpoints.
      --detector-timeout=DETECTOR-TIMEOUT
                                 Maximum time to spend on each detector for a chunk.
```

## Precommit Hook

TruffleHog can be used as a pre-commit hook; see the pre-commit hook documentation (PreCommit.md) for details.

## Custom Regex Detector (alpha)

TruffleHog supports detection and verification of custom regular expressions. For detection, at least one regular expression and keyword is required. A keyword is a fixed literal string identifier that appears in or around the regex to be detected. To allow maximum flexibility for verification, a webhook is used containing the regular expression matches: TruffleHog sends a JSON POST request containing the regex matches to a configured webhook endpoint; if the endpoint responds with a `200 OK`, the secret is considered verified. If verification fails due to network/API errors, the result is marked as unknown. Custom Detectors support filtering by entropy, regex targeting the entire match, regex targeting the captured secret, and excluded word lists. This feature is marked alpha and subject to change.

## Generic JWT Detection

TruffleHog supports detection and verification of a subset of generic JWTs it finds. If a JWT uses public-key cryptography rather than HMAC and the public key can be obtained, TruffleHog can determine whether the JWT is live or not.

## Analyze

TruffleHog supports running a deeper analysis of a credential to view its permissions and the resources it has access to:

```bash
trufflehog analyze
```

## Verifying the release artifacts

Checksums are applied to all release artifacts, and the resulting checksum file is signed using cosign. Verification steps:

```shell
cosign verify-blob <path to trufflehog_{version}_checksums.txt> \
  --certificate <path to trufflehog_{version}_checksums.txt.pem> \
  --signature <path to trufflehog_{version}_checksums.txt.sig> \
  --certificate-identity-regexp 'https://github\.com/trufflesecurity/trufflehog/\.github/workflows/.+' \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com"

sha256sum --ignore-missing -c trufflehog_{version}_checksums.txt
```

## Note on this excerpt

This excerpt covers the What-is-TruffleHog overview, installation, the Quick Start examples for git-repo and filesystem/local scanning (numbered examples 1, 3, 8, 9, and 12 from the README's larger numbered list), the credential-verification concept (verified / unverified / unknown), the FAQ, "What's new in v3", the sub-command list and the full `--help` flag reference, the pre-commit hook pointer, the custom regex detector and generic JWT detection features, and release-artifact verification via cosign. Omitted as out of scope for this excerpt: the GitHub-repo metadata block (star/fork counts, contributor list, license badge), the "Now Scanning" marketing banner and TruffleHog Enterprise pitch, the remaining numbered Quick Start examples for non-git/filesystem sources (GitHub org/issues, S3, GCS, Docker images, Postman, Jenkins, Elasticsearch, Hugging Face, stdin), the Contributors/Contributing sections, and the final "License Change" and "Use as a library" sections, which were cut off by the fetch tool's per-page length limit right after their headings.
