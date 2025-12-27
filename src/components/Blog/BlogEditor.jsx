import { useState, useCallback, useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Quote,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

// Toolbar Component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const ToolbarButton = ({ onClick, isActive, icon: Icon, label }) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={twMerge(
        "p-2 rounded-md transition-colors hover:bg-zinc-700",
        isActive ? "bg-zinc-700 text-white" : "text-zinc-400"
      )}
      title={label}
      type="button"
      aria-label={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="flex items-center gap-1 border-b border-zinc-700 p-2 mb-2 flex-wrap">
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        isActive={isBold}
        icon={Bold}
        label="Bold"
      />
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        isActive={isItalic}
        icon={Italic}
        label="Italic"
      />
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        isActive={isUnderline}
        icon={Underline}
        label="Underline"
      />
      <div className="w-px h-6 bg-zinc-700 mx-1" />
      <button
        type="button"
        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-md transition-colors"
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        type="button"
        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-md transition-colors"
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-md transition-colors"
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </button>
    </div>
  );
}

// Editor Wrapper
export default function BlogEditor({ initialContent, onChange }) {
  const theme = {
    paragraph: "mb-2 text-zinc-300",
    text: {
      bold: "font-bold text-white",
      italic: "italic",
      underline: "underline",
    },
  };

  const onError = (error) => {
    console.error("Lexical Error:", error);
  };

  const initialConfig = {
    namespace: "BlogEditor",
    theme,
    onError,
    editorState: initialContent ? JSON.stringify(initialContent) : null,
  };

  return (
    <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 overflow-hidden focus-within:ring-2 focus-within:ring-zinc-600 transition-all">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative min-h-[300px] p-4">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none min-h-[300px] h-full text-zinc-300" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-zinc-600 pointer-events-none">
                Start writing your amazing story...
              </div>
            }
            ErrorBoundary={() => (
              <div className="text-red-400 text-sm p-4">
                An error occurred while rendering the editor.
              </div>
            )}
          />
          <HistoryPlugin />
          <OnChangePlugin
            onChange={(editorState) => {
              onChange(editorState.toJSON());
            }}
          />
        </div>
      </LexicalComposer>
    </div>
  );
}
