import { OAuthProvider } from "@/providers/OAuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <OAuthProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </OAuthProvider>
    );
};
