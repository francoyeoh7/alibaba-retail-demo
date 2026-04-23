import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
export default defineConfig(function () {
    var _a, _b, _c, _d;
    var environment = (_b = (_a = globalThis.process) === null || _a === void 0 ? void 0 : _a.env) !== null && _b !== void 0 ? _b : {};
    var isGitHubPages = environment.GITHUB_PAGES === "true";
    var repositoryName = (_d = (_c = environment.GITHUB_REPOSITORY) === null || _c === void 0 ? void 0 : _c.split("/")[1]) !== null && _d !== void 0 ? _d : "alibaba-retail-demo";
    return {
        base: isGitHubPages ? "/".concat(repositoryName, "/") : "/",
        plugins: [react()],
        test: {
            environment: "jsdom",
            setupFiles: "./src/setupTests.ts",
            css: true,
        },
    };
});
