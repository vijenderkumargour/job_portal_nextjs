import { cookies, headers } from "next/headers";
import crypto from "crypto";
import { getIPAddress } from "./location";
import db from "@/config/db";
import { sessions } from "@/drizzle/schema";
import { SESSION_LIFETIME } from "@/config/constant";

type CreateSessionData = {
  token: string;
  userId: number;
  userAgent: string;
  ip: string;
};

const generateSessionTokenId = () => {
  return crypto.randomBytes(32).toString("hex");
};
// generates a 256-bit cryptographically secure token
// <Buffer 4f 8a 9b 12 ... > (raw binary, not readable)
// Converts that binary data into a hexadecimal string.("4f8a9b12d1e9a8c3f5...")
// This ensures the string is in a consistent Unicode normalization form (usually NFC).

const createUserSession = async ({
  token,
  userId,
  userAgent,
  ip,
}: CreateSessionData) => {
  const hashedToken = crypto.createHash("sha-256").update(token).digest("hex");

  const [result] = await db.insert(sessions).values({
    id: hashedToken,
    userId,
    expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000),
    ip,
    userAgent,
  });

  return result;
};

export const createSessionAndSetCookies = async (userId: number) => {
  const token = generateSessionTokenId();
  const ip = await getIPAddress();
  console.log("IP Address:", ip);
  const headersList = headers();

  await createUserSession({
    token,
    userId: userId,
    userAgent: (await headersList).get("user-agent") || "",
    ip: ip,
  });
  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    secure: true,
    httpOnly: true,
    maxAge: SESSION_LIFETIME,
  });
};
