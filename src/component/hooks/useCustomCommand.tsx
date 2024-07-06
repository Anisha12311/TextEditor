import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$createParagraphNode, $getRoot, COMMAND_PRIORITY_LOW, createCommand, LexicalCommand} from "lexical";
import {UseCustomCommandsReturn} from "@/interfaces/alignitem.interface";

const useCustomCommands = (): UseCustomCommandsReturn => {

    const CLEAR_EDITOR_COMMAND: LexicalCommand<void> = createCommand();
    const [editor] = useLexicalComposerContext();

    editor.registerCommand(
        CLEAR_EDITOR_COMMAND,
        () => {
            editor.update(() => {
                const root = $getRoot();
                const paragraph = $createParagraphNode();
                root.clear();
                root.append(paragraph);
                paragraph.select();
            });
            return true;
        },
        COMMAND_PRIORITY_LOW
    );

    const clearEditorContent = () => editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);

    return {
        clearEditorContent
    };
}

export default useCustomCommands;