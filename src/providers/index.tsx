import { DebugProvider } from "@/providers/DebugProvider";
import { OAuthProvider } from "@/providers/OAuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const queryClient = new QueryClient();

export const RootProviders = ({ children }: { children: ReactNode }) => {
    return (
        <DebugProvider>
            <QueryClientProvider client={queryClient}>
                <OAuthProvider>{children}</OAuthProvider>
            </QueryClientProvider>
        </DebugProvider>
    );
};
