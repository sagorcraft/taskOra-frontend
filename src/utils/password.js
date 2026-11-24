const encoder = new TextEncoder();
const toHex = buffer => [...new Uint8Array(buffer)].map(byte => byte.toString(16).padStart(2, "0")).join("");

export const createSalt = () => toHex(crypto.getRandomValues(new Uint8Array(16)));

// PBKDF2 keeps the demo from storing plain-text passwords. A real backend must still do this server-side.
export async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: encoder.encode(salt), iterations: 100000, hash: "SHA-256" },
    key,
    256
  );
  return toHex(bits);
}

export async function verifyPassword(password, salt, expectedHash) {
  return (await hashPassword(password, salt)) === expectedHash;
}
