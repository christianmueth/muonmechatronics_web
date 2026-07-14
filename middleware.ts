import { NextRequest, NextResponse } from "next/server";

function withTraceHeaders(request: NextRequest) {
  const traceId = request.headers.get("x-quickstud-trace") || globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;

  // Propagate trace id to downstream handlers and back to the client.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-quickstud-trace", traceId);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set("x-quickstud-trace", traceId);

  return response;
}

export default function middleware(request: NextRequest) {
  return withTraceHeaders(request);
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api)(.*)"]
};
