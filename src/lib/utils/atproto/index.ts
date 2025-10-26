import type { AtUri} from "@/lib/types/atproto";
import { atUriAuthoritySchema, nsidSchema } from "@/lib/types/atproto";
import type { Result } from "@/lib/utils/result";
import { z } from "zod";

// thank u julie
export const atUriRegexp =
    /^at:\/\/([a-zA-Z0-9._:%-]+)(?:\/([a-zA-Z0-9-.]+)(?:\/([a-zA-Z0-9._~:@!$&%')(*+,;=-]+))?)?(?:#(\/[a-zA-Z0-9._~:@!$&%')(*+,;=\-[\]/\\]*))?$/;

export const atUriToString = ({ authority, collection, rKey }: AtUri) => {
    let result = `at://${authority}`;
    result += collection ? `/${collection}` : "";
    result += rKey ? `/${rKey}` : "";
    return result;
};

export const stringToAtUri = (str: string): Result<AtUri, unknown> => {
    const isValidAtUri = atUriRegexp.test(str);
    if (!isValidAtUri)
        return {
            ok: false,
            error: { message: "Input string was not a valid at:// URI" },
        };

    const fragments = str.split("/");
    if (fragments.length <= 2)
        return {
            ok: false,
            error: { message: "Input string was not a valid at:// URI." },
        };

    const {
        success: authorityParseSuccess,
        error: authorityParseError,
        data: authorityParsed,
    } = atUriAuthoritySchema.safeParse(fragments[2]);
    if (!authorityParseSuccess)
        return {
            ok: false,
            error: {
                message:
                    "Input at:// URI was a valid shape, but somehow could not parse the first fragment as a valid authority.",
                details: z.treeifyError(authorityParseError),
            },
        };

    const {
        success: nsidParseSuccess,
        error: nsidParseError,
        data: nsidParsed,
    } = nsidSchema.safeParse(fragments[3]);
    if (fragments[3] && !nsidParseSuccess)
        return {
            ok: false,
            error: {
                message:
                    "Input at:// URI was a valid shape and had a second fragment, but was somehow not a valid NSID.",
                details: z.treeifyError(nsidParseError),
            },
        };

    return {
        ok: true,
        data: {
            authority: authorityParsed,
            collection: nsidParsed,
            rKey: fragments[4],
        },
    };
};
