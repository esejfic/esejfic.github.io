// Try to export the private key for backup
let jwkPrivForBackup = null;
try {
  // Create a temporary exportable version to get the JWK
  const tempExportableKey = await crypto.subtle.importKey(
    "jwk",
    await crypto.subtle.exportKey("jwk", privateKey),
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits", "deriveKey"]
  );
  jwkPrivForBackup = await crypto.subtle.exportKey("jwk", tempExportableKey);
} catch (exportError) {
  console.warn("Could not export private key for backup:", exportError);
  // Key was stored as non-exportable, user will need to restore from backup
}

userKeys = {
  keyPair: { privateKey, publicKey },
  rawPublicKey: userData.publicKey,
  jwkPrivForBackup: jwkPrivForBackup
};