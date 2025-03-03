import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Validate HMAC signature for state integrity
export function validateHMAC(req: NextRequest) {
  const receivedSig = req.headers.get("x-hmac-signature");
  const rawBody = req.rawBody || "";
  const SECRET = process.env.HMAC_SECRET!;

  // Generate HMAC signature from request body
  const computedSig = crypto
    .createHmac("sha256", SECRET)
    .update(rawBody)
    .digest("hex");

  // Compare signatures in constant time
  const isValid = crypto.timingSafeEqual(
    Buffer.from(receivedSig || ""),
    Buffer.from(computedSig)
  );

  if (!isValid) {
    return new NextResponse("Invalid HMAC signature", { status: 401 });
  }
}
