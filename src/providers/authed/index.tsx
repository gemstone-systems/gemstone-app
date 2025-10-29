import { HandshakesProvider } from "@/providers/authed/HandshakesProvider";
import { SessionsProvider } from "@/providers/authed/SessionsProvider";
import type { ReactNode } from "react";

export const AuthedProviders = ({ children }: { children: ReactNode }) => {
    return (
        <HandshakesProvider>
            <SessionsProvider>{children}</SessionsProvider>
        </HandshakesProvider>
    );
};
