/**
 * Next.js Route Handler 互換の雛形。
 * このリポジトリでは実運用を `server.js` の `/api/line/webhook` で実装している。
 */
export async function POST(): Promise<Response> {
  return Response.json(
    {
      ok: false,
      message:
        "LINE Webhook is handled by Express endpoint: /api/line/webhook",
    },
    { status: 501 }
  );
}
