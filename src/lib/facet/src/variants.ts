import type {
    FacetPalette,
    FacetPaletteFundemantals,
} from "@/lib/facet/src/palette";

export interface FacetVariants {
    pearl?: FacetPalette;
    obsidian?: FacetPalette;
    [x: string & {}]: FacetPalette | undefined;
}

// const DEFAULT_LIGHT_MODE: FacetPalette = {
//     colors: {},
//     semantic: {},
// }
//

// const DEFAULT_DARK_PALETTE: FacetPaletteFundemantals = {
//     crust: "#08011D",
//     mantle: "#0A031F",
//     base: "#0E0921",
//     surface0: "#191428",
//     surface1: "#241E39",
//     surface2: "#322D44",
//     overlay0: "#635F71",
//     overlay1: "#9D96A8",
//     overlay2: "#BDB4CB",
//     subtext0: "#D5CCE3",
//     subtext1: "#D9CEE8",
//     text: "#DED5F2",
//     iolite: "#57E2E5",
//     lapis: "#125E8A",
//     sapphire: "#00ABE7",
//     aquamarine: "#28C2FF",
//     apatite: "#8EE3EF",
//     emerald: "#84E296",
//     citrine: "#E8DB7D",
//     sunstone: "#E88D67",
//     garnet: "#B3001B",
//     ruby: "#D64045",
//     amethyst: "#BD66D4",
//     morganite: "#EFBDB1",
//     coral: "#FFCDB2",
//     moonstone: "#FFEAD0",
// };

// Catppuccin
const DEFAULT_DARK_PALETTE: FacetPaletteFundemantals = {
    crust: "#11111b",
    mantle: "#181825",
    base: "#1e1e2e",
    surface0: "#313244",
    surface1: "#45475a",
    surface2: "#585b70",
    overlay0: "#6c7086",
    overlay1: "#7f849c",
    overlay2: "#9399b2",
    subtext0: "#a6adc8",
    subtext1: "#bac2de",
    text: "#cdd6f4",
    iolite: "#b4befe",
    lapis: "#89b4fa",
    sapphire: "#74c7ec",
    aquamarine: "#89dceb",
    apatite: "#94e2d5",
    emerald: "#a6e3a1",
    citrine: "#f9e2af",
    sunstone: "#fab387",
    garnet: "#eba0ac",
    ruby: "#f38ba8",
    amethyst: "#cba6f7",
    morganite: "#f5c2e7",
    coral: "#f2cdcd",
    moonstone: "#f5e0dc",
};

const DEFAULT_DARK_MODE: FacetPalette = {
    colors: DEFAULT_DARK_PALETTE,
    semantic: {
        primary: DEFAULT_DARK_PALETTE.amethyst,
        secondary: DEFAULT_DARK_PALETTE.aquamarine,
        background: DEFAULT_DARK_PALETTE.base,
        backgroundDark: DEFAULT_DARK_PALETTE.mantle,
        backgroundDarker: DEFAULT_DARK_PALETTE.crust,
        surface: DEFAULT_DARK_PALETTE.surface0,
        surfaceVariant: DEFAULT_DARK_PALETTE.surface1,
        border: DEFAULT_DARK_PALETTE.overlay1,
        borderVariant: DEFAULT_DARK_PALETTE.overlay0,
        text: DEFAULT_DARK_PALETTE.text,
        textSecondary: DEFAULT_DARK_PALETTE.subtext1,
        textTertiary: DEFAULT_DARK_PALETTE.subtext0,
        textInverse: DEFAULT_DARK_PALETTE.crust,
        positive: DEFAULT_DARK_PALETTE.emerald,
        negative: DEFAULT_DARK_PALETTE.ruby,
        success: DEFAULT_DARK_PALETTE.emerald,
        error: DEFAULT_DARK_PALETTE.ruby,
        warning: DEFAULT_DARK_PALETTE.sunstone,
        info: DEFAULT_DARK_PALETTE.aquamarine,
    },
};

export const DEFAULT_FACET_VARIANTS: FacetVariants = {
    // pearl: DEFAULT_LIGHT_MODE,
    obsidian: DEFAULT_DARK_MODE,
};
