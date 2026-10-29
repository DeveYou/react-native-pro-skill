# Mobile security baseline and threat model

A mobile app is an untrusted client. Protect the backend and user data assuming the app bundle can be decompiled, traffic can be observed on compromised devices, and tokens can be stolen on compromised devices. Never imply absolute security.

## Authentication and sessions

- Prefer a maintained OAuth/OIDC provider; Authorization Code **with PKCE** via system browser for public mobile clients; validate redirect schemes, OAuth `state` and nonce where applicable. Avoid embedded webviews for credentials.
- Server enforces authorization on **every** protected request, including per-object access. Keep access tokens short-lived and in memory where practical. Store small refresh/session credential in `expo-secure-store` only when the product requires persistence. Rotate/revoke refresh tokens and handle concurrent 401 refresh with a single-flight strategy and retry limit.
- Logout clears secure credentials, user-specific query caches, non-sensitive user state and any downloaded private files; cancel in-flight requests. Avoid user A's cache being shown to user B after account switch.
- Never save tokens in AsyncStorage, Zustand persist backed by AsyncStorage, URL params, exception text or analytics/crash reports.
- Biometric gates are defense-in-depth for UI access. Account security and backend authorization cannot depend solely on device biometrics.

## Transport and APIs

- Enforce HTTPS and platform transport security. Allow local HTTP only for constrained development with explicit config; never ship permissive wildcard transport settings.
- Use Axios with timeouts, `AbortSignal`, request IDs/correlation IDs without PII, standardized safe errors; no default retry on non-idempotent requests.
- Validate DTOs and environmental config with Zod. Treat deep-link params, notifications, files, QR codes, downloaded content and cached data as untrusted input.
- Restrict external domains and deep-link schemes, avoid unvalidated `Linking.openURL`, URL injection, insecure file operations, path traversal and dangerous HTML/Markdown rendering.
- Backend rate limits, input validation, output encoding, anti-abuse, authorization and audit controls are mandatory; client validation is UX only, not a trust boundary.

## Secrets and storage

- `process.env.EXPO_PUBLIC_*` values are baked into the client and **visible to users**. Only expose non-secret flags and public endpoint URLs. Signing credentials, API private keys, admin tokens and service account secrets must remain on a backend or protected build infrastructure and never be embedded in app code.
- Use `expo-secure-store` for small secrets. Understand platform behavior: Android values disappear on uninstall; iOS keychain may survive uninstall; biometric changes can invalidate protected values. If backup is customized on Android, explicitly exclude SecureStore data.
- Use AsyncStorage for safe preferences (language, appearance), never sensitive personal records by default. Encrypt sensitive offline databases with reviewed key lifecycle and appropriate access controls where offline storage is truly required.
- Minimize collection; protect logs, screenshots, notifications, app switcher previews and clipboard for sensitive screens as applicable. Configure retention and user deletion with backend support.

## Supply chain and build/update

- Commit lockfiles, monitor advisories, audit dependencies and review transitive native dependencies. No unexplained `--force`, `--legacy-peer-deps`, or ignoring npm audit as a substitute for fixing risk.
- Apply least-privilege iOS entitlements and Android permissions. Verify store privacy disclosures and permissions purpose strings.
- EAS build/update secrets in protected CI/project controls; review who may publish updates. Verify update runtime compatibility, channels/branches, signed updates where supported, rollback and staged rollout; ensure OTA cannot install incompatible native modules.
- Use unique package identifiers per environment where necessary. Test release builds, not only Expo Go. Add error telemetry with redaction, consent and defined retention.
- Require threat modeling and security review for payments, children, regulated data, healthcare, identity, geolocation, messaging, financial or other high-risk apps. Adapt regional compliance obligations.

## Review checklist

[ ] No secret embedded in client, env, repo, logs or source maps
[ ] Backend performs identity/object authorization and rate limiting
[ ] Sensitive credentials stored and deleted appropriately
[ ] Safe redirect/deep-link and refresh-token lifecycle
[ ] HTTPS, permissions, backup, logs, file handling and telemetry reviewed
[ ] Zod validates untrusted boundaries; adversarial cases tested
[ ] Dependencies and native configuration audited
[ ] EAS credentials/roles, update channels, runtime versions and release gates verified

Docs: https://docs.expo.dev/versions/latest/sdk/securestore/ ; https://docs.expo.dev/guides/environment-variables/ ; https://docs.expo.dev/eas/environment-variables/ ; https://owasp.org/www-project-mobile-app-security/
