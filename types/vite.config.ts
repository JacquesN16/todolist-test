import { defineConfig } from 'vite'
// @ts-ignore
import path from 'node:path'
import dts from 'vite-plugin-dts'

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'todolist-model',
            formats: ['es', 'umd'],
            fileName: (format) => `todolist-model.${format}.js`,
        },
    },
    // @ts-ignore
    plugins: [dts()],
})