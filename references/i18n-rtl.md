# Localization: EN, FR, AR with French fallback

## Precise locale algorithm

**Supported:** `en`, `fr`, `ar`. **Default/fallback:** `fr`. On first launch read the device's **primary** locale with `getLocales()[0]` from `expo-localization`. Normalize its language code case-insensitively; `en-US -> en`, `fr-MA -> fr`, `ar-MA -> ar`. If the primary language is unsupported, choose `fr` **even if a secondary OS language is supported**. User explicit in-app choice wins over device detection and is persisted in non-secret storage. Provide a "Use device language" option to clear override. Missing keys always resolve to French.

Use `i18next` + `react-i18next`; use JSON namespaces and shared type-safe keys where useful. Initialize before rendering text. Put *all* visible strings, error messages, field placeholders, accessibility labels, dates and notices behind localization. Never concatenate sentences from translated fragments. Test interpolation, pluralization, currency and number formatting with `Intl` and an explicit locale.

`blueprints/src/core/i18n/locale.ts` includes an isolated, testable resolver; `i18n.ts` demonstrates initialization. Adapt rather than blindly copy. Install and configure:

```sh
npx expo install expo-localization @react-native-async-storage/async-storage
npm install i18next react-i18next
```

Expo app config (merge with existing plugins; don't replace them):

```json
{
  "expo": {
    "userInterfaceStyle": "automatic",
    "plugins": [
      ["expo-localization", { "supportedLocales": ["en", "fr", "ar"], "supportsRTL": true }]
    ]
  }
}
```

iOS may require app locale support declarations for Arabic RTL with device settings. Confirm SDK-specific behavior in https://docs.expo.dev/guides/localization/ . Android may change device locale while the app is foregrounded or resumed: recheck on `AppState` active if user language preference is `system`. iOS generally restarts app when per-app language changes.

## RTL is a native layout concern, not just text alignment

- Arabic affects layout direction, row/stack order, back arrows, horizontal gestures, tab alignment, charts and typography. Prefer `start`/`end` semantics and tested mirrored icon behavior.
- For OS-selected Arabic, the Expo localization plugin + `I18nManager` may handle native RTL automatically on supported SDKs. **Crucial edge case:** an unsupported *RTL* device language (for example Hebrew) still resolves to French, so the app must reconcile native layout to **LTR**, not leave an RTL OS-driven layout under French text. For **user-selected Arabic while OS is LTR**, switching JS translations does **not** guarantee native RTL layout. Use `I18nManager.allowRTL`, `I18nManager.forceRTL` and a controlled app reload/restart where supported. Plan for Expo Go limitations and `expo-updates` availability; don't promise live instant direction flip.
- If runtime direction flip requires reload, present a localized restart explanation, persist the override first, and test it in a development or production build on iOS/Android. Avoid endless reload loops: compare desired RTL with current direction and record pending state.
- Web should set `<html dir>` through its web-specific entry or document integration as needed; text `lang` attributes and RTL UI behavior require web-specific checks. Don't force native RTL APIs on web.
- Use Arabic-capable font fallback and check diacritical marks, number formatting, long labels, mixed Arabic/Latin URLs and bidirectional punctuation.

## Required test matrix

| OS primary | Override | Expected text | Direction |
| --- | --- | --- | --- |
| en-US | none | English | LTR |
| fr-MA | none | French | LTR |
| ar-MA | none | Arabic | RTL |
| de-DE | none | French | LTR |
| de-DE, en secondary | none | French | LTR |
| he-IL (unsupported RTL) | none | French | LTR after supported native direction transition |
| en-US | ar | Arabic | RTL after supported native direction transition |
| ar-MA | fr | French | LTR after supported native direction transition |

Test changing language, app background/resume, cold start, missing translation, user preference clearing, RTL screens, native stack navigation gestures and screen readers. Release requires all three locales checked on real iOS and Android builds.
