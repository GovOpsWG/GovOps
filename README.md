# OWASP GovOps Github Home

Welcome! All the GovOps standards, artifacts, and content to generate the [website](https://govops.info) are here. This is also a good place to register  issues which will get the attention of the GovOps WG editors. 


## Purpose of GovOps

Governance Operations (GovOps) is a OWASP WG whose goal is to defines a new scalable operational architecture for governing authorization risk across modern software systems, infrastructure, and endpoints. It's designed to address the challenges of modern, highly dynamic, and automated environments, particularly those involving agentic software. [Here](./owasp/project_proposal.md) is the accepted OWASP proposal which also describes the three project deliverables: Standards, Architecture and Metrics.

## Communication Channels

* [OWASP GovOps Slack](https://owasp.slack.com/archives/C0BQMFJSCGM) - detailed conversations going on amongst the editors about the three deliverables
* [Linkedin GovOps Group](https://www.linkedin.com/groups/17478011/) - Larger community and a good place to post articles or have discussions with a wider audience of GovOps interested parties.
* All-hands meetings are open to everyone to discuss progress for the week:
  * 14:00 UTC - Friday "Early" Meeting [Google Meet](https://meet.google.com/tqq-zqep-fkj)
  * 20:00 UTC - Friday Late Meeting [Google Meet](https://meet.google.com/wwh-yhox-tmf)

## GovOps Website 

Documents for [https://govops.info](https://govops.info) are picked up automatically from the `/docs` folder — you do not register them anywhere. See [How the menu is built](#how-the-menu-is-built).

### Conventions

- Documents are plain GitHub-flavored Markdown with no front matter, so they read correctly both on
  GitHub and on govops.info.
- Relative links between documents work in both places. The site rewrites them to routes at build
  time.
- Fenced `text` blocks hold hand-drawn diagrams. The site renders them unwrapped and
  unhighlighted — keep them under roughly 100 columns.

### How the menu is built

The sidebar is generated from the files on disk at build time. Nothing is registered by hand.

| What you do | What appears |
|---|---|
| Add `docs/<section>/<name>.md` | An entry in that section's menu, titled from its first `#` heading |
| Add a new `docs/<section>/` directory | A new section, titled from its `README.md`, or from the directory name if it has none |
| Link a document from this file | It sorts to that position instead of alphabetically |
| Add `docs/<name>.md` at the top level | A reachable page, but **not** a menu entry — this is how `MOVED.md` stays out of the way |

The rules in full:

1. **Sections are directories.** Every subdirectory of `docs/` becomes one.
2. **Section titles come from `README.md`.** A section without one is titled from its directory
   name (`event-handling` becomes "Event handling") and its heading links to its first document
   rather than to a page that does not exist.
3. **Order comes from this file.** Sections and documents appear in the order they are linked
   above. Anything not linked sorts to the end of its section, alphabetically by title.
4. **Nothing is hidden by omission.** A document you forget to link here still appears in the menu
   and is still searchable — it just sorts last.

So the only reason to edit this file is to change *reading order* or to describe a document. To add
one, just add the file.

See [CONTRIBUTING.md](../Community_Specification/contributing.md) to propose a change.
