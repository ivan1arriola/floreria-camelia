import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                adminInstagram: resolve(__dirname, 'admin-instagram.html')
            }
        }
    },
    plugins: [
        {
            name: 'copy-legacy-scripts',
            closeBundle() {
                const source = resolve(__dirname, 'js');
                const destination = resolve(__dirname, 'dist/js');

                if (existsSync(source)) {
                    cpSync(source, destination, { recursive: true });
                }
            }
        }
    ]
});
