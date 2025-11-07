import type { HexCode } from "@/lib/facet/src/lib/colors";

// I do actually like Catppuccin's spread, but we'll want to define our own
// Especially to indicate differences in the strength of our UI signals.
// But doing it this way means that we can support easier re-theming in the future.
export interface FacetPaletteSemantics {
    primary: HexCode;
    primaryLight?: HexCode;
    primaryDark?: HexCode;

    secondary: HexCode;
    secondaryLight?: HexCode;
    secondaryDark?: HexCode;

    background: HexCode;
    backgroundDark: HexCode;
    backgroundDarker: HexCode;
    surface: HexCode;
    surfaceVariant: HexCode;

    border: HexCode;
    borderVariant?: HexCode;

    text: HexCode;
    textSecondary: HexCode;
    textTertiary: HexCode;
    textInverse: HexCode;

    positive: HexCode;
    positiveLight?: HexCode;
    positiveDark?: HexCode;

    negative: HexCode;
    negativeLight?: HexCode;
    negativeDark?: HexCode;

    success: HexCode;
    successLight?: HexCode;
    error: HexCode;
    errorLight?: HexCode;
    warning: HexCode;
    warningLight?: HexCode;
    info: HexCode;
    infoLight?: HexCode;
}

// Basically Catppuccin tbh
export interface FacetPaletteFundemantals {
    crust: HexCode;
    mantle: HexCode;
    base: HexCode;
    surface0: HexCode;
    surface1: HexCode;
    surface2: HexCode;
    overlay0: HexCode;
    overlay1: HexCode;
    overlay2: HexCode;
    subtext0: HexCode;
    subtext1: HexCode;
    text: HexCode;
    iolite: HexCode; // lavender
    lapis: HexCode; //blue
    sapphire: HexCode;
    aquamarine: HexCode; // sky
    apatite: HexCode; // teal
    emerald: HexCode; // green
    citrine: HexCode; // yellow
    sunstone: HexCode; // peach
    garnet: HexCode; // maroon
    ruby: HexCode; // red
    amethyst: HexCode; // mauve
    morganite: HexCode; // pink
    coral: HexCode; // flamingo
    moonstone: HexCode; // rosewater
}

/**
 * Generally, prefer to use `semantic`, as they are based on the `colors` already.
 */
export interface FacetPalette {
    colors: FacetPaletteFundemantals;
    semantic: FacetPaletteSemantics;
}
