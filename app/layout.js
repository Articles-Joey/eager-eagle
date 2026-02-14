// import { Geist, Geist_Mono } from "next/font/google";

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';

import "bootstrap/dist/css/bootstrap.min.css";

// import "./globals.css";
import "@/styles/index.scss";

import "@articles-media/articles-dev-box/dist/style.css";

import "@articles-media/articles-gamepad-helper/dist/articles-gamepad-helper.css";

// import GlobalHead from "@articles-media/articles-dev-box/Global/GlobalHead";
// import GlobalHead from '@articles-media/articles-dev-box/GlobalHead';

// import SocketLogicHandler from "@/components/SocketLogicHandler";
// import PeerHandler from '@/components/PeerHandler';
import LayoutClient from './layout-client';
import { Suspense } from 'react';
import GlobalClientModals from '@/components/UI/GlobalClientModals';
import DarkModeHandler from '@/components/UI/DarkModeHandler';
import ControllerInputHandler from '@/components/ControllerInputHandler';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "Eager Eagle",
  description: "Get the furthest you can while avoiding the obstacles. Unlock new customizations and abilities by unlocking distance milestones.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <head>

        {/* <link
          rel="stylesheet"
          href={`${process.env.NEXT_PUBLIC_CDN}fonts/fontawsome/css/all.min.css`}
        /> */}
        {/* <GlobalHead /> */}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Metal+Mania&display=swap" rel="stylesheet"></link>

      </head>

      <body
        // className={`${geistSans.variable} ${geistMono.variable}`}
        id={`eager-eagle-game-page`}
      >

        <Suspense>

          {/* <SocketLogicHandler /> */}
          {/* <PeerHandler /> */}

          <LayoutClient />

          <GlobalClientModals />

          {/* <AudioHandler /> */}
          <DarkModeHandler />

          <ControllerInputHandler />

        </Suspense>

        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
