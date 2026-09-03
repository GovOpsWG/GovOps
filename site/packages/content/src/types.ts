export type TocEntry = {
  readonly id: string;
  readonly depth: 2 | 3;
  readonly text: string;
};

/** One rendered document, generated at build time from a file under `docs/`. */
export type DocPage = {
  readonly route: string;
  /** Relative to the repository root, e.g. `docs/architecture/README.md`. */
  readonly sourcePath: string;
  /** e.g. `architecture`. Empty for `docs/README.md`. */
  readonly section: string;
  readonly title: string;
  /** First paragraph, plain text, for meta descriptions and listings. */
  readonly summary: string;
  /** Lifted from a `**Status:** ...` paragraph, when the document has one. */
  readonly status: string | null;
  readonly html: string;
  readonly toc: readonly TocEntry[];
  readonly wordCount: number;
  readonly readingMinutes: number;
};

export type NavChild = {
  readonly route: string;
  readonly title: string;
};

export type NavSection = {
  readonly route: string;
  readonly title: string;
  readonly children: readonly NavChild[];
};

export type SearchDocument = {
  readonly id: string;
  readonly route: string;
  readonly title: string;
  readonly section: string;
  readonly headings: string;
  readonly body: string;
};
