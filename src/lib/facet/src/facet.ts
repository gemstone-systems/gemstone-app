import { DEFAULT_FACET_ATOMS, type FacetAtoms } from "@/lib/facet/src/atoms";
import {
    DEFAULT_FACET_TYPOGRAPHY,
    type FacetTypography,
} from "@/lib/facet/src/typography";
import {
    DEFAULT_FACET_VARIANTS,
    type FacetVariants,
} from "@/lib/facet/src/variants";

export interface Facet {
    variants: FacetVariants;
    typography: FacetTypography;
    atoms: FacetAtoms;
}

export const DEFAULT_FACET: Facet = {
    variants: DEFAULT_FACET_VARIANTS,
    typography: DEFAULT_FACET_TYPOGRAPHY,
    atoms: DEFAULT_FACET_ATOMS,
};

function deepMerge<T extends object>(defaults: T, overrides: Partial<T>): T {
    const result = { ...defaults };

    for (const key in overrides) {
        if (Object.prototype.hasOwnProperty.call(overrides, key)) {
            const overrideValue = overrides[key];
            const defaultValue = result[key];

            if (
                overrideValue !== undefined &&
                overrideValue !== null &&
                typeof overrideValue === "object" &&
                !Array.isArray(overrideValue) &&
                defaultValue &&
                typeof defaultValue === "object" &&
                !Array.isArray(defaultValue)
            ) {
                result[key] = deepMerge(defaultValue, overrideValue);
            } else if (overrideValue !== undefined) {
                // @ts-expect-error We are doing funky type magicks
                result[key] = overrideValue;
            }
        }
    }

    return result;
}

export const generateFacet = (cfg: Partial<Facet> = {}) => {
    return deepMerge<Facet>(DEFAULT_FACET, cfg);
};
