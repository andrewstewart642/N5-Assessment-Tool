import {
  existsSync,
} from "node:fs";

import {
  readFile,
} from "node:fs/promises";

import {
  createRequire,
} from "node:module";

import path from "node:path";


const nodeRequire =
  createRequire(
    import.meta.url
  );


let cachedKatexCss:
  Promise<string> | null =
    null;


function getFontMimeType(
  fontPath:
    string
): string {
  const extension =
    path
      .extname(
        fontPath
      )
      .toLowerCase();


  if (
    extension ===
    ".woff2"
  ) {
    return "font/woff2";
  }


  if (
    extension ===
    ".woff"
  ) {
    return "font/woff";
  }


  if (
    extension ===
    ".ttf"
  ) {
    return "font/ttf";
  }


  if (
    extension ===
    ".otf"
  ) {
    return "font/otf";
  }


  return "application/octet-stream";
}


function resolveKatexDistDirectory():
  string {
  const candidates:
    string[] = [];


  /*
   * Prefer resolving the actual KaTeX JavaScript
   * package rather than asking the bundler to
   * resolve a CSS asset directly.
   *
   * KaTeX's main package entry lives inside its
   * dist directory, alongside katex.min.css.
   */

  try {
    const resolvedKatexEntry =
      nodeRequire.resolve(
        "katex"
      );


    if (
      typeof resolvedKatexEntry ===
        "string" &&
      resolvedKatexEntry.trim()
    ) {
      candidates.push(
        path.dirname(
          resolvedKatexEntry
        )
      );
    }
  } catch {
    /*
     * If package resolution is unavailable in a
     * particular runtime, fall through to the
     * normal project node_modules location.
     */
  }


  candidates.push(
    path.join(
      process.cwd(),
      "node_modules",
      "katex",
      "dist"
    )
  );


  for (
    const candidate
    of candidates
  ) {
    const cssPath =
      path.join(
        candidate,
        "katex.min.css"
      );


    if (
      existsSync(
        cssPath
      )
    ) {
      return candidate;
    }
  }


  throw new Error(
    [
      "Unable to locate the KaTeX distribution directory.",
      "PDF generation requires katex.min.css and its font files.",
      `Checked: ${candidates.join(", ")}`,
    ].join(
      " "
    )
  );
}


async function buildEmbeddedKatexCss():
  Promise<string> {
  const katexDistDirectory =
    resolveKatexDistDirectory();


  const cssPath =
    path.join(
      katexDistDirectory,
      "katex.min.css"
    );


  const originalCss =
    await readFile(
      cssPath,
      "utf8"
    );


  const fontReferences =
    Array.from(
      originalCss.matchAll(
        /url\((['"]?)(fonts\/[^'")]+)\1\)/g
      )
    )
      .map(
        (
          match
        ) =>
          match[2]
      )
      .filter(
        (
          value,
          index,
          values
        ) =>
          values.indexOf(
            value
          ) ===
          index
      );


  const replacementEntries =
    await Promise.all(
      fontReferences.map(
        async (
          fontReference
        ) => {
          const absoluteFontPath =
            path.resolve(
              katexDistDirectory,
              fontReference
            );


          const bytes =
            await readFile(
              absoluteFontPath
            );


          const mimeType =
            getFontMimeType(
              absoluteFontPath
            );


          const dataUri =
            `data:${mimeType};base64,${bytes.toString(
              "base64"
            )}`;


          return [
            fontReference,
            dataUri,
          ] as const;
        }
      )
    );


  const replacementMap =
    new Map(
      replacementEntries
    );


  return originalCss.replace(
    /url\((['"]?)(fonts\/[^'")]+)\1\)/g,
    (
      original,
      _quote:
        string,
      fontReference:
        string
    ) => {
      const dataUri =
        replacementMap.get(
          fontReference
        );


      if (
        !dataUri
      ) {
        return original;
      }


      return `url("${dataUri}")`;
    }
  );
}


export function getEmbeddedKatexCss():
  Promise<string> {
  if (
    !cachedKatexCss
  ) {
    cachedKatexCss =
      buildEmbeddedKatexCss();
  }


  return cachedKatexCss;
}