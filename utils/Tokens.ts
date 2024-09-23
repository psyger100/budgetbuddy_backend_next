import * as jose from "jose";
interface UserType {
    id?: string;
    email?: string;
    username?: string;
    name?: string;
    password?: string;
    refreshToken?: string | null;
}
export const generateAccessToken = async (user_information: UserType) => {
    try {
        return await new jose.SignJWT({ ...user_information })
            .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRY as string)
            .setProtectedHeader({ alg: "HS256" })
            .sign(new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET as string));
    } catch (error) {}
};

export const generateRefreshToken = async (user_information: UserType) => {
    try {
        const refreshToken = await new jose.SignJWT({ ...user_information })
            .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRY as string)
            .setProtectedHeader({ alg: "HS256" })
            .sign(new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET as string));

        return refreshToken;
    } catch (error) {}
};
