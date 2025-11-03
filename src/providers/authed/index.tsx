import { HandshakesProvider } from "@/providers/authed/HandshakesProvider";
import { ProfileProvider } from "@/providers/authed/ProfileProvider";
import { SessionsProvider } from "@/providers/authed/SessionsProvider";
import type { ReactNode } from "react";

export const AuthedProviders = ({ children }: { children: ReactNode }) => {
    return (
        <HandshakesProvider>
            <SessionsProvider>
                <ProfileProvider>{children}</ProfileProvider>
            </SessionsProvider>
        </HandshakesProvider>
    );
};
