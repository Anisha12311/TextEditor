"use client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useRef, useState } from "react";
import Divider from "@mui/material/Divider";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";

import {
  REDO_COMMAND,
  UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createTextNode,
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isAtNodeEnd } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import LockIcon from '@mui/icons-material/Lock';
import { createPortal } from "react-dom";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { createCommand } from "lexical";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";
import { Box, IconButton, Tooltip } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import AlignMenu from "../common/AlignItems";
import FormatText from "../common/FormatText";
import useEditorToolbar from "../hooks/useEditorToolbar";
import BlockFormat from "../common/BlockFormat";
import { getActiveBtnStyle } from "../../styles/alignitem.styled";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import ColorPicker from "../common/ColorPicker";
import useColorPicker from "../hooks/useColorPicker";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import useCustomCommands from "../hooks/useCustomCommand";
import LockOpenIcon from '@mui/icons-material/LockOpen';
const LowPriority = 1;

const ADD_EMOJI_COMMAND = createCommand();
const ADD_TEXTCOLOR_COMMAND = createCommand();

function positionEditorElement(editor: any, rect: any) {
  if (rect === null) {
    editor.style.opacity = "0";
    editor.style.top = "-1000px";
    editor.style.left = "-1000px";
  } else {
    editor.style.opacity = "1";
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
}

function FloatingLinkEditor({ editor }: any) {
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const mouseDownRef = useRef(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState(null);

  const updateLinkEditor = useCallback(() => {
    const selection: any = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection: any = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== "link-input") {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl("");
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }: any) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LowPriority
      )
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);


  return (
    <div ref={editorRef} className="link-editor">
      {isEditMode ? (
        <input
          ref={inputRef}
          className="link-input"
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== "") {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                }
                setEditMode(false);
              }
            } else if (event.key === "Escape") {
              event.preventDefault();
              setEditMode(false);
            }
          }}
        />
      ) : (
        <>
          <div className="link-input">
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkUrl}
            </a>
            <div
              className="link-edit"
              role="button"
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setEditMode(true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

function getSelectedNode(selection: any) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [isLink, setIsLink] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { onFontColorSelect, onBgColorSelect } = useColorPicker();

  const { clearEditorContent } = useCustomCommands();

  const handleClearEditorContent = () => {
    if (confirm("Are you sure you want to clear out the editor's content?"))
      clearEditorContent();
  };
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
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
        ADD_EMOJI_COMMAND,
        (payload: any) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertNodes([$createTextNode(payload)]);
          }
          return true;
        },
        LowPriority
      ),
      editor.registerCommand(
        ADD_TEXTCOLOR_COMMAND,
        (payload: any) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertNodes([$createTextNode(payload)]);
          }
          return true;
        },
        LowPriority
      )
    );
  }, [editor]);

  
  const insertLink = useCallback(() => {
    if (!isLink) {
      console.log("islink", isLink);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const { hasFormat, blockTypes, isEditorEmpty } = useEditorToolbar();
 const [readMode, setReadMode] = useState(false)
  const handleReadMode = () => {
    editor.setEditable(false)
    setReadMode(true)
  }

  const handleWriteMode = () => {
    editor.setEditable(true)
    setReadMode(false)
  }
 
  return (
    <div className="toolbar" ref={toolbarRef} >
      <Tooltip title="Undo (Ctrl + Z)">
        <IconButton
          size="small"
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        >
          <UndoIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Redo (Ctrl + Y)">
        <IconButton
          size="small"
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        >
          <RedoIcon />
        </IconButton>
      </Tooltip>
      <Divider orientation="vertical" flexItem sx={{ marginRight: "10px" }} />
      <BlockFormat blockType={blockTypes} />

      <Divider orientation="vertical" flexItem sx={{ marginRight: "10px" }} />
      {blockTypes !== "code" && (
        <>
          <Tooltip title="Bold (Ctrl + B)">
            <IconButton
              size="small"
              sx={getActiveBtnStyle(hasFormat.bold)}
              onClick={() =>
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
              }
            >
              <FormatBoldIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Italic (Ctrl + I)">
            <IconButton
              size="small"
              sx={getActiveBtnStyle(hasFormat.italic)}
              onClick={() =>
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
              }
            >
              <FormatItalicIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Underline (Ctrl + U)">
            <IconButton
              size="small"
              sx={getActiveBtnStyle(hasFormat.underline)}
              onClick={() =>
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
              }
            >
              <FormatUnderlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Strikethrough">
            <IconButton
              size="small"
              sx={getActiveBtnStyle(hasFormat.strikethrough)}
              onClick={() =>
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
              }
            >
              <StrikethroughSIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Insert link">
            <IconButton
              size="small"
              sx={getActiveBtnStyle(isLink)}
              onClick={insertLink}
            >
              <InsertLinkIcon />
            </IconButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ marginRight: "10px" }}
          />
          <FormatText hasFormat={hasFormat} />
          {isLink &&
            createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
          <Divider
            orientation="vertical"
            flexItem
            sx={{ marginRight: "10px" }}
          />
          <AlignMenu />
          <Divider orientation="vertical" flexItem />
          <IconButton
            size="small"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <AddReactionOutlinedIcon sx={{ color: "gray" }} />
          </IconButton>

          {showEmojiPicker && (
            <Box>
              <Picker
                style={{ position: "absolute" }}
                data={data}
                onEmojiSelect={(d: any) => {
                  editor.dispatchCommand(ADD_EMOJI_COMMAND, d.native);
                }}
              />
            </Box>
          )}
          <ColorPicker
            key="color-picker"
            title="Font color"
            onChange={(color) => onFontColorSelect(color)}
            icon={<FormatColorTextIcon />}
          />
          <ColorPicker
            key="bg-color-picker"
            title="Background color"
            onChange={(color) => onBgColorSelect(color)}
            icon={<FormatColorFillIcon />}
          />
          {/* <Divider
            orientation="vertical"
            flexItem
            sx={{ marginLeft: "10px" }}
          />
          <InsertMenu />
          <Divider orientation="vertical" flexItem sx={{ marginRight: "10px" }} /> */}
          <Tooltip title="Clear editor">
            <IconButton
              size="small"
              disabled={isEditorEmpty}
              onClick={handleClearEditorContent}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
          {readMode ? 
         <Tooltip title="Write Mode">
         <IconButton
           size="small"
           onClick={handleWriteMode}
         >
           <LockOpenIcon />
         </IconButton>
       </Tooltip>:     <Tooltip title="Read Only">
            <IconButton
              size="small"
              onClick={handleReadMode}
            >
              <LockIcon />
            </IconButton>
          </Tooltip>
        }
        
        </>
      )}

    </div>
  );
}
