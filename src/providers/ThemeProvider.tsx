import { useFacet } from "@/lib/facet";
import type { Facet } from "@/lib/facet/src/facet";
import type { FacetPalette } from "@/lib/facet/src/palette";
import type { Enumify } from "@/lib/utils/types";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";

export const ColorMode = {
    DARK: "dark",
    LIGHT: "light",
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare -- intentional. lets us have enum-like objects without some of the weirdness
export type ColorMode = Enumify<typeof ColorMode>;

interface ThemeContextValue {
    colorMode: ColorMode;
    setColorMode: Dispatch<SetStateAction<ColorMode>>;
    currentPalette: FacetPalette;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const useThemeProvider = () => {
    const value = useContext(ThemeContext);
    if (!value)
        throw new Error(
            "Theme provider failed to initialise. Did you access this out of tree somehow? Tried to access theme values before it was initialised.",
        );
    return value;
};

export const useColorMode = () => {
    const { colorMode } = useThemeProvider();
    return colorMode;
};

export const useSetColorMode = () => {
    const { setColorMode } = useThemeProvider();
    return setColorMode;
};

export const useCurrentPalette = () => {
    const { currentPalette } = useThemeProvider();
    return currentPalette;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [colorMode, setColorMode] = useState<ColorMode>(ColorMode.DARK);
    const facet = useFacet();
    const currentPalette =
        colorMode === "dark"
            ? facet.variants.obsidian
            : // TODO: temporary. will remove the null coalesce when pearl is defined.
              (facet.variants.pearl ?? facet.variants.obsidian);

    // TODO: remove nullability with obsidian and pearl palettes.
    // instead, these are provided as defaults and if we add more themes
    // in the future, they can just be tacked on.
    if (!currentPalette) throw new Error("Don't use light mode for now.");

    const value: ThemeContextValue = {
        colorMode,
        setColorMode,
        currentPalette,
    };
    return <ThemeContext value={value}>{children}</ThemeContext>;
};
