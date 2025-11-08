import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import type { AtUri } from "@/lib/types/atproto";
import type { SystemsGmstnDevelopmentLattice } from "@/lib/types/lexicon/systems.gmstn.development.lattice";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { useLatticeInfoQuery } from "@/queries/hooks/useLatticeInfoQuery";
import { BadgeCheck, X } from "lucide-react-native";
import { View } from "react-native";

export const LatticeInfo = ({
    lattice,
}: {
    lattice: {
        uri: Required<AtUri>;
        value: SystemsGmstnDevelopmentLattice;
    };
}) => {
    const latticeDomain = lattice.uri.rKey;
    const { useQuery } = useLatticeInfoQuery(latticeDomain);
    const { isLoading, data: latticeInfo } = useQuery();
    const { semantic } = useCurrentPalette();

    return (
        <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
            {isLoading ? (
                <Loading size="small" />
            ) : (
                <>
                    <Text>{latticeDomain}</Text>
                    {latticeInfo ? (
                        latticeInfo.registered ? (
                            <BadgeCheck
                                height={16}
                                width={16}
                                color={semantic.positive}
                            />
                        ) : (
                            <X
                                height={16}
                                width={16}
                                color={semantic.negative}
                            />
                        )
                    ) : (
                        <X height={16} width={16} color={semantic.negative} />
                    )}
                </>
            )}
        </View>
    );
};
