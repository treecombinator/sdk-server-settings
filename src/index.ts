import type { Settings } from "./port";
import { createD1Settings, type D1SettingsConfig } from "./adapters/d1";

export type { Settings } from "./port";
export type { D1SettingsConfig } from "./adapters/d1";
export { settingsSchema } from "./adapters/d1";

/** Settings domain factory. Primary adapter: Cloudflare D1. */
export function createSettings(config: D1SettingsConfig): Settings {
  return createD1Settings(config);
}
