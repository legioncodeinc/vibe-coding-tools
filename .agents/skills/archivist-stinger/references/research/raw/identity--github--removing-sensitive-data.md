# Removing sensitive data from a repository
- URL: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
- Fetched: 2026-09-05
- Source type: official-docs

Sensitive data can be removed from the history of a repository if you can carefully coordinate with everyone who has cloned it and you are willing to manage the side effects.

## About removing sensitive data from a repository

When altering your repository's history using tools like `git-filter-repo`, it's crucial to understand the implications. Rewriting history requires careful coordination with collaborators to successfully execute, and has a number of side effects that must be managed.

It is important to note that if the sensitive data you need to remove is a secret (e.g. password/token/credential), as is often the case, then as a first step you need to revoke and/or rotate that secret. Once the secret is revoked or rotated, it can no longer be used for access, and that may be sufficient to solve your problem. Going through the extra steps to rewrite the history and remove the secret may not be warranted.

## Side effects of rewriting history

There are numerous side effects to rewriting history; these include:

- High risk of recontamination: It is unfortunately easy to re-push the sensitive data to the repository and make a bigger mess. If a fellow developer has a clone from before your rewrite, and after your rewrite simply runs `git pull` followed by `git push`, the sensitive data will return. They need to either discard their clone and re-clone, or carefully walk through multiple steps to clean up their clone first.
- Risk of losing other developers' work: If other developers continue updating branches which contain the sensitive data while you are trying to clean up, you will be forced to either redo the cleanup, or to discard their work.
- Changed commit hashes: Rewriting history will change the hashes of the commits that introduced the sensitive data and all commits that came after. Any tooling or automation that depends on commit hashes not changing will be broken or have problems.
- Branch protection challenges: If you have any branch protections that prevent force pushes, those protections will have to be turned off (at least temporarily) for the sensitive data to be removed.
- Broken diff view for closed pull requests: Removing the sensitive data will require removing the internal references used for displaying the diff view in pull requests, so you will no longer be able to see these diffs. This is true not only for the PR that introduced the sensitive data, but any PR that builds on a version of history after the sensitive data PR was merged (even if those later PRs didn't add or modify any file with sensitive data).
- Poor interaction with open pull requests: Changed commit SHAs will result in a different PR diff, and comments on the old PR diff may become invalidated and lost, which may cause confusion for authors and reviewers. We recommend merging or closing all open pull requests before removing files from your repository.
- Lost signatures on commits and tags: Signatures for commits or tags depend on commit hashes; since commit hashes are modified by history rewrites, signatures would no longer be valid and many history rewriting tools (including `git-filter-repo`) will simply remove the signatures. In fact, `git-filter-repo` will remove commit signatures and tag signatures for commits that pre-date the sensitive data removal as well. (Technically one can workaround this with the `--refs` option to `git-filter-repo` if needed, but then you will need to be careful to ensure you specify all refs that have sensitive data in their history and that include the commits that introduced the sensitive data in your range).
- Leading others directly to the sensitive data: Git was designed with cryptographic checks built into commit identifiers so that nefarious individuals could not break into a server and modify history without being noticed. That's helpful from a security perspective, but from a sensitive data perspective it means that expunging sensitive data is a very involved process of coordination; it further means that when you do modify history, clueful users with an existing clone will notice the history divergence and can use it to quickly and easily find the sensitive data still in their clone that you removed from the central repository.

## About sensitive data exposure

Removing sensitive data from a repository involves four high-level steps:

- Rewrite the repository locally, using git-filter-repo
- Update the repository on GitHub, using your locally rewritten history
- Coordinate with colleagues to clean up other clones that exist
- Prevent repeats and avoid future sensitive data spills

If you only rewrite your history and force push it, the commits with sensitive data may still be accessible elsewhere:

- In any clones or forks of your repository
- Directly via their SHA-1 hashes in cached views on GitHub
- Through any pull requests that reference them

You cannot remove sensitive data from other users' clones of your repository; you will have to send them the instructions from "Make sure other copies are cleaned up: clones of colleagues" in the `git-filter-repo` manual to have them do so themselves. However, you can permanently remove cached views and references to the sensitive data in pull requests on GitHub by contacting us through the GitHub Support portal.

> [!IMPORTANT]
> GitHub Support won't remove non-sensitive data, and will only assist in the removal of sensitive data in cases where we determine that the risk can't be mitigated by rotating affected credentials.

If the commit that introduced the sensitive data exists in any forks, it will continue to be accessible there. You will need to coordinate with the owners of the forks, asking them to remove the sensitive data or delete the fork entirely. GitHub cannot provide contact information for these owners.

Consider these limitations and challenges in your decision to rewrite your repository's history.

## Purging a file from your local repository's history using git-filter-repo

1. Install the latest release of the `git-filter-repo` tool. You need a version with the `--sensitive-data-removal` flag, meaning at least version 2.47. You can install `git-filter-repo` manually or by using a package manager. For example, to install the tool with Homebrew, use the `brew install` command.
   ```
   brew install git-filter-repo
   ```
   For more information, see INSTALL.md in the `newren/git-filter-repo` repository.
2. Clone the repository to your local computer. See "Cloning a repository."
   ```
   git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
   ```
3. Navigate into the repository's working directory.
   ```
   cd YOUR-REPOSITORY
   ```
4. Run a `git-filter-repo` command to clean up the sensitive data. If you want to delete a specific file from all branches/tags/refs, run the following command replacing `PATH-TO-YOUR-FILE-WITH-SENSITIVE-DATA` with the git path to the file you want to remove, not just its filename (e.g. `src/module/phone-numbers.txt`):
   ```
   git-filter-repo --sensitive-data-removal --invert-paths --path PATH-TO-YOUR-FILE-WITH-SENSITIVE-DATA
   ```
   > [!IMPORTANT]
   > If the file with sensitive data used to exist at any other paths (because it was moved or renamed), you must either add an extra `--path` argument for that file, or run this command a second time naming the alternative path.

   If you want to replace all text listed in `../passwords.txt` from any non-binary files found anywhere in your repository's history, run the following command:
   ```
   git-filter-repo --sensitive-data-removal --replace-text ../passwords.txt
   ```
5. Double-check that you've removed everything you wanted to from your repository's history.
6. Find out how many pull requests will be adversely affected by this history rewrite. You will need this information below.
   ```
   $ grep -c '^refs/pull/.*/head$' .git/filter-repo/changed-refs
   4
   ```
   You can drop the `-c` to see which pull requests are affected:
   ```
   $ grep '^refs/pull/.*/head$' .git/filter-repo/changed-refs
   refs/pull/589/head
   refs/pull/602/head
   refs/pull/604/head
   refs/pull/605/head
   ```
   This output includes the pull request number between the second and third slashes. If the number of pull requests affected is larger than you expected, you can discard this clone with no ill-effects and either redo the rewrite or abandon the sensitive data removal. Once you move on to the next step, the rewrite becomes irreversible.
7. Once you're happy with the state of your repository, force-push your local changes to overwrite your repository on GitHub.com. Even though `--force` is implied by `--mirror`, we include it below as a reminder that you are forcibly updating all branches, tags, and refs and you are discarding any changes others may have made to those refs while you were cleaning up the repository.
   ```
   git push --force --mirror origin
   ```
   This command will fail to push any refs starting with `refs/pull/`, since GitHub marks those as read-only. Those push failures will be handled in the next section. If any other refs fail to push, you likely have branch protection turned on for that branch and will need to turn it off temporarily and redo the push. Repeat until the only failures to update are refs starting with `refs/pull/`.

## Fully removing the data from GitHub

After using `git-filter-repo` to remove the sensitive data and pushing your changes to GitHub, you must take a few more steps to fully remove the data from GitHub.

1. Contact us through the GitHub Support portal, and provide the following information:
   - The owner and repository name in question (e.g. YOUR-USERNAME/YOUR-REPOSITORY).
   - The number of affected pull requests, found in the previous step. This is used by Support to verify you understand how much will be affected.
   - The First Changed Commit(s) reported by `git-filter-repo` (look for `NOTE: First Changed Commit(s)` in its output).
   - If `NOTE: There were LFS Objects Orphaned by this rewrite` appears in the git-filter-repo output (right after the First Changed Commit), then mention you had LFS Objects Orphaned and upload the named file to the ticket as well.

   If you have successfully cleaned up all references other than PRs, and no forks have references to the sensitive data, Support will then: dereference or delete any affected PRs on GitHub; run a garbage collection on the server to expunge the sensitive data from storage; remove cached views; and, if LFS Objects are involved, delete and/or purge the orphaned LFS objects.

   > [!IMPORTANT]
   > GitHub Support won't remove non-sensitive data, and will only assist in the removal of sensitive data in cases where we determine that the risk can't be mitigated by rotating affected credentials.
2. Collaborators must rebase, not merge, any branches they created off of your old (tainted) repository history. One merge commit could reintroduce some or all of the tainted history that you just went to the trouble of purging. They may need to take additional steps as well; see "Make sure other copies are cleaned up: clones of colleagues" in the `git-filter-repo` manual.

## Avoiding accidental commits in the future

Preventing contributors from making accidental commits can help you prevent sensitive information from being exposed. For more information see "Best practices for preventing data leaks in your organization."

There are a few things you can do to avoid committing or pushing things that should not be shared:

- If the sensitive data is likely to be found in a file that should not be tracked by git, add that filename to `.gitignore` (and make sure to commit and push that change to `.gitignore` so other developers are protected).
- Avoid hardcoding secrets in code. Use environment variables, or secret management services like Azure Key Vault, AWS Secrets Manager, or HashiCorp Vault to manage and inject secrets at runtime.
- Create a pre-commit hook to check for sensitive data before it is committed or pushed anywhere, or use a well-known tool in a pre-commit hook like git-secrets or gitleaks. (Make sure to ask each collaborator to set up the pre-commit hook you have chosen.)
- Use a visual program like GitHub Desktop or gitk to commit changes. Visual programs generally make it easier to see exactly which files will be added, deleted, and modified with each commit.
- Avoid the catch-all commands `git add .` and `git commit -a` on the command line, use `git add filename` and `git rm filename` to individually stage files, instead.
- Use `git add --interactive` to individually review and stage changes within each file.
- Use `git diff --cached` to review the changes that you have staged for commit. This is the exact diff that `git commit` will produce as long as you don't use the `-a` flag.
- Enable push protection for your repository to detect and prevent pushes which contain hardcoded secrets from being committed to your codebase. For more information, see "Push protection."

## Further reading

- `git-filter-repo` man page, especially the "Sensitive Data Removal" subsection of the "DISCUSSION" section.
- "Pro Git: Git Tools - Rewriting History"
- "Secret scanning"

## Note on this excerpt

This is the complete substantive content of the page, from the opening summary through "Further reading." No sections were omitted; GitHub's own repo-metadata chrome (navigation, sidebar, "In this article" links) was dropped as boilerplate.
