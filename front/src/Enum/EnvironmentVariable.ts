import { getEnvConfig } from "@geprog/vite-plugin-env-config/getEnvConfig";

export const DEBUG_MODE: boolean = getEnvConfig("DEBUG_MODE") == "true" || false;

export const API_URL = getEnvConfig("API_URL");
export const NODE_ENV = getEnvConfig("NODE_ENV") || "development";
export const POSTHOG_API_KEY: string = (getEnvConfig("POSTHOG_API_KEY") as string) || "";
export const POSTHOG_URL = getEnvConfig("POSTHOG_URL") || undefined;
