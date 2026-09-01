/**
 * Two documents hand-maintain a table of contents for GitHub, which has no sidebar; the site
 * builds its own from the headings. The Markdown file is untouched — this is render-only.
 */
export function stripTableOfContents(markdown: string): string {
  return markdown.replace(/^##\s+Table of Contents\s*\n[\s\S]*?(?=^##\s)/m, "");
}

/**
 * Drops the title and status, which the page chrome renders instead. Only the block before the
 * first `##` is touched, and the Markdown file is unchanged — on GitHub both still belong.
 */
export function stripDocumentHeader(markdown: string): string {
  const firstSection = markdown.search(/^##\s/m);
  const head = firstSection === -1 ? markdown : markdown.slice(0, firstSection);
  const tail = firstSection === -1 ? "" : markdown.slice(firstSection);

  const cleaned = head
    .replace(/^#\s+.+\r?\n/, "")
    .replace(/^\*\*Status:\*\*.*\r?\n/m, "")
    .replace(/^(?:\s*(?:-{3,}|\*{3,}|_{3,})\s*\r?\n)+/, "")
    .replace(/(?:\s*(?:-{3,}|\*{3,}|_{3,})\s*\r?\n)+$/, "")
    .replace(/^\s+/, "");

  return `${cleaned}${cleaned && !cleaned.endsWith("\n\n") ? "\n\n" : ""}${tail}`;
}
