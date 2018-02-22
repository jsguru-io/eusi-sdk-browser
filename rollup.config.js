import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import pkg from './package.json';

const input = 'lib/index.js';

const browserBuildPlugins = [
    resolve({
        customResolveOptions: {
            moduleDirectory: 'node_modules'
        }
    }),
    commonjs(),
    babel({
        exclude: ['node_modules/**'],
        plugins: ['external-helpers']
    }),
];

export default [
    // browser-friendly UMD build
    {
        input,
        plugins: browserBuildPlugins,
        output: {
            name: 'eusiBrowser',
            file: pkg.browser,
            format: 'umd',
        }

    },

    {
        input,
        plugins: browserBuildPlugins.concat(uglify()),
        output: {
            file: 'dist/browser/eusi-browser.min.js',
            format: 'umd',
            name: 'eusiBrowserMin'
        }
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    // (We could have three entries in the configuration array
    // instead of two, but it's quicker to generate multiple
    // builds from a single configuration where possible, using
    // the `targets` option which can specify `dest` and `format`)
    {
        input,
        external: Object.keys(pkg.dependencies || {}),
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' }
        ],
        plugins: [
            babel({
                exclude: ['node_modules/**']
            })
        ]
    }
];
