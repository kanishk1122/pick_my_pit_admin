import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useRef } from "react";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  $createTextNode,
  PASTE_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical";

const urlRegExp =
  /((https?:\/\/(www\.)?)|(www\.))?[a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const MATCHERS = [
  (text) => {
    const match = urlRegExp.exec(text);
    return (
      match && {
        index: match.index,
        length: match[0].length,
        text: match[0],
        url: match[0].startsWith("http") ? match[0] : `https://${match[0]}`,
      }
    );
  },
];

const createLinkMatcher = (match) => {
  return { ...match };
};

export default function AutoLinkPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        PASTE_COMMAND,
        (payload) => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return false;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  return null;
}
