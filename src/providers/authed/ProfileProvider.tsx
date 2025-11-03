import type { Did } from "@/lib/types/atproto";
import { useOAuthSessionGuaranteed } from "@/providers/OAuthProvider";
import { getBskyProfile } from "@/queries/get-profile";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

interface ProfileContextValue {
    did: Did;
    profile:
        | {
              avatar?: `${string}:${string}`;
              displayName?: string;
              handle: string;
          }
        | undefined;
    isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export const useProfile = () => {
    const value = useContext(ProfileContext);
    if (!value)
        throw new Error(
            "Profile context was null. Did you try to access this outside of the authed providers? ProfileProvider must be below OAuthProvider.",
        );
    return value;
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const oAuthSession = useOAuthSessionGuaranteed();
    const { did } = oAuthSession;

    const { data: profile, isLoading } = useQuery({
        queryKey: [did],
        queryFn: async () => {
            return await getBskyProfile(did);
        },
    });

    const value: ProfileContextValue = {
        did,
        profile: {
            avatar: profile?.avatar,
            displayName: profile?.displayName,
            handle: profile?.handle ?? "",
        },
        isLoading,
    };

    return <ProfileContext value={value}>{children}</ProfileContext>;
};
