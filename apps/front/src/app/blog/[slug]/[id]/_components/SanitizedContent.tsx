"use client";

import { useEffect, useState } from "react";
import { common, createLowlight } from "lowlight";
import { toHtml } from "hast-util-to-html";

const lowlight = createLowlight(common);

type Props = {
  content: string;
};

const SanitizedContent = ({ content }: Props) => {
  const [highlightedContent, setHighlightedContent] = useState(content);

  useEffect(() => {
    const container = document.createElement("div");

    container.innerHTML = content;

    const codeBlocks = container.querySelectorAll("pre > code");

    codeBlocks.forEach((code) => {
      const languageClass = Array.from(code.classList).find((className) =>
        className.startsWith("language-"),
      );

      if (!languageClass) return;

      const language = languageClass.replace("language-", "").toLowerCase();

      // Plain text doesn't need syntax highlighting.
      if (language === "plaintext" || language === "text") {
        return;
      }

      // Check whether Lowlight supports this language.
      if (!lowlight.registered(language)) {
        console.warn(`Unsupported code language: ${language}`);
        return;
      }

      const source = code.textContent ?? "";

      try {
        const result = lowlight.highlight(language, source);

        // Lowlight returns a HAST tree.
        // Convert it into HTML before inserting it.
        code.innerHTML = toHtml(result);

        code.classList.add("hljs");
      } catch (error) {
        console.error(`Failed to highlight ${language} code block:`, error);
      }
    });

    setHighlightedContent(container.innerHTML);
  }, [content]);

  return (
    <div
      className="article-content"
      dangerouslySetInnerHTML={{
        __html: highlightedContent,
      }}
    />
  );
};

export default SanitizedContent;
