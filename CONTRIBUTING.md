# Contributing to GovOps

The GovOps deliverables are plain Markdown files in [`docs/`](./docs). You do not need a local
toolchain to change them.

## Editing a document

**In the browser.** Open the file on GitHub, press the pencil icon, edit, and choose *Create a new
branch and start a pull request*. That is the whole workflow for a typo, a clarification, or a new
section.

**Locally.**

```bash
git clone https://github.com/GovOpsWG/GovOps.git
cd GovOps
git checkout -b your-change
# edit docs/...
git commit -s -m "docs: clarify challenge semantics"
```

## Sign-off is required

Every commit needs a Developer Certificate of Origin sign-off:

```bash
git commit -s
```

This appends a `Signed-off-by:` trailer. If you forget, `git commit --amend -s` fixes the last
commit.

## Document conventions

- **No front matter.** Documents are read on GitHub as often as on
  [govops.info](https://govops.info). Keep them valid GitHub-flavored Markdown with a single `#`
  title as the first line.
- **Relative links between documents.** `../acc/authorization-capability-catalog-design.md`, not an
  absolute URL. The site rewrites these to routes at build time, and they stay clickable on GitHub.
- **Diagrams are fenced `text` blocks.** They are hand-drawn ASCII. The site renders them
  unwrapped and unhighlighted, so keep lines under roughly 100 columns or narrow viewports will
  scroll.
- **Add new documents to [`docs/README.md`](./docs/README.md).** That file drives the site
  navigation. A document not listed there will not appear in the sidebar.
- **British or American spelling** — match the document you are editing rather than converting it.

## Proposing a metric

The metric set has an admissions rule: a GovOps metric requires at least two observation windows and
reports the change between them. Read
[what counts as a GovOps metric](./docs/metrics/README.md#4-what-counts-as-a-govops-metric) first,
then use the [template](./docs/metrics/metric-definition-template.md). Open it as an issue before
writing the full entry.

## Working on the site

The [govops.info](https://govops.info) application is in [`site/`](./site). It reads the Markdown in
`docs/` at build time — content is never duplicated. See [`site/README.md`](./site/README.md) for
the development and deployment runbook.

If your change is documentation only, you never need to touch `site/`.

## Discussion

Larger proposals — a new deliverable, a change to the capability model, a change to the architecture
— are worth an [issue](https://github.com/GovOpsWG/GovOps/issues) before a pull request. The
[GovOps LinkedIn Group](https://gluu.co/govops-group) is where the working group announces meetings.

## License

This repository is [CC0 1.0 Universal](./LICENSE). By contributing you dedicate your contribution to
the public domain.
