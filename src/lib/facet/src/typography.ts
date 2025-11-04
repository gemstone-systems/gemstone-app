export interface FacetFontFamilies {
    primary: string;
    secondary?: string;
    tertiary?: string;
    serif?: string;
    sansSerif?: string;
    monospace: string;
}

const DEFAULT_FONT_FAMILIES: FacetFontFamilies = {
    primary: "Lexend_300Light",
    monospace: "Maple Mono",
};

export interface FacetFontSize {
    fontSize: number;
    lineHeight: number;
}

export interface FacetFontSizes {
    xs: FacetFontSize;
    sm: FacetFontSize;
    base: FacetFontSize;
    lg: FacetFontSize;
    xl: FacetFontSize;
    "2xl": FacetFontSize;
    "3xl": FacetFontSize;
    "4xl": FacetFontSize;
}

const DEFAULT_FONT_SIZES: FacetFontSizes = {
    xs: {
        fontSize: 12,
        lineHeight: 16,
    },
    sm: {
        fontSize: 14,
        lineHeight: 20,
    },
    base: {
        fontSize: 16,
        lineHeight: 24,
    },
    lg: {
        fontSize: 18,
        lineHeight: 28,
    },
    xl: {
        fontSize: 20,
        lineHeight: 28,
    },
    "2xl": {
        fontSize: 24,
        lineHeight: 32,
    },
    "3xl": {
        fontSize: 30,
        lineHeight: 36,
    },
    "4xl": {
        fontSize: 36,
        lineHeight: 40,
    },
};

export interface FacetFontStyles {
    italic: string;
    notItalic: string;
}

const DEFAULT_FONT_STYLES: FacetFontStyles = {
    italic: "italic",
    notItalic: "normal",
};

export interface FacetFontWeights {
    thin: number;
    extralight: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
    black: number;
}

const DEFAULT_FONT_WEIGHTS: FacetFontWeights = {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
};

export interface FacetLetterSpacings {
    tighter: number;
    tight: number;
    normal: number;
    wide: number;
    wider: number;
    widest: number;
}

const DEFAULT_LETTER_SPACINGS: FacetLetterSpacings = {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
};

export interface TypographySemantic {
    size: FacetFontSize;
    style: string;
    weight: number;
    spacing: number;
}

export interface FacetTypographySemantics {
    regular?: TypographySemantic;
    [x: string]: TypographySemantic | undefined;
}

const DEFAULT_TYPOGRAPHY_SEMANTICS: FacetTypographySemantics = {
    regular: {
        size: DEFAULT_FONT_SIZES.base,
        style: DEFAULT_FONT_STYLES.notItalic,
        weight: DEFAULT_FONT_WEIGHTS.light,
        spacing: DEFAULT_LETTER_SPACINGS.normal,
    },
};

/**
 * Generally, prefer to use `semantic`, as they are based on the other properties already.
 */
export interface FacetTypography {
    families: FacetFontFamilies;
    styles: FacetFontStyles;
    sizes: FacetFontSizes;
    weights: FacetFontWeights;
    spacings: FacetLetterSpacings;
    tracking: FacetLetterSpacings;
    semantic: FacetTypographySemantics;
}

export const DEFAULT_FACET_TYPOGRAPHY: FacetTypography = {
    families: DEFAULT_FONT_FAMILIES,
    styles: DEFAULT_FONT_STYLES,
    sizes: DEFAULT_FONT_SIZES,
    weights: DEFAULT_FONT_WEIGHTS,
    spacings: DEFAULT_LETTER_SPACINGS,
    tracking: DEFAULT_LETTER_SPACINGS,
    semantic: DEFAULT_TYPOGRAPHY_SEMANTICS,
};
