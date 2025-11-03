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

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [colorMode, setColorMode] = useState<ColorMode>(ColorMode.DARK);

    const value: ThemeContextValue = {
        colorMode,
        setColorMode,
    };
    return <ThemeContext value={value}>{children}</ThemeContext>;
};
