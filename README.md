# @treecombinator/sdk-server-settings

---

> Developed by Danthur Lice.\
> Copyright © 2026 Tree Combinator.\
> Contact: dev (at) treecombinator.com

---

The **settings** domain of the Tree Combinator SDK — a small scoped key/value preferences and config store on Cloudflare D1, shipped with its own schema and zero runtime dependencies. The `scope` namespaces values, so the same store holds per-user preferences (`"user:123"`) and app-wide config or feature flags (`"app"`).

## Install

```bash
npm install github:treecombinator/sdk-server-settings
```

## Use

```ts
import { createSettings, SETTINGS_SCHEMA } from "@treecombinator/sdk-server-settings";

// run SETTINGS_SCHEMA once as a D1 migration, then:
const settings = createSettings({ db: env.DB });

await settings.set("user:123", "theme", "dark");
const theme = await settings.get<string>("user:123", "theme"); // "dark"
const prefs = await settings.all("user:123");                  // { theme: "dark", ... }
await settings.remove("user:123", "theme");
```

`createSettings(config)` returns the settings API:

- `get<T>(scope, key)` — the stored value parsed from JSON, or `null` if absent.
- `set(scope, key, value)` — upsert any JSON-serializable value.
- `all(scope)` — every key/value in a scope as a plain object.
- `remove(scope, key)` — delete one key.

Config: `{ db, table? }` — `db` is the D1 binding; `table` overrides the table name (default `"settings"`). The package also exports the `SETTINGS_SCHEMA` DDL.

## Notes

- Values are stored as JSON, so any serializable type round-trips; `get` returns `null` for a missing key.
- `scope` is an opaque namespace string — use it to separate per-user state from app-wide config.
- The package never throws on a missing key and has no runtime dependencies.
