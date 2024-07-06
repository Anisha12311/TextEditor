import { AlignMenuItem, FormatTextMenuItem } from "@/interfaces/alignitem.interface";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import AlignHorizontalRightIcon from "@mui/icons-material/AlignHorizontalRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import SubscriptIcon from '@mui/icons-material/Subscript';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {TextFormatType} from "lexical";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


export const alignMenuItems: AlignMenuItem[] = [
    {
        name: "Left Align",
        icon: <AlignHorizontalLeftIcon />,
        payload: "left",
    },
    {
        name: "Center Align",
        icon: <FormatAlignCenterIcon />,
        payload: "center",
    },
    {
        name: "Right Align",
        icon: <AlignHorizontalRightIcon />,
        payload: "right",
    },
    {
        name: "Justify Align",
        icon: <FormatAlignJustifyIcon />,
        payload: "justify",
    }
];


export const formatMenuItems: FormatTextMenuItem[] = [
    {
        name: "Strikethrough",
        icon: <StrikethroughSIcon />,
        payload: "strikethrough",
    },
    {
        name: "Highlight",
        icon: <BorderColorIcon />,
        payload: "highlight",
    },
    {
        name: "Subscript",
        icon: <SubscriptIcon />,
        payload: "subscript",
    },
    {
        name: "Superscript",
        icon: <SuperscriptIcon />,
        payload: "superscript",
    },
    {
        name: "Clear format",
        icon: <DeleteOutlineIcon />,
        payload: "clearformating",
    }
];


export const initialHasFormat: Record<any, boolean> = {
  
    strikethrough: false,
    subscript: false,
    superscript: false,
    clearformatting : false
}

export const blockTypeToBlockName = {
    bullet: 'Bulleted List',
    check: 'Check List',
    code: 'Code Block',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    h5: 'Heading 5',
    h6: 'Heading 6',
    number: 'Numbered List',
    paragraph: 'Normal',
    quote: 'Quote',
};

export interface UseBlockFormatProps {
    blockType: keyof typeof blockTypeToBlockName;
}