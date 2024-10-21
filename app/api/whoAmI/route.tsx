import { NextRequest, NextResponse } from "next/server";

interface currentUserType {
    payload: {
        id: string;
        name: string;
        userName: string;
        email: string;
        avatar_url: any;
    };
}
export async function GET(request: NextRequest) {
    const currentUserHeader: any = request.headers.get("current_user");
    try {
        return Response.json(
            { userInformation: JSON.parse(currentUserHeader) },
            { status: 200 },
        );
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}
