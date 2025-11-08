import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import { useFacet } from "@/lib/facet";
import { registerNewShard } from "@/lib/utils/gmstn";
import {
    useOAuthAgentGuaranteed,
    useOAuthSessionGuaranteed,
} from "@/providers/OAuthProvider";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { useShardsQuery } from "@/queries/hooks/useShardsQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

export const RegisterShardModalContent = ({
    setShowRegisterModal,
}: {
    setShowRegisterModal: Dispatch<SetStateAction<boolean>>;
}) => {
    const { semantic } = useCurrentPalette();
    const { atoms, typography } = useFacet();
    const [inputText, setInputText] = useState("");
    const [registerError, setRegisterError] = useState<string | undefined>(
        undefined,
    );
    const agent = useOAuthAgentGuaranteed();
    const session = useOAuthSessionGuaranteed();
    const queryClient = useQueryClient();
    const { queryKey: shardsQueryKey } = useShardsQuery(session)
    const { mutate: newShardMutation, isPending: mutationPending } =
        useMutation({
            mutationFn: async () => {
                const registerResult = await registerNewShard({
                    shardDomain: inputText,
                    agent,
                });
                if (!registerResult.ok) {
                    console.error(
                        "Something went wrong when registering the shard.",
                        registerResult.error,
                    );
                    throw new Error(
                        `Something went wrong when registering the shard. ${registerResult.error}`,
                    );
                }
                setShowRegisterModal(false);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: shardsQueryKey,
                });
                setShowRegisterModal(false);
            },
            onError: (err) => {
                console.error(
                    "Something went wrong when registering the shard.",
                    err,
                );
                setRegisterError(err.message);
            },
        });

    return (
        <View
            style={{
                backgroundColor: semantic.surface,
                borderRadius: atoms.radii.lg,
                display: "flex",
                gap: 12,
                padding: 16,
            }}
        >
            <View style={{ gap: 4 }}>
                <Text>Shard domain:</Text>
                <TextInput
                    style={[
                        {
                            flex: 1,
                            borderWidth: 1,
                            borderColor: semantic.borderVariant,
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            color: semantic.text,
                            outline: "0",
                            fontFamily: typography.families.primary,
                            width: 256,
                        },
                        typography.weights.byName.extralight,
                        typography.sizes.sm,
                    ]}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="shard.gmstn.systems"
                    placeholderTextColor={semantic.textPlaceholder}
                />
            </View>
            <Pressable
                style={{
                    backgroundColor: inputText.trim()
                        ? semantic.primary
                        : registerError
                          ? semantic.error
                          : semantic.border,
                    borderRadius: atoms.radii.lg,
                    alignItems: "center",
                    paddingVertical: 10,
                }}
                onPress={() => {
                    newShardMutation();
                }}
            >
                {mutationPending ? (
                    <Loading size="small" />
                ) : (
                    <Text
                        style={[
                            typography.weights.byName.normal,
                            { color: semantic.textInverse },
                        ]}
                    >
                        Register
                    </Text>
                )}
            </Pressable>
        </View>
    );
};
