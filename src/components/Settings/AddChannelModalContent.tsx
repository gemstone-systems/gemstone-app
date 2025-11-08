import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import { useFacet } from "@/lib/facet";
import { lighten } from "@/lib/facet/src/lib/colors";
import type { ComAtprotoRepoStrongRef } from "@/lib/types/atproto";
import {
    useOAuthAgentGuaranteed,
    useOAuthSessionGuaranteed,
} from "@/providers/OAuthProvider";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { useChannelsQuery } from "@/queries/hooks/useChannelsQuery";
import { useLatticesQuery } from "@/queries/hooks/useLatticesQuery";
import { useShardsQuery } from "@/queries/hooks/useShardsQuery";
import { Picker } from "@react-native-picker/picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

export const AddChannelModalContent = ({
    setShowAddModal,
}: {
    setShowAddModal: Dispatch<SetStateAction<boolean>>;
}) => {
    const { semantic } = useCurrentPalette();
    const { atoms, typography } = useFacet();
    const [name, setName] = useState("");
    const [topic, setTopic] = useState("");
    const [mutationError, setMutationError] = useState<string | undefined>(
        undefined,
    );

    const agent = useOAuthAgentGuaranteed();
    const session = useOAuthSessionGuaranteed();
    const queryClient = useQueryClient();
    const { useQuery: useLatticesQueryActual } = useLatticesQuery(session);
    const { useQuery: useShardsQueryActual } = useShardsQuery(session);
    const { queryKey: channelsQueryKey } = useChannelsQuery(session);

    const { data: lattices, isLoading: latticesLoading } =
        useLatticesQueryActual();
    const { data: shards, isLoading: shardsLoading } = useShardsQueryActual();

    const { mutate: newChannelMutation, isPending: mutationPending } =
        useMutation({
            mutationFn: async () => {
                // const registerResult = await registerNewChannel({
                //     channelDomain: inputText,
                //     agent,
                // });
                // if (!registerResult.ok) {
                //     console.error(
                //         "Something went wrong when registering the channel.",
                //         registerResult.error,
                //     );
                //     throw new Error(
                //         `Something went wrong when registering the channel. ${registerResult.error}`,
                //     );
                // }
                // setShowAddModal(false);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: channelsQueryKey,
                });
                setShowAddModal(false);
            },
            onError: (err) => {
                console.error(
                    "Something went wrong when registering the channel.",
                    err,
                );
                setMutationError(err.message);
            },
        });

    const selectableShards = shards
        ? shards.map((shard) => ({
              domain: shard.uri.rKey,
              ref: {
                  cid: shard.cid,
                  uri: shard.uriStr,
              },
          }))
        : [];
    const selectableLattices = lattices
        ? lattices.map((lattice) => ({
              domain: lattice.uri.rKey,
              ref: {
                  cid: lattice.cid,
                  uri: lattice.uriStr,
              },
          }))
        : [];

    const [selectedShard, setSelectedShard] = useState<
        Omit<ComAtprotoRepoStrongRef, "$type">
    >(selectableShards[0].ref);
    const [selectedLattice, setSelectedLattice] = useState<
        Omit<ComAtprotoRepoStrongRef, "$type">
    >(selectableLattices[0].ref);

    const isLoading = latticesLoading && shardsLoading;
    console.log({
        selectedShard: JSON.stringify(selectedShard),
        selectedLattice: JSON.stringify(selectedLattice),
        name: name.trim(),
    });

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- must explicitly check because we are deriving from an array.
    const readyToSubmit = !!(selectedShard && selectedLattice && name.trim());

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
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <View style={{ gap: 4 }}>
                        <Text>Name:</Text>
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
                                    minWidth: 256,
                                },
                                typography.weights.byName.extralight,
                                typography.sizes.sm,
                            ]}
                            value={name}
                            onChangeText={(newName) => {
                                const coerced = newName
                                    .toLowerCase()
                                    .replace(" ", "-");
                                setName(coerced);
                            }}
                            placeholder="general"
                            placeholderTextColor={semantic.textPlaceholder}
                        />
                    </View>
                    <View style={{ gap: 4 }}>
                        <Text>(optional) Topic:</Text>
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
                                    minWidth: 256,
                                },
                                typography.weights.byName.extralight,
                                typography.sizes.sm,
                            ]}
                            value={topic}
                            onChangeText={setTopic}
                            placeholder="General discussion channel"
                            placeholderTextColor={semantic.textPlaceholder}
                        />
                    </View>
                    <View style={{ gap: 4 }}>
                        <Text>Shard (store at):</Text>
                        {/* TODO: for native, we want to render this with a bottom sheet instead*/}
                        <SelectShard
                            shards={
                                shards
                                    ? shards.map((shard) => ({
                                          domain: shard.uri.rKey,
                                          ref: {
                                              cid: shard.cid,
                                              uri: shard.uriStr,
                                              $type: "com.atproto.repo.strongRef",
                                          },
                                      }))
                                    : []
                            }
                            setSelectedShard={setSelectedShard}
                        />
                    </View>
                    <View style={{ gap: 4 }}>
                        <Text>Lattice (route through):</Text>
                        {/* TODO: for native, we want to render this with a bottom sheet instead*/}
                        <SelectLattices
                            lattices={
                                lattices
                                    ? lattices.map((lattice) => ({
                                          domain: lattice.uri.rKey,
                                          ref: {
                                              cid: lattice.cid,
                                              uri: lattice.uriStr,
                                              $type: "com.atproto.repo.strongRef",
                                          },
                                      }))
                                    : []
                            }
                            setSelectedLattice={setSelectedLattice}
                        />
                    </View>
                    <Pressable
                        disabled={!readyToSubmit}
                        onPress={() => {
                            newChannelMutation();
                        }}
                    >
                        {({ hovered }) =>
                            mutationPending ? (
                                <Loading size="small" />
                            ) : (
                                <View
                                    style={{
                                        backgroundColor: readyToSubmit
                                            ? hovered
                                                ? lighten(semantic.primary, 7)
                                                : semantic.primary
                                            : semantic.textPlaceholder,
                                        borderRadius: atoms.radii.lg,
                                        alignItems: "center",
                                        paddingVertical: 10,
                                    }}
                                >
                                    <Text
                                        style={[
                                            typography.weights.byName.normal,
                                            { color: semantic.textInverse },
                                        ]}
                                    >
                                        Add
                                    </Text>
                                </View>
                            )
                        }
                    </Pressable>
                </>
            )}
        </View>
    );
};

const SelectShard = ({
    shards,
    setSelectedShard,
}: {
    shards: Array<{
        domain: string;
        ref: ComAtprotoRepoStrongRef;
    }>;
    setSelectedShard: Dispatch<SetStateAction<ComAtprotoRepoStrongRef>>;
}) => {
    return (
        <Picker
            onValueChange={(_, idx) => {
                setSelectedShard(shards[idx].ref);
            }}
        >
            {shards.map((shard) => (
                <Picker.Item label={shard.domain} key={shard.domain} />
            ))}
        </Picker>
    );
};

const SelectLattices = ({
    lattices,
    setSelectedLattice,
}: {
    lattices: Array<{
        domain: string;
        ref: ComAtprotoRepoStrongRef;
    }>;
    setSelectedLattice: Dispatch<SetStateAction<ComAtprotoRepoStrongRef>>;
}) => {
    return (
        <Picker
            onValueChange={(_, idx) => {
                setSelectedLattice(lattices[idx].ref);
            }}
        >
            {lattices.map((lattice) => (
                <Picker.Item label={lattice.domain} key={lattice.domain} />
            ))}
        </Picker>
    );
};
