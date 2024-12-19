import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, UserConfigFnObject } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "demo") {
    return {
      build: {
        rollupOptions: {
          input: {
            "index.html": "index.html",
            "demo/index.tsx": "demo/index.tsx",
            "index.ts": "src/index.ts",
          },
        },
      },
      base: "/cellpop/",
    };
  }
  return {
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        name: "cellpop",
        fileName: (format) => `index.${format}.js`,
      },
      rollupOptions: {
        external: ["react", "react-dom"],
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
        },
      },
    },
    base: "/cellpop/",
  };
}) satisfies UserConfigFnObject;
