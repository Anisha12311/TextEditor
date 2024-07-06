'use client'

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
// import TreeViewPlugin from "./plugins/TreeViewPlugin";
import CodeHighlightPlugin from "./plugins/CodeHeighlightPlugin";
import PlaygroundAutoLinkPlugin from "./plugins/AutoLinkPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import Theme from '../component/Theme'
import { Box } from "@mui/material";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HashtagNode } from "@lexical/hashtag";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import MentionsPlugin from './plugins/MentionsPlugin';
import { MentionNode } from "./node/MentionNode";
import ActionsPlugin from "./plugins/ActionPlugin";
import dynamic from "next/dynamic";
const SpeechToTextPlugin = dynamic(
  () => import('./plugins/SpeechToTextPlugin'),
  { ssr: false } 
);
function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

const editorConfig:any = {
  theme: Theme,
  onError(error) {
    throw error;
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
    HashtagNode,
    MentionNode
  ]
};

export default function TextEditor() {
  return (
    <Box style = {{width : '70%', height : '60%'}}>
    <LexicalComposer initialConfig={editorConfig}>
     
    
      <div className="editor-container">
        <ToolbarPlugin />
        <TablePlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <MentionsPlugin />

          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <SpeechToTextPlugin/>
          <PlaygroundAutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <HashtagPlugin/>
          <ActionsPlugin />

          <TreeViewPlugin/>
        </div>
      </div>

    </LexicalComposer>
    </Box>
  );
}
