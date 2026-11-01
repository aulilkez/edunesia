# Dependency updates and security scans

## Renovate

Renovate reads all workspace `package.json` files and `bun.lock` with its Bun manager. Updates are grouped into production, development, testing, TanStack, and React PRs. Renovate also checks GitHub vulnerability alerts and limits routine PRs to five at a time; security alert PRs have a separate limit of two.

Only patch updates to `@types/*` development dependencies are configured for automerge. Renovate waits for PR checks; major updates and all other dependencies need review. The repository must have CI checks required by branch protection for automerge to be effective. Enable GitHub Dependency Graph and Dependabot alerts for Renovate's vulnerability alert integration, and create a `dependencies` label in repository settings.

Review each update PR's changelog, lockfile diff, and CI results. Use the Dependency Dashboard to approve or defer major updates and lockfile maintenance.

## Trivy

The `security` job in `.github/workflows/ci.yml` scans the repository on pull requests, pushes to `main`, and a weekly schedule. It checks dependencies, secrets, and infrastructure configuration, including `compose.yaml`, at `CRITICAL` and `HIGH` severity. A matching finding fails the job. `trivy.yaml` excludes generated output and installed dependencies from traversal.

Open the Trivy job log to review each finding's file, line, rule or advisory ID, severity, and remediation. Upgrade the affected dependency or correct the configuration, then rerun CI. Add an ignore entry only for a verified false positive or accepted risk, scoped to the finding and documented with a reason and expiry; do not suppress findings just to make the scan pass.
