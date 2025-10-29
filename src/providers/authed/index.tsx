import { HandshakesProvider } from "@/providers/authed/HandshakesProvider";
import type { ReactNode } from "react";

export const AuthedProviders = ({ children }: { children: ReactNode }) => {
    return <HandshakesProvider>{children}</HandshakesProvider>;
};
