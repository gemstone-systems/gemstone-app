import type { Facet } from "@/lib/facet/src/facet";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

const FacetContext = createContext<Facet | null>(null);

export const useFacet = () => {
    const value = useContext(FacetContext);
    if (!value)
        throw new Error(
            "Facet provider failed to initialise. Did you access this out of tree somehow? Tried to access facet values before it was initialised.",
        );
    return value;
};

export const useAtoms = () => {
    const { atoms } = useFacet();
    return atoms;
};

export const useVariant = (variantName: string) => {
    const { variants } = useFacet();
    const variant = variants[variantName];
    if (!variant)
        throw new Error(
            `Provided variant ${variantName} does not exist in the configured Facet. Check the configuration init object.`,
        );
    return variant;
};

export const useTypography = () => {
    const { typography } = useFacet();
    return typography;
};

export const FacetProvider = ({
    children,
    facet,
}: {
    children: ReactNode;
    facet: Facet;
}) => {
    return <FacetContext value={facet}>{children}</FacetContext>;
};
