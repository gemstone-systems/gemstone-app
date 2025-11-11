import { GmstnLogoColor } from "@/components/icons/gmstn/GmstnLogoColor";
import { Text } from "@/components/primitives/Text";
import { useFacet } from "@/lib/facet";
import { lighten } from "@/lib/facet/src/lib/colors";
import { useOAuthSetter, useOAuthValue } from "@/providers/OAuthProvider";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { Agent } from "@atproto/api";
import { ArrowRight } from "lucide-react-native";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

export const Login = () => {
    const { semantic } = useCurrentPalette();
    const { atoms, typography } = useFacet();
    const [atprotoHandle, setAtprotoHandle] = useState("");
    const oAuth = useOAuthValue();
    const setOAuth = useOAuthSetter();
    const providedOAuthClient = oAuth.client;

    const handlePress = async () => {
        const session = await providedOAuthClient.signIn(atprotoHandle);

        const agent = new Agent(session);
        setOAuth({
            session,
            agent,
            client: providedOAuthClient,
            isLoading: false,
        });
    };

    const handleSubmit = () => {
        handlePress()
            .then()
            .catch((e: unknown) => {
                console.log(e);
            });
    };

    return (
        <View
            style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
            }}
        >
            <View style={{ alignItems: "center" }}>
                <View style={{ padding: 8, paddingLeft: 12, paddingTop: 12 }}>
                    <GmstnLogoColor height={36} width={36} />
                </View>
                <Text
                    style={[
                        typography.sizes.xl,
                        typography.weights.byName.medium,
                    ]}
                >
                    Gemstone
                </Text>
            </View>
            <View style={{ gap: 10 }}>
                <TextInput
                    style={[{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: semantic.border,
                        borderRadius: atoms.radii.lg,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        marginRight: 8,
                        fontSize: 16,
                        color: semantic.text
                    }, typography.weights.byName.light]}
                    value={atprotoHandle}
                    onChangeText={setAtprotoHandle}
                    placeholder="alice.bsky.social"
                    onSubmitEditing={handleSubmit}
                    placeholderTextColor={semantic.textPlaceholder}
                />
                <Pressable onPress={handleSubmit}>
                    {({ hovered }) => (
                        <View
                            style={{
                                backgroundColor: hovered
                                    ? lighten(semantic.primary, 7)
                                    : semantic.primary,
                                flexDirection: "row",
                                gap: 4,
                                alignItems: "center",
                                justifyContent: "center",
                                paddingVertical: 10,
                                borderRadius: atoms.radii.lg,
                            }}
                        >
                            <Text
                                style={[
                                    { color: semantic.textInverse },
                                    typography.weights.byName.normal,
                                ]}
                            >
                                Log in with ATProto
                            </Text>
                            <ArrowRight
                                height={16}
                                width={16}
                                color={semantic.textInverse}
                            />
                        </View>
                    )}
                </Pressable>
            </View>
        </View>
    );
};
