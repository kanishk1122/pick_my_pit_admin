import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  COMMAND_PRIORITY_CRITICAL,
} from "lexical";
import {
  $isParentElementRTL,
  $wrapNodes,
  $isAtNodeEnd,
} from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import {
  $createCodeNode,
  $isCodeNode,
  getDefaultCodeLanguage,
} from "@lexical/code";
import { TOGGLE_LINK_COMMAND, $isLinkNode } from "@lexical/link";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Redo,
  Undo,
  Link,
} from "lucide-react";

const LowPriority = 1;

const supportedBlockTypes = new Set([
  "paragraph",
  "quote",
  "code",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol",
]);

const blockTypeToBlockName = {
  code: "Code Block",
  h1: "Large Heading",
  h2: "Small Heading",
  h3: "Heading",
  ol: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
  ul: "Bulleted List",
};

function Divider() {
  return <div className="w-px h-6 bg-zinc-700 mx-1" />;
}

function BlockTypeSelect({ editor, blockType }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createParagraphNode());
      }
    });
    setShowDropdown(false);
  };

  const formatHeading = (headingSize) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createHeadingNode(headingSize));
      }
    });
    setShowDropdown(false);
  };

  const formatCode = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createCodeNode());
      }
    });
    setShowDropdown(false);
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createQuoteNode());
      }
    });
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {blockTypeToBlockName[blockType] || "Select"}
      </button>
      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10">
          <button
            onClick={formatParagraph}
            className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
          >
            Normal
          </button>
          <button
            onClick={() => formatHeading("h1")}
            className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
          >
            Large Heading
          </button>
          <button
            onClick={() => formatHeading("h2")}
            className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
          >
            Small Heading
          </button>
          <button
            onClick={() => formatHeading("h3")}
            className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
          >
            Heading
          </button>
          <button
            onClick={formatQuote}
            className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
          >
            Quote
          </button>
          <button
            onClick={formatCode}
            className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
          >
            Code Block
          </button>
        </div>
      )}
    </div>
  );
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      // Link active state
      const parent = anchorNode.getParent();
      setIsLink(parent != null && $isLinkNode(parent));

      if ($isHeadingNode(element)) {
        const tag = element.getTag();
        setBlockType(tag);
      } else if ($isCodeNode(element)) {
        setBlockType("code");
      } else if ($isListNode(element)) {
        const listNode = $getNearestNodeOfType(anchorNode, ListNode);
        setBlockType(
          listNode ? (listNode.getListType() === "ol" ? "ol" : "ul") : ""
        );
      } else if (
        typeof element.getType === "function" &&
        element.getType() === "quote"
      ) {
        setBlockType("quote");
      } else {
        setBlockType("paragraph");
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const applyStyleText = useCallback(
    (styles) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          Object.entries(styles).forEach(([style, value]) => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, style);
          });
        }
      });
    },
    [editor]
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <div className="flex items-center gap-2 border-b border-zinc-700 p-3 mb-4 flex-wrap">
      {/* Undo/Redo */}
      <button
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>

      <Divider />

      {/* Block Type */}
      <BlockTypeSelect editor={editor} blockType={blockType} />

      <Divider />

      {/* Text Format */}
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className={`p-2 rounded-lg transition-colors ${
          isBold
            ? "text-white bg-zinc-700"
            : "text-zinc-400 hover:text-white hover:bg-zinc-700"
        }`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className={`p-2 rounded-lg transition-colors ${
          isItalic
            ? "text-white bg-zinc-700"
            : "text-zinc-400 hover:text-white hover:bg-zinc-700"
        }`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className={`p-2 rounded-lg transition-colors ${
          isUnderline
            ? "text-white bg-zinc-700"
            : "text-zinc-400 hover:text-white hover:bg-zinc-700"
        }`}
        title="Underline"
      >
        <Underline className="w-4 h-4" />
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }
        className={`p-2 rounded-lg transition-colors ${
          isStrikethrough
            ? "text-white bg-zinc-700"
            : "text-zinc-400 hover:text-white hover:bg-zinc-700"
        }`}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
        className={`p-2 rounded-lg transition-colors ${
          isCode
            ? "text-white bg-zinc-700"
            : "text-zinc-400 hover:text-white hover:bg-zinc-700"
        }`}
        title="Code"
      >
        <Code className="w-4 h-4" />
      </button>

      <Divider />

      {/* Lists */}
      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        className={`p-2 rounded-lg transition-colors ${
          blockType === "ul"
            ? "text-white bg-zinc-700"
            : "text-zinc-400 hover:text-white hover:bg-zinc-700"
        }`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        className={`p-2 rounded-lg transition-colors ${
          blockType === "ol"
            ? "text-white bg-zinc-700"
            : "text-zinc-400 hover:text-white hover:bg-zinc-700"
        }`}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <Divider />

      {/* Link */}
      <button
        onClick={insertLink}
        className={`p-2 rounded-lg transition-colors ${
          isLink
            ? "text-white bg-zinc-700"
            : "text-zinc-400 hover:text-white hover:bg-zinc-700"
        }`}
        title="Link"
      >
        <Link className="w-4 h-4" />
      </button>
    </div>
  );
}
