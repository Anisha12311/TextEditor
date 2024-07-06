
'use client'
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {

  $getRoot,


} from "lexical";
import {  useEffect, useRef, useState } from "react";
import * as marked from 'marked';
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import {  Box, Button, IconButton } from "@mui/material";
import { $generateHtmlFromNodes,  $generateNodesFromDOM } from '@lexical/html';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import {SPEECH_TO_TEXT_COMMAND} from './SpeechToTextPlugin'
  import dynamic from 'next/dynamic';

// const SpeechToTextPlugin = dynamic(
//     async() => await import('./SpeechToTextPlugin'),
//     { ssr: false }
//   );

//   import {SPEECH_TO_TEXT_COMMAND, SUPPORT_SPEECH_RECOGNITION} from './SpeechToTextPlugin'

// const {SPEECH_TO_TEXT_COMMAND, SUPPORT_SPEECH_RECOGNITION} =  dynamic(
//      import('./SpeechToTextPlugin'), { ssr: false }
// )
//   console.log("SpeechToTextPlugin",SpeechToTextPlugin)
//   const { SPEECH_TO_TEXT_COMMAND , SUPPORT_SPEECH_RECOGNITION} = SpeechToTextPlugin as any;



import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';

export default function ActionsPlugin(): JSX.Element {
    const [editor] = useLexicalComposerContext();
    const [isEditable, setIsEditable] = useState(() => editor.isEditable());
    const [isSpeechToText, setIsSpeechToText] = useState(false);
    const fileInputRef = useRef(null);
  
    useEffect(() => {
      return mergeRegister(
        editor.registerEditableListener((editable) => {
          setIsEditable(editable);
        })
      );
    }, [editor]);
  
    const hanldleExport = () => {
      editor.update(() => {
        const htmlString = $generateHtmlFromNodes(editor, null);
        downloadHTMLFile(htmlString, `VTextEditor_${new Date().toISOString()}.html`);
      });
    };
  
    const downloadHTMLFile = (htmlString: string, fileName: string) => {
      const blob = new Blob([htmlString], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
  
    const importHTML = (htmlString: any) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      const nodes = $generateNodesFromDOM(editor, doc);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    };
  
    const importMarkdown = (markdownContent: any) => {
      const htmlContent = marked.parse(markdownContent);
      importHTML(htmlContent);
    };
  
    const handleFileSelect = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const fileContent = e.target.result;
          if (file.name.endsWith('.html')) {
            importHTML(fileContent);
          } else if (file.name.endsWith('.md')) {
            importMarkdown(fileContent);
          } else {
            console.error('Unsupported file type');
          }
        };
        reader.readAsText(file);
      }
    };
  
    const handleFileSelects = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };
 console.log("SUPPORT_SPEECH_RECOGNITION", SPEECH_TO_TEXT_COMMAND)
    return (
        <div className="actions">
            <IconButton
              onClick={() => {
                editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, !isSpeechToText);
                setIsSpeechToText(!isSpeechToText);
              }}
              className={'action-button action-button-mic ' + (isSpeechToText ? 'active' : '')}
              title="Speech To Text"
              aria-label={`${isSpeechToText ? 'Enable' : 'Disable'} speech to text`}
            >
              <KeyboardVoiceOutlinedIcon />
            </IconButton>
      
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".html, .md"
              style={{ display: 'none' }}
              id="file-upload"
              onChange={handleFileSelect}
            />
            <IconButton onClick={handleFileSelects} title="Import">
              <FileUploadOutlinedIcon />
            </IconButton>
            <IconButton onClick={hanldleExport} title="Export">
              <FileDownloadOutlinedIcon />
            </IconButton>
          </div>
        </div>
      );
    }