import { LatticeSessionsProvider } from "@/providers/authed/LatticeSessionsProvider";
import type { ReactNode } from "react";

export const AuthedProviders = ({ children }: { children: ReactNode }) => {
    return <LatticeSessionsProvider>{children}</LatticeSessionsProvider>;
};
