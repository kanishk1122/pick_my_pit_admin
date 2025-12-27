import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import { $isListNode, ListNode } from "@lexical/list";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import {
  $getSelection,
  $isRangeSelection,
  $getNearestNodeOfType,
  COMMAND_PRIORITY_LOW,
} from "lexical";

export default function ListMaxIndentLevelPlugin({ maxDepth = 3 }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        INSERT_UNORDERED_LIST_COMMAND,
        () => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return false;
          }
          const listNode = $getNearestNodeOfType(
            selection.anchor.getNode(),
            ListNode
          );
          if (listNode) {
            return false;
          }
          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, maxDepth]);

  return null;
}
