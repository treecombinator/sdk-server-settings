# AGENTS.md — @treecombinator/sdk-server-settings

> Guide for AI agents. Settings domain of the Tree Combinator SDK for Cloudflare Workers. A scoped key/value store backed by D1. Run `SETTINGS_SCHEMA` once during setup/migration.

## Use

```ts
import { createSettings, SETTINGS_SCHEMA } from "@treecombinator/sdk-server-settings";

const settings = createSettings({ db: env.DB });
await settings.set("user:123", "theme", "dark");
const theme = await settings.get<string>("user:123", "theme");
```

`createSettings({ db, table? })` → `get<T>(scope, key)`, `set(scope, key, value)`, `all(scope)`,
`remove(scope, key)`. DDL: `SETTINGS_SCHEMA`. Adapter: Cloudflare D1.

## Notes

- `scope` namespaces values (`"user:123"` for per-user prefs, `"app"` for config / feature flags).
- Values are JSON-serialized; `get` returns `null` for a missing key.
- The package never throws and has no runtime dependencies.
