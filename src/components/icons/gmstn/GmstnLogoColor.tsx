import { GmstnLogo } from "@/components/icons/gmstn/GmstnLogo";
import { useCurrentPalette } from "@/providers/ThemeProvider";

export const GmstnLogoColor = ({
    height,
    width,
}: {
    height?: number;
    width?: number;
}) => {
    const { semantic } = useCurrentPalette();
    return (
        <GmstnLogo
            fill={semantic.primary}
            style={{ height: height ?? 32, width: width ?? 32 }}
        />
    );
};
