import { FacetProvider, generateFacet } from "@/lib/facet";
import { DebugProvider } from "@/providers/DebugProvider";
import { OAuthProvider } from "@/providers/OAuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const facet = generateFacet();
const queryClient = new QueryClient();

export const RootProviders = ({ children }: { children: ReactNode }) => {
    return (
        <FacetProvider facet={facet}>
            <ThemeProvider>
                <DebugProvider>
                    <QueryClientProvider client={queryClient}>
                        <OAuthProvider>{children}</OAuthProvider>
                    </QueryClientProvider>
                </DebugProvider>
            </ThemeProvider>
        </FacetProvider>
    );
};
