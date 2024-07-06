'use client'
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import TextEditor from "../component/TextEditor";
import { Box } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Box sx = {{display : 'flex', justifyContent : 'center', alignItem : 'center',  }} >
   
      <TextEditor/>
    </Box>
   
  );
}
