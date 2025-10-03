import React from "react";
import {Spinner} from "@heroui/react";

export const PageSpinner = () => {
    return (
        <div className="flex place-content-center h-full w-full">
            <Spinner color="primary" size="lg" />
        </div>
    );
}