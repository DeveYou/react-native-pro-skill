# UX/UI and visual system

## Decision precedence

1. Explicit product and accessibility requirements.
2. User-supplied screenshots, prototypes, Figma specs or component references (follow their style and UX intent, do not invent hidden states).
3. Existing app design system.
4. **Default: modern professional Minimalist** UI with quiet contrast, refined hierarchy and predictable motion.

## Token system

Maintain `src/core/theme/tokens.ts` and semantic aliases for both light and dark modes. Starting values are examples, never universal brand colors:

| Token | Default | Use |
| --- | --- | --- |
| Spacing | 4, 8, 12, 16, 24, 32, 48 | Consistent rhythm; avoid random gaps |
| Radius | 8, 12, 16, 24 | Cards, input, modal corners |
| Type roles | caption/body/label/title/display | Hierarchy without text-size chaos |
| Colors | canvas/surface/elevated/text/muted/border/primary/danger/success/focus | Define light and dark equivalents |
| Motion | 120–250ms for microinteractions | Respect reduced motion; avoid purposeless animations |
| Targets | aim for at least ~44×44pt iOS / 48×48dp Android | Icons, controls and row interactions |

Use system fonts or licensed bundled fonts with Arabic glyph coverage. Text may scale substantially; avoid fixed-height text containers and clipped labels. Honor reduced-motion, high-contrast and screen-reader preferences.

## Screenshot-to-code protocol

1. Inventory every visible screen and state. Record target platform, approximate device size, status/nav chrome, RTL/LTR, typography, spacing, components, color tokens, interactions and asset needs.
2. Create a reusable token and component mapping; detect repeated primitives (top bar, card, field, list row, tab, badge, empty state) before writing screens.
3. Implement layouts responsively with safe areas and keyboard. Preserve content hierarchy, avoid fake placeholder UI where interaction is specified.
4. Compare actual emulator/simulator captures side by side with originals, including dark and Arabic RTL; fix mismatches iteratively. Do not call it an exact match without evidence.
5. Ask only for missing information that blocks implementation; otherwise use well-supported defaults and note assumptions.

## Components and states

- Provide focus, pressed, disabled, loading, error, success and offline states.
- Use `Pressable` + accessibilityRole/Label/State for accessible controls. Do not replace a button with a naked touchable icon.
- Use `react-native-safe-area-context` once at root, consume insets at screen edges, and avoid double-padding with native navigation headers.
- Use `react-native-svg` / Lucide for crisp graphics; icons must be meaningful or hidden from accessibility APIs when decorative.
- Label form inputs; keyboard-safe forms; accessible validation messages; password visibility and input type appropriate to field.
- RTL: use start/end and logical alignment, mirror directional arrows and gestures only where semantic, keep email/URLs/serials readable LTR.
- Optimize lists with `FlatList`/virtualization; stable keys and tuned rendering; avoid wrapping large lists in plain ScrollViews.
- Prefer platform-native patterns for navigation, sheets, notifications, alerts, haptics and permissions.

## Review rubric

Judge hierarchy, consistency, accessibility, adaptive layouts, safe areas, dark-theme contrast, localization, RTL, discoverability, responsiveness, motion, touch ergonomics and error recovery. No screenshot-only facades or unimplemented interactive affordances.
