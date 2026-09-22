const UPSTREAM = "https://emis.zxs-is-very.cool/v1/chat/completions";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400, headers: CORS_HEADERS });
    }

    const upstreamResp = await fetch(UPSTREAM, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.EMIS_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    return new Response(upstreamResp.body, {
      status: upstreamResp.status,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": upstreamResp.headers.get("Content-Type") || "application/json",
      },
    });
  },
};
