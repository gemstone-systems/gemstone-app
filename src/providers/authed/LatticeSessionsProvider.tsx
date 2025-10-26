import type { Did } from "@/lib/types/atproto";
import type { LatticeSessionInfo } from "@/lib/types/handshake";
import type { ReactNode } from "react";
import { createContext } from "react";

type LatticeSessions = Map<Did, LatticeSessionInfo>;

interface LatticeSessionContextValue {
    sessions: LatticeSessions;
}

const LatticeSessionsContext = createContext<LatticeSessionContextValue | null>(
    null,
);

export const LatticeSessionsProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    return <LatticeSessionsContext>{children}</LatticeSessionsContext>;
};
