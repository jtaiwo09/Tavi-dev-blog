// components/editor/code-block-with-copy.tsx
"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

function CodeBlockView({ node }: NodeViewProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(node.textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <NodeViewWrapper className="code-block">
      <button
        type="button"
        contentEditable={false}
        className="code-copy-btn"
        aria-label={copied ? "Copied" : "Copy code"}
        data-copied={copied || undefined}
        onMouseDown={(e) => e.preventDefault()} // keep editor focus/selection
        onClick={copy}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre>
        <NodeViewContent as="div" />
      </pre>
    </NodeViewWrapper>
  );
}

export const CodeBlockWithCopy = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView);
  },
}).configure({ lowlight });
