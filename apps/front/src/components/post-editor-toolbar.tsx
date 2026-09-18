"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { Editor } from "@tiptap/react";

import {
  Bold,
  Check,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/components/ui/command";

type Props = {
  editor: Editor;
};

type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
  children: ReactNode;
  className?: string;
  label: string;
};

type LanguageOption = {
  value: string;
  label: string;
};

const CODE_LANGUAGES: LanguageOption[] = [
  {
    value: "javascript",
    label: "JavaScript",
  },
  {
    value: "typescript",
    label: "TypeScript",
  },
  {
    value: "jsx",
    label: "JSX",
  },
  {
    value: "tsx",
    label: "TSX",
  },
  {
    value: "html",
    label: "HTML",
  },
  {
    value: "css",
    label: "CSS",
  },
  {
    value: "json",
    label: "JSON",
  },
  {
    value: "bash",
    label: "Bash",
  },
  {
    value: "python",
    label: "Python",
  },
  {
    value: "sql",
    label: "SQL",
  },
  {
    value: "markdown",
    label: "Markdown",
  },
  {
    value: "yaml",
    label: "YAML",
  },
  {
    value: "xml",
    label: "XML",
  },
];

function ToolbarButton({
  active = false,
  disabled = false,
  onPress,
  children,
  className,
  label,
}: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      data-active={active ? "true" : "false"}
      onMouseDown={(event) => {
        /*
         * Prevent the toolbar from stealing the editor selection.
         */
        event.preventDefault();

        if (!disabled) {
          onPress();
        }
      }}
      className={cn(
        "size-8 shrink-0 rounded-md",
        "text-muted-foreground",
        "transition-all duration-150",
        "hover:bg-muted",
        "hover:text-foreground",
        "disabled:pointer-events-none",
        "disabled:opacity-40",

        active && [
          "bg-primary/10",
          "text-primary",
          "shadow-sm",
          "hover:bg-primary/15",
          "dark:bg-primary/15",
          "dark:text-primary",
          "dark:hover:bg-primary/20",
        ],

        className,
      )}
    >
      {children}
    </Button>
  );
}

function Divider() {
  return (
    <div aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-border/70" />
  );
}

