import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import { useFacet } from "@/lib/facet";
import { registerNewLattice } from "@/lib/utils/gmstn";
import {
    useOAuthAgentGuaranteed,
    useOAuthSessionGuaranteed,
} from "@/providers/OAuthProvider";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

export const RegisterLatticeModalContent = ({
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
    const { mutate: newLatticeMutation, isPending: mutationPending } =
        useMutation({
            mutationFn: async () => {
                const registerResult = await registerNewLattice({
                    latticeDomain: inputText,
                    agent,
                });
                if (!registerResult.ok) {
                    console.error(
                        "Something went wrong when registering the lattice.",
                        registerResult.error,
                    );
                    throw new Error(
                        `Something went wrong when registering the lattice. ${registerResult.error}`,
                    );
                }
                setShowRegisterModal(false);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: ["lattice", session.did],
                });
                setShowRegisterModal(false);
            },
            onError: (err) => {
                console.error(
                    "Something went wrong when registering the lattice.",
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
                <Text>Lattice domain:</Text>
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
                    placeholder="lattice.gmstn.systems"
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
                    newLatticeMutation();
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
