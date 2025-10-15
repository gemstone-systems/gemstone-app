import { oAuthClient } from "@/lib/utils/atproto/oauth";
import { useOAuth } from "@/providers/OAuthProvider";
import { Agent } from "@atproto/api";
import type { OAuthSession } from "@atproto/oauth-client";
import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

export const Login = () => {
    const [atprotoHandle, setAtprotoHandle] = useState("");
    const [oAuth, setOAuth] = useOAuth();
    const setSession = (session: OAuthSession) => {
        if (setOAuth) setOAuth({ ...oAuth, session });
    };
    const setAgent = (agent: Agent) => {
        if (setOAuth) setOAuth({ ...oAuth, agent });
    };
    const handlePress = async () => {
        const req = new Request(
            `https://dns.google/resolve?name=_atproto.${atprotoHandle}&type=TXT`,
        );
        const result = await fetch(req);
        const jsonData = (await result.json()) as {
            Answer: { name: string; data: string }[];
        };
        let did = jsonData.Answer[0].data;
        if (did.startsWith("did=")) did = did.slice(4, did.length);
        const session = await oAuthClient.signIn(did);
        setSession(session);
        const newAgent = new Agent(session);
        setAgent(newAgent);
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
