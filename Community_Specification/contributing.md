# Community Specification Contribution Policy 1.0

This document provides the contribution policy for specifications and other documents developed using the Community Specification process in a repository (each a “Working Group”).  Additional or alternate contribution policies may be adopted and documented by the Working Group.

## 1.	Contribution Guidelines.

This Working Group accepts contributions via pull requests. The following section outlines the process for merging contributions to the specification

**1.1.	Issues.**  Issues are used as the primary method for tracking anything to do with this specification Working Group.

**1.1.1.	Issue Types.**  There are three types of issues (each with their own corresponding label):

**1.1.1.1.	Discussion.** These are support or functionality inquiries that we want to have a record of for future reference. Depending on the discussion, these can turn into "Spec Change" issues.

**1.1.1.2.	Proposal.** Used for items that propose a new ideas or functionality that require a larger discussion. This allows for feedback from others before a specification change is actually written. All issues that are proposals should both have a label and an issue title of "Proposal: [the rest of the title]." A proposal can become a "Spec Change" and does not require a milestone.

**1.1.1.3.	Spec Change:** These track specific spec changes and ideas until they are complete. They can evolve from "Proposal" and "Discussion" items, or can be submitted individually depending on the size. Each spec change should be placed into a milestone.

## 2.	Issue Lifecycle.

The issue lifecycle is mainly driven by the Maintainer. All issue types follow the same general lifecycle. Differences are noted below.

**2.1.	Issue Creation.**

**2.2.	Triage.**

o	The Editor in charge of triaging will apply the proper labels for the issue. This includes labels for priority, type, and metadata.

o	(If needed) Clean up the title to succinctly and clearly state the issue. Also ensure that proposals are prefaced with "Proposal".

**2.3.	Discussion.**

o	"Spec Change" issues should be connected to the pull request that resolves it.

o	Whoever is working on a "Spec Change" issue should either assign the issue to themselves or make a comment in the issue saying that they are taking it.

o	"Proposal" and "Discussion" issues should stay open until resolved.

**2.4.	Issue Closure.**

## 3.	How to Contribute a Patch.

The Working Group uses pull requests to track changes. To submit a change to the specification:

**3.1	Fork the Repo, modify the Specification to Address the Issue.**

**3.2.	Submit a Pull Request.**

## 4.	Pull Request Workflow.

The next section contains more information on the workflow followed for Pull Requests.

**4.1.	Pull Request Creation.**

o	We welcome pull requests that are currently in progress. They are a great way to keep track of important work that is in-flight, but useful for others to see. If a pull request is a work in progress, it should be prefaced with "WIP: [title]". You should also add the wip label Once the pull request is ready for review, remove "WIP" from the title and label.

o	It is preferred, but not required, to have a pull request tied to a specific issue. There can be circumstances where if it is a quick fix then an issue might be overkill. The details provided in the pull request description would suffice in this case.

**4.2.	Triage**

o	The Editor in charge of triaging will apply the proper labels for the issue. This should include at least a size label, a milestone, and awaiting review once all labels are applied.

**4.3.	Reviewing/Discussion.**

o	All reviews will be completed using the review tool.

o	A "Comment" review should be used when there are questions about the spec that should be answered, but that don't involve spec changes. This type of review does not count as approval.

o	A "Changes Requested" review indicates that changes to the spec need to be made before they will be merged.

o	Reviewers should update labels as needed (such as needs rebase).

o	When a review is approved, the reviewer should add LGTM as a comment.

o	Final approval is required by a designated Editor. Merging is blocked without this final approval. Editors will factor reviews from all other reviewers into their approval process.

**4.4.	Responsive.** Pull request owner should try to be responsive to comments by answering questions or changing text. Once all comments have been addressed, the pull request is ready to be merged.

**4.5.	Merge or Close.**

o	A pull request should stay open until a Maintainer has marked the pull request as approved.

o	Pull requests can be closed by the author without merging.

o	Pull requests may be closed by a Maintainer if the decision is made that it is not going to be merged.

The GovOps deliverables are plain Markdown files in [`docs/`](../docs). You do not need a local
toolchain to change them.

## 5.	Documentation

**5.1 Editing a document from Github** 

In the browser, open the file on GitHub, press the pencil icon, edit, and choose *Create a new
branch and start a pull request*. That is the whole workflow for a typo, a clarification, or a new
section.

**5.2 Editing a document Locally.**

```bash
git clone https://github.com/GovOpsWG/GovOps.git
cd GovOps
git checkout -b your-change
# edit docs/...
git commit -s -m "docs: clarify challenge semantics"
```

**5.3 Author Sign-off**

Every commit needs a Developer Certificate of Origin sign-off:

```bash
git commit -s
```

This appends a `Signed-off-by:` trailer. If you forget, `git commit --amend -s` fixes the last
commit.

**5.4 Document conventions**

- **No front matter.** Documents are read on GitHub as often as on
  [govops.info](https://govops.info). Keep them valid GitHub-flavored Markdown with a single `#`
  title as the first line.
- **Relative links between documents.** `../acc/authorization-capability-catalog-design.md`, not an
  absolute URL. The site rewrites these to routes at build time, and they stay clickable on GitHub.
- **Diagrams are fenced `text` blocks.** They are hand-drawn ASCII. The site renders them
  unwrapped and unhighlighted, so keep lines under roughly 100 columns or narrow viewports will
  scroll.
- **You do not have to register a new document anywhere.** Adding `docs/<section>/<name>.md` puts
  it in the sidebar and the search index automatically, titled from its first `#` heading. Linking
  it from [`docs/README.md`](../docs/README.md) controls *where* it sorts; leave it out and it goes
  last. [How the menu is built](../docs/README.md#how-the-menu-is-built) has the rules.
- **British or American spelling** — match the document you are editing rather than converting it.

**5.5 Proposing a metric**

The metric set has an admissions rule: a GovOps metric requires at least two observation windows and
reports the change between them. Read
[what counts as a GovOps metric](../docs/metrics/README.md#4-what-counts-as-a-govops-metric) first,
then use the [template](../docs/metrics/metric-definition-template.md). Open it as an issue before
writing the full entry.

**5.6 Working on the site**

The [govops.info](https://govops.info) application is in [`site/`](../site). It reads the Markdown in
`docs/` at build time — content is never duplicated. See [`site/README.md`](../site/README.md) for
the development and deployment runbook.

If your change is documentation only, you never need to touch `site/`.

