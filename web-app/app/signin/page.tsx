"use client"

import SignInPage from "./signin-page";
import {Suspense} from "react";

export default function Page() {
    return <Suspense>
        <SignInPage/>
    </Suspense>
}
