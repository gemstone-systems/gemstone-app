import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import type { AtUri } from "@/lib/types/atproto";
import type { SystemsGmstnDevelopmentLattice } from "@/lib/types/lexicon/systems.gmstn.development.lattice";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { getOwnerInfoFromLattice } from "@/queries/get-owner-info-from-lattice";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, X } from "lucide-react-native";
import { View } from "react-native";

export const LatticeInfo = ({
    shard,
}: {
    shard: {
        uri: Required<AtUri>;
        value: SystemsGmstnDevelopmentLattice;
    };
}) => {
    const latticeDomain = shard.uri.rKey;
    const { isLoading, data: latticeInfo } = useQuery({
        queryKey: ["shardInfo", latticeDomain],
        queryFn: async () => {
            return await getOwnerInfoFromLattice(latticeDomain);
        },
        retry: 1,
    });
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