const PostEditorToolbar = ({ editor }: Props) => {
  const [, setEditorState] = useState(0);

  useEffect(() => {
    const update = () => {
      setEditorState((value) => value + 1);
    };

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    editor.on("focus", update);
    editor.on("blur", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
      editor.off("focus", update);
      editor.off("blur", update);
    };
  }, [editor]);

  /*
   * Formatting commands
   */

  const toggleHeading = useCallback(
    (level: 1 | 2 | 3) => {
      editor.chain().focus().toggleHeading({ level }).run();
    },
    [editor],
  );

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor.chain().focus().toggleCode().run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const toggleBlockquote = useCallback(() => {
    editor.chain().focus().toggleBlockquote().run();
  }, [editor]);

  /*
   * Code block
   */

  const toggleCodeBlock = useCallback(() => {
    if (editor.isActive("codeBlock")) {
      editor.chain().focus().toggleCodeBlock().run();

      return;
    }

    editor
      .chain()
      .focus()
      .toggleCodeBlock()
      .updateAttributes("codeBlock", {
        language: "javascript",
      })
      .run();
  }, [editor]);

  /*
   * Change code block language.
   */
  const changeCodeLanguage = useCallback(
    (language: string) => {
      if (!editor.isActive("codeBlock")) {
        return;
      }

      editor
        .chain()
        .focus()
        .updateAttributes("codeBlock", {
          language,
        })
        .run();
    },
    [editor],
  );

  /*
   * Horizontal rule
   */

  const insertHorizontalRule = useCallback(() => {
    editor.chain().focus().setHorizontalRule().run();
  }, [editor]);

  /*
   * Link handling
   */

  const setLink = useCallback(() => {
    const { from, to } = editor.state.selection;

    const previousUrl = editor.getAttributes("link").href ?? "";

    const url = window.prompt("Enter URL", previousUrl || "https://");

    if (url === null) {
      editor.commands.focus();

      editor.commands.setTextSelection({
        from,
        to,
      });

      return;
    }

    editor.commands.focus();

    editor.commands.setTextSelection({
      from,
      to,
    });

    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: url.trim(),
      })
      .run();
  }, [editor]);

  /*
   * Editor capabilities
   */

  const canUndo = editor.can().undo();
  const canRedo = editor.can().redo();

  /*
   * Active states
   */

  const isHeading1 = editor.isActive("heading", {
    level: 1,
  });

  const isHeading2 = editor.isActive("heading", {
    level: 2,
  });

  const isHeading3 = editor.isActive("heading", {
    level: 3,
  });

  const isBold = editor.isActive("bold");
  const isItalic = editor.isActive("italic");
  const isCode = editor.isActive("code");
  const isLink = editor.isActive("link");

  const isBulletList = editor.isActive("bulletList");
  const isOrderedList = editor.isActive("orderedList");
  const isBlockquote = editor.isActive("blockquote");
  const isCodeBlock = editor.isActive("codeBlock");

  /*
   * Current code language.
   *
   * CodeBlockLowlight stores this on the codeBlock node.
   */
  const currentLanguage =
    editor.getAttributes("codeBlock").language || "javascript";

  return (
    <div
      role="toolbar"
      aria-label="Text formatting"
      className={cn(
        "sticky top-0 z-20",
        "flex flex-wrap items-center gap-1",
        "border-b border-border/60",
        "bg-card/95",
        "px-3 py-2 sm:px-4",
        "backdrop-blur-md",
      )}
    >
      {/* Undo / Redo */}

      <ToolbarButton
        label="Undo"
        disabled={!canUndo}
        onPress={() => {
          editor.chain().focus().undo().run();
        }}
      >
        <Undo2 className="size-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Redo"
        disabled={!canRedo}
        onPress={() => {
          editor.chain().focus().redo().run();
        }}
      >
        <Redo2 className="size-4" />
      </ToolbarButton>

      <Divider />

      {/* Headings */}

      <ToolbarButton
        label="Heading 1"
        active={isHeading1}
        onPress={() => toggleHeading(1)}
      >
        <Heading1 className="size-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Heading 2"
        active={isHeading2}
        onPress={() => toggleHeading(2)}
      >
        <Heading2 className="size-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Heading 3"
        active={isHeading3}
        onPress={() => toggleHeading(3)}
      >
        <Heading3 className="size-4" />
      </ToolbarButton>

      <Divider />

      {/* Inline formatting */}

      <ToolbarButton label="Bold" active={isBold} onPress={toggleBold}>
        <Bold className="size-4" />
      </ToolbarButton>

      <ToolbarButton label="Italic" active={isItalic} onPress={toggleItalic}>
        <Italic className="size-4" />
      </ToolbarButton>

      <ToolbarButton label="Inline code" active={isCode} onPress={toggleCode}>
        <Code className="size-4" />
      </ToolbarButton>

      <ToolbarButton label="Link" active={isLink} onPress={setLink}>
        <LinkIcon className="size-4" />
      </ToolbarButton>

      <Divider />

      {/* Lists */}

      <ToolbarButton
        label="Bullet list"
        active={isBulletList}
        onPress={toggleBulletList}
      >
        <List className="size-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Ordered list"
        active={isOrderedList}
        onPress={toggleOrderedList}
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>

      <Divider />

      {/* Blockquote */}

      <ToolbarButton
        label="Blockquote"
        active={isBlockquote}
        onPress={toggleBlockquote}
      >
        <Quote className="size-4" />
      </ToolbarButton>

      {/* Code block */}

      <ToolbarButton
        label="Code block"
        active={isCodeBlock}
        onPress={toggleCodeBlock}
      >
        <span className="font-mono text-[11px] font-bold">{"</>"}</span>
      </ToolbarButton>

      {/* Code language */}

      {isCodeBlock && (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                className={cn(
                  "ml-1 flex h-8 items-center gap-2 rounded-md",
                  "border border-border/70",
                  "bg-muted/50 px-2.5",
                  "text-xs font-medium text-muted-foreground",
                  "transition-colors",
                  "hover:bg-muted hover:text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                )}
              >
                <span className="font-mono text-[11px] text-primary">
                  {"</>"}
                </span>

                <span className="max-w-25 truncate">
                  {CODE_LANGUAGES.find(
                    (language) => language.value === currentLanguage,
                  )?.label ?? "JavaScript"}
                </span>

                <ChevronDown className="size-3.5 opacity-60" />
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              sideOffset={6}
              className="w-60 p-0"
              onOpenAutoFocus={(event) => {
                event.preventDefault();
              }}
            >
              <Command>
                <CommandInput placeholder="Search language..." />

                <CommandList>
                  <CommandEmpty>No language found.</CommandEmpty>

                  <CommandGroup heading="Language">
                    {CODE_LANGUAGES.map((language) => {
                      const active = language.value === currentLanguage;

                      return (
                        <CommandItem
                          key={language.value}
                          value={language.value}
                          onSelect={() => {
                            changeCodeLanguage(language.value);
                          }}
                          className="cursor-pointer"
                        >
                          <span className="mr-2 font-mono text-[11px] text-muted-foreground">
                            {"</>"}
                          </span>

                          <span className="flex-1">{language.label}</span>

                          {active && <Check className="size-4 text-primary" />}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Divider />
        </>
      )}

      {/* Horizontal rule */}

      <ToolbarButton label="Horizontal rule" onPress={insertHorizontalRule}>
        <Minus className="size-4" />
      </ToolbarButton>
    </div>
  );
};

export default PostEditorToolbar;
