import { describe, expect, it } from "vitest";
import { resolveTlsPaths } from "./runtime-config.mjs";

describe("resolveTlsPaths", () => {
  it("uses HTTP when neither TLS path is configured", () => {
    expect(resolveTlsPaths({})).toBeNull();
    expect(resolveTlsPaths({ SERVER_CERT_PATH: " ", SERVER_KEY_PATH: "" })).toBeNull();
  });

  it("returns trimmed paths when both TLS files are configured", () => {
    expect(
      resolveTlsPaths({
        SERVER_CERT_PATH: " /run/secrets/server.crt ",
        SERVER_KEY_PATH: " /run/secrets/server.key "
      })
    ).toEqual({
      certPath: "/run/secrets/server.crt",
      keyPath: "/run/secrets/server.key"
    });
  });

  it.each([
    [{ SERVER_CERT_PATH: "/run/secrets/server.crt" }, "certificate only"],
    [{ SERVER_KEY_PATH: "/run/secrets/server.key" }, "key only"],
    [{ SERVER_CERT_PATH: " ", SERVER_KEY_PATH: "/run/secrets/server.key" }, "blank certificate"]
  ])("rejects partial TLS configuration: %s (%s)", (environment) => {
    expect(() => resolveTlsPaths(environment)).toThrow(
      "SERVER_CERT_PATH and SERVER_KEY_PATH must be configured together"
    );
  });
});
