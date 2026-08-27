import {
  readFile,
} from "node:fs/promises";

import path from "node:path";


let cachedKatexCss:
  Promise<string> | null =
    null;


const KATEX_DIST_DIRECTORY =
  path.join(
    process.cwd(),
    "node_modules",
    "katex",
    "dist"
  );


const KATEX_CSS_PATH =
  path.join(
    KATEX_DIST_DIRECTORY,
    "katex.min.css"
  );


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


function resolveKatexFontPath(
  fontReference:
    string
): string {
  /*
   * KaTeX CSS font references should always
   * look like:
   *
   * fonts/KaTeX_Main-Regular.woff2
   *
   * Reject anything that attempts to escape
   * the KaTeX distribution directory.
   */
  if (
    !fontReference.startsWith(
      "fonts/"
    ) ||
    fontReference.includes(
      ".."
    ) ||
    path.isAbsolute(
      fontReference
    )
  ) {
    throw new Error(
      `Invalid KaTeX font reference: ${fontReference}`
    );
  }


  return path.join(
    KATEX_DIST_DIRECTORY,
    fontReference
  );
}


async function buildEmbeddedKatexCss():
  Promise<string> {
  /*
   * The KaTeX distribution is explicitly added
   * to outputFileTracingIncludes in next.config.
   *
   * Turbopack therefore does not need to infer
   * these runtime filesystem dependencies.
   */
  const originalCss =
    await readFile(
      /* turbopackIgnore: true */
      KATEX_CSS_PATH,
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
            resolveKatexFontPath(
              fontReference
            );


          const bytes =
            await readFile(
              /* turbopackIgnore: true */
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