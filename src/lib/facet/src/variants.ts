import type {
    FacetPalette,
    FacetPaletteFundemantals,
} from "@/lib/facet/src/palette";

export interface FacetVariants {
    pearl?: FacetPalette;
    obsidian?: FacetPalette;
    [x: string]: FacetPalette | undefined;
}

// const DEFAULT_LIGHT_MODE: FacetPalette = {
//     colors: {},
//     semantic: {},
// }
//

const DEFAULT_DARK_PALETTE: FacetPaletteFundemantals = {
    crust: "#060116",
    mantle: "#0A031F",
    base: "#0E0726",
    surface0: "#110B24",
    surface1: "#241E39",
    surface2: "#322D44",
    overlay0: "#635F71",
    overlay1: "#9D96A8",
    overlay2: "#BDB4CB",
    subtext0: "#D5CCE3",
    subtext1: "#D9CEE8",
    text: "#DED5F2",
    iolite: "#57E2E5",
    lapis: "#125E8A",
    sapphire: "#00ABE7",
    aquamarine: "#28C2FF",
    apatite: "#8EE3EF",
    emerald: "#84E296",
    citrine: "#E8DB7D",
    sunstone: "#E88D67",
    garnet: "#B3001B",
    ruby: "#D64045",
    amethyst: "#BD66D4",
    morganite: "#EFBDB1",
    coral: "#FFCDB2",
    moonstone: "#FFEAD0",
};

const DEFAULT_DARK_MODE: FacetPalette = {
    colors: DEFAULT_DARK_PALETTE,
    semantic: {
        primary: DEFAULT_DARK_PALETTE.amethyst,
        secondary: DEFAULT_DARK_PALETTE.aquamarine,
        background: DEFAULT_DARK_PALETTE.base,
        surface: DEFAULT_DARK_PALETTE.surface0,
        surfaceVariant: DEFAULT_DARK_PALETTE.surface1,
        text: DEFAULT_DARK_PALETTE.text,
        textSecondary: DEFAULT_DARK_PALETTE.subtext0,
        textTertiary: DEFAULT_DARK_PALETTE.subtext1,
        textInverse: DEFAULT_DARK_PALETTE.crust,
        positive: DEFAULT_DARK_PALETTE.emerald,
        negative: DEFAULT_DARK_PALETTE.ruby,
        success: DEFAULT_DARK_PALETTE.emerald,
        error: DEFAULT_DARK_PALETTE.ruby,
        warning: DEFAULT_DARK_PALETTE.sunstone,
        info: DEFAULT_DARK_PALETTE.iolite,
    },
};

export const DEFAULT_FACET_VARIANTS: FacetVariants = {
    // pearl: DEFAULT_LIGHT_MODE,
    obsidian: DEFAULT_DARK_MODE,
};
