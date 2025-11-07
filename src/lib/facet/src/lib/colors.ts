import {
    hexToHsl,
    hslToHex,
    hslToRgb,
    rgbObjectToString,
} from "@/lib/facet/src/lib/conversion";

export interface HslColor {
    h: number;
    s: number;
    l: number;
    a?: number;
}

export interface RgbColor {
    r: number;
    g: number;
    b: number;
    a?: number;
}

export type HexCode = `#${string}` | (string & {});

export const clamp = (val: number) => {
    return Math.min(1, Math.max(0, val));
};

export const lighten = (
    hex: HexCode,
    amount: number,
    method: "relative" | undefined = undefined,
) => {
    const hsl = hexToHsl(hex);

    if (typeof method !== "undefined") {
        hsl.l += hsl.l * amount;
    } else {
        hsl.l += amount;
    }
    hsl.l = clamp(hsl.l / 100) * 100;
    return hslToHex(hsl);
};

export const darken = (
    hex: HexCode,
    amount: number,
    method: "relative" | undefined = undefined,
) => {
    const hsl = hexToHsl(hex);

    if (typeof method !== "undefined") {
        hsl.l -= hsl.l * amount;
    } else {
        hsl.l -= amount;
    }
    hsl.l = clamp(hsl.l / 100) * 100;
    return hslToHex(hsl);
};

export const fade = (hex: HexCode, amount: number) => {
    const hsl = hexToHsl(hex);

    hsl.a = amount / 100;
    hsl.a = clamp(hsl.a);
    return rgbObjectToString(hslToRgb(hsl));
};
