export async function GET() {
    const headers = new Headers({
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Allow specific methods
        "Access-Control-Allow-Headers": "Content-Type", // Allow specific headers
    });

    return Response.json("Hello world", { status: 200, headers });
}
