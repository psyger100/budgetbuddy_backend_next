import * as jose from "jose";
export const generateAccessToken = async (user_information: any) => {
    try {
        return await new jose.SignJWT({ ...user_information })
            .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRY as string)
            .setProtectedHeader({ alg: "HS256" })
            .sign(new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET as string));
    } catch (error: any) {}
};

export const generateRefreshToken = async (user_information: any) => {
    try {
        const refreshToken = await new jose.SignJWT({ ...user_information })
            .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRY as string)
            .setProtectedHeader({ alg: "HS256" })
            .sign(new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET as string));

        return refreshToken;
    } catch (error: any) {
        console.log(error.message);
    }
};
