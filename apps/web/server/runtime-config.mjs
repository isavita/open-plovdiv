export function resolveTlsPaths(environment = process.env) {
  const certPath = environment.SERVER_CERT_PATH?.trim() || "";
  const keyPath = environment.SERVER_KEY_PATH?.trim() || "";

  if (Boolean(certPath) !== Boolean(keyPath)) {
    throw new Error("SERVER_CERT_PATH and SERVER_KEY_PATH must be configured together");
  }

  return certPath ? { certPath, keyPath } : null;
}
