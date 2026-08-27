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


async function buildEmbeddedKatexCss():
  Promise<string> {
  const cssPath =
    nodeRequire.resolve(
      "katex/dist/katex.min.css"
    );

  const cssDirectory =
    path.dirname(
      cssPath
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
              cssDirectory,
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