import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const HASH_PREFIX = "scrypt";
const HASH_KEY_LENGTH = 64;

function safeCompare(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, HASH_KEY_LENGTH).toString("hex");
  return `${HASH_PREFIX}$${salt}$${hash}`;
}

export function isPasswordHash(value: string): boolean {
  return value.startsWith(`${HASH_PREFIX}$`);
}

export function verifyPassword(
  password: string,
  storedPassword: string | null | undefined,
): boolean {
  if (!storedPassword) {
    return false;
  }

  if (!isPasswordHash(storedPassword)) {
    return safeCompare(password, storedPassword);
  }

  const [, salt, storedHash] = storedPassword.split("$");
  if (!salt || !storedHash) {
    return false;
  }

  const derivedHash = scryptSync(password, salt, HASH_KEY_LENGTH).toString(
    "hex",
  );

  const left = Buffer.from(derivedHash, "hex");
  const right = Buffer.from(storedHash, "hex");

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}
