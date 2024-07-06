import React, {ReactElement} from "react";
import {SvgIconProps} from "@mui/material/SvgIcon";
import {ElementFormatType, TextFormatType} from "lexical";
import { blockTypeToBlockName } from "@/lib/constant";

export interface AlignMenuItem {
    name: string;
    icon: ReactElement<SvgIconProps>,
    payload: ElementFormatType
}

export interface FormatTextMenuItem {
    name: string;
    icon: ReactElement<SvgIconProps>,
    payload: any
}

export interface IMenuButtonStyle {
    open: boolean;
    isMdViewport: boolean;
}

export interface FormatTextMenuProps {
    hasFormat: Record<any, boolean>;
}

export interface BlockFormatMenuProps {
    blockType: keyof typeof blockTypeToBlockName;
}

export interface ColorPickerProps {
    title: string;
    onChange: (color: string) => void;
    icon?: React.ReactElement<SvgIconProps>;
}

export interface UseCustomCommandsReturn {
    clearEditorContent: () => void;
}
