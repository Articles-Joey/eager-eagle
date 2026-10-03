import { Suspense } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import AppThemeProvider from "@/components/AppThemeProvider";
import ControllerInputHandler from "@/components/ControllerInputHandler";
import LayoutClient from "./layout-client";
import packageInfo from "@/package.json";

import "@articles-media/articles-gamepad-helper/dist/articles-gamepad-helper.css";

export const metadata = {
    title: "Eager Eagle",
    description: packageInfo.description,
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Metal+Mania&display=swap" rel="stylesheet" />
            </head>
            <body id="eager-eagle-game-page">
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <AppThemeProvider>
                        <LayoutClient />
                        <Suspense>
                            <ControllerInputHandler />
                        </Suspense>
                        {children}
                    </AppThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
