# OWASP GovOps Github Home

Welcome! All the GovOps standards, artifacts, and content to generate the [website](https://govops.info) are here. This is also a good place to start a [Discussions](https://github.com/GovOpsWG/GovOps/discussions) if you have an idea for a new GovOps metric, a question about GovOps or want to start a discussion about a [wiki](https://github.com/GovOpsWG/GovOps/wiki) post. 


## Purpose of GovOps

Governance Operations (GovOps) is an [OWASP](https://owasp.org) Working Group developing a continuous operational approach to enterprise technology governance, aligned with Google’s Beyond Zero principles. It helps the humans responsible for the business assess risk, establish accountability, and make informed decisions about controls and investment. Its TRACE evidence profile connects runtime activity to business context, supporting accountability, compliance, threat detection, observability, and metrics for governance.

## History of GovOps

The GovOps effort started in late 2025 around the idea that a new architecture was
needed to govern agentic risk, lead by current co-Chairs Mike Schwartz and Rohit Khare. 
Rohit coined the name. Mike wrote the [first article](https://gluufederation.medium.com/introducing-govops-02063b72db4b). In early 2026, GovOps was proposed as an OpenSSF working group. After delays, GovOps decided to form under OWASP. [Here](./docs/owasp/project_proposal.md) is the accepted OWASP proposal which also describes the three project deliverables: Standards, Architecture and Metrics.

## Communication Channels

* [OWASP GovOps Slack](https://owasp.slack.com/archives/C0BQMFJSCGM) - detailed conversations going on amongst the editors about the three deliverables
* [GitHub Discussion Forum](https://github.com/GovOpsWG/GovOps/discussions) - Propose a metric or ask a question.
* [Linkedin GovOps Group](https://www.linkedin.com/groups/17478011/) - Larger community and a good place to post articles or have discussions with a wider audience of GovOps interested parties. Currently around 200 members, representing a range of interested parties, including vendors, integrators, IT architects, and industry analysts.  
* All-hands meetings are open to everyone to discuss progress for the week:
  * 14:00 UTC - Friday "Early" Meeting [Google Meet](https://meet.google.com/tqq-zqep-fkj)
  * 20:00 UTC - Friday "Late" Meeting [Google Meet](https://meet.google.com/wwh-yhox-tmf)


## GovOps Website 

Documents for [https://govops.info](https://govops.info) are picked up automatically from the `/docs` folder — you do not register them anywhere. See [How the menu is built](#how-the-menu-is-built).

### Conventions

- Documents are plain GitHub-flavored Markdown with no front matter, so they read correctly both on GitHub and on govops.info.
- Relative links between documents work in both places. The site rewrites them to routes at build time.
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

See [CONTRIBUTING.md](./Community_Specification/contributing.md) to propose a change.

