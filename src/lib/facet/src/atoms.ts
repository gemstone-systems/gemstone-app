export interface FacetAtomRadii {
    none: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    "2xl": number;
    "3xl": number;
    "4xl": number;
    full: number;
}

const DEFAULT_RADII: FacetAtomRadii = {
    none: 0,
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    "2xl": 16,
    "3xl": 24,
    "4xl": 32,
    full: 999999999, // supposedly it's infinity * 1px but bwegh
};

export interface FacetAtomBoxShadows {
    "2xs": string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
}

const DEFAULT_BOX_SHADOWS: FacetAtomBoxShadows = {
    "2xs": "0 1px rgb(0 0 0 / 0.05)",
    xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
};

export interface FacetAtoms {
    radii: FacetAtomRadii;
    boxShadows: FacetAtomBoxShadows;
}

export const DEFAULT_FACET_ATOMS: FacetAtoms = {
    radii: DEFAULT_RADII,
    boxShadows: DEFAULT_BOX_SHADOWS,
};
