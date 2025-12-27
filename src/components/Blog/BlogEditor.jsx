import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import BlogTheme from "./themes/BlogTheme";

function Placeholder() {
  return (
    <div className="absolute top-4 left-4 text-zinc-600 pointer-events-none text-sm">
      Start writing your amazing blog post...
    </div>
  );
}

const EMPTY_CONTENT = {
  root: {
    children: [
      {
        children: [],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
};

const ensureNonEmptyContent = (content) => {
  const safe = content && typeof content === "object" ? content : EMPTY_CONTENT;
  if (
    safe?.root?.children &&
    Array.isArray(safe.root.children) &&
    safe.root.children.length > 0
  ) {
    return safe;
  }
  return EMPTY_CONTENT;
};

export default function BlogEditor({ initialContent, onChange }) {
  const editorConfig = {
    theme: BlogTheme,
    onError(error) {
      console.error("Editor error:", error);
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
  };

  const sanitizedContent = ensureNonEmptyContent(initialContent);

  return (
    <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 overflow-hidden focus-within:ring-2 focus-within:ring-zinc-600 transition-all">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          editorState: sanitizedContent
            ? JSON.stringify(sanitizedContent)
            : null,
        }}
      >
        <ToolbarPlugin />
        <div className="relative min-h-[400px] p-4">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none min-h-[400px] text-zinc-200 text-base leading-relaxed" />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <CodeHighlightPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={3} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin
            onChange={(editorState) => {
              const json = editorState.toJSON();
              onChange(ensureNonEmptyContent(json));
            }}
          />
        </div>
      </LexicalComposer>
    </div>
  );
}
