import { defineConfig } from 'vite'
import glsl from "vite-plugin-glsl";

export default defineConfig({
    root: 'src',
    publicDir: '../public',
    build:
    {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                manualChunks: false,
                inlineDynamicImports: true,
                entryFileNames: "[name].js",
                assetFileNames: "[name].[ext]"
            }
        },
        sourcemap: true
    },
    plugins: [glsl()]
})
