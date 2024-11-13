import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        const file = formData.get("file"); // replace 'file' with your key

        if (file && file instanceof Blob) {
            const buffer = Buffer.from(await file.arrayBuffer());
            // Process `buffer` as needed

            return NextResponse.json({ message: "File received successfully" });
        }

        return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
        return NextResponse.json({ error: "Failed to process upload" }, { status: 500 });
    }
};
