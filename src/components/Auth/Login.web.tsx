import { oAuthClient } from "@/lib/utils/atproto/oauth";
import { useOAuthSetter, useOAuthValue } from "@/providers/OAuthProvider";
import { Agent } from "@atproto/api";
import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

export const Login = () => {
    const [atprotoHandle, setAtprotoHandle] = useState("");
    const oAuth = useOAuthValue();
    const setOAuth = useOAuthSetter();
    const providedOAuthClient = oAuth.client ?? oAuthClient;
    const handlePress = async () => {
        const session = await providedOAuthClient.signIn(atprotoHandle);

        const agent = new Agent(session);

        setOAuth({
            session,
            agent,
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
        <View>
            <TextInput
                style={styles.input}
                value={atprotoHandle}
                onChangeText={setAtprotoHandle}
                placeholder="alice.bsky.social"
                onSubmitEditing={handleSubmit}
            />
            <Button title="Log in with your PDS ->" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        fontSize: 16,
    },
});
