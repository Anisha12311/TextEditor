import { IMenuButtonStyle } from "@/interfaces/alignitem.interface";
import {SxProps, Theme} from "@mui/material";
import {blueGrey} from "@mui/material/colors";

export const getMenuButtonStyle = ({open, isMdViewport}: IMenuButtonStyle): SxProps => ({
    color: "grey.600",
    p: "5px",
    textTransform: "none",
    ...(open && {
        "& .MuiButton-endIcon": {
            transition: "all 0.2s ease-in-out",
            transform: "rotate(180deg)",
        }
    }),
 
    ...(!isMdViewport && {
        "& .MuiButton-startIcon, & .MuiButton-endIcon": {
            m: 0,
        }
    }),
});

export const getActiveBtnStyle = (isActive: boolean): SxProps<Theme> => ({
    ...(isActive && {
        color: 'white',
        backgroundColor: 'rgb(38, 50, 56)',
        "&:hover": {backgroundColor: blueGrey[900]},
    }),
});