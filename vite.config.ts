import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig(() => {
  const environment =
    (
      globalThis as typeof globalThis & {
        process?: { env?: Record<string, string | undefined> };
      }
    ).process?.env ?? {};
  const isGitHubPages = environment.GITHUB_PAGES === "true";
  const repositoryName = environment.GITHUB_REPOSITORY?.split("/")[1] ?? "alibaba-retail-demo";

  return {
    base: isGitHubPages ? `/${repositoryName}/` : "/",
    plugins: [react()],
    test: {
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      css: true,
    },
  };
});
