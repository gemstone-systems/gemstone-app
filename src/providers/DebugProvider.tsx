import { isDevMode } from "@/lib/utils/env";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";

interface DebugContextValue {
    showStackHeader: boolean;
    setShowStackHeader: Dispatch<SetStateAction<boolean>>;
}

const DebugContext = createContext<DebugContextValue | null>(null);

export const useDebugState = () => {
    const value = useContext(DebugContext);
    if (value === null)
        throw new Error(
            "Debug provider failed to initialise. Did you access this out of tree somehow? Tried to access debug value before it was initialised.",
        );
    return value;
};

export const DebugProvider = ({ children }: { children: ReactNode }) => {
    const [showStackHeader, setShowStackHeader] = useState(isDevMode);

    const value: DebugContextValue = {
        showStackHeader,
        setShowStackHeader,
    };
    return <DebugContext value={value}>{children}</DebugContext>;
};
