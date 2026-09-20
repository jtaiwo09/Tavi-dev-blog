"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@tiptap/extension-table";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

import { cn } from "@repo/ui/lib/utils";
import PostEditorToolbar from "@/components/editor/post-editor-toolbar";
import { CodeBlockWithCopy } from "./code-block-with-copy";

const lowlight = createLowlight(common);

type Props = {
  name: string;
  defaultValue?: string;
  error?: string | string[];
};

const PostEditor = ({ name, defaultValue = "", error }: Props) => {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockWithCopy,

      Placeholder.configure({
        placeholder: "Start writing your article...",
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),

      Image.configure({
        inline: false,
        allowBase64: false,
      }),

      Table.configure({
        resizable: true,
      }),

      TableRow,
      TableHeader,
      TableCell,

      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "javascript",
        enableTabIndentation: true,
        tabSize: 2,
      }),
    ],

    content: defaultValue,
  });

  useEffect(() => {
    if (!editor) return;

    const updateHiddenInput = () => {
      const input = document.querySelector<HTMLInputElement>(
        `input[name="${name}"]`,
      );

      if (input) {
        input.value = editor.getHTML();
      }
    };

    updateHiddenInput();

    editor.on("update", updateHiddenInput);

    return () => {
      editor.off("update", updateHiddenInput);
    };
  }, [editor, name]);

  if (!editor) {
    return (
      <div className="min-h-100 animate-pulse rounded-xl bg-surface-subtle" />
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-card transition-colors",
        error
          ? "border-error/60"
          : "border-border/70 focus-within:border-brand/40",
      )}
    >
      <PostEditorToolbar editor={editor} />

      <div className="px-5 py-6 sm:px-8 sm:py-8">
        <EditorContent editor={editor} className="post-editor-content" />
      </div>

      {error && (
        <p
          role="alert"
          className="border-t border-error/20 bg-error-subtle px-5 py-3 text-sm font-medium text-error sm:px-8"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default PostEditor;
