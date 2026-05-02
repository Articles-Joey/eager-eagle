"use client"
import { useStore } from '@/hooks/useStore';
import DarkModeHandler from '@articles-media/articles-dev-box/DarkModeHandler';
// import { useEffect } from "react";
// import { useStore } from "@/hooks/useStore";
// import { useStore } from "@/hooks/useStore";

import GlobalBody from '@articles-media/articles-dev-box/GlobalBody';
import { ControllerConnectionWatcher } from '@articles-media/articles-gamepad-helper';
import { Suspense } from 'react';

export default function LayoutClient({ children }) {

    return (
        <>
            <GlobalBody />
            <Suspense>
                <ControllerConnectionWatcher />
            </Suspense>
            <DarkModeHandler 
                useStore={useStore}
            />
        </>
    );
}
