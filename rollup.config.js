import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import pkg from './package.json';

const input = 'lib/index.js';
const externalPackages = Object.keys(Object.assign({}, pkg.dependencies, pkg.peerDependencies));

const browserBuildPlugins = [
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
        external: externalPackages,
        output: {
            name: 'eusiBrowser',
            file: pkg.browser,
            format: 'umd',
            globals: {
                'eusi-sdk-core': 'eusiCore'
            }
        }

    },

    {
        input,
        plugins: browserBuildPlugins.concat(uglify()),
        external: externalPackages,
        output: {
            file: 'dist/browser/eusi-sdk-browser.min.js',
            format: 'umd',
            name: 'eusiBrowserMin',
            globals: {
                'eusi-sdk-core': 'eusiCore'
            }
        }
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    // (We could have three entries in the configuration array
    // instead of two, but it's quicker to generate multiple
    // builds from a single configuration where possible, using
    // the `targets` option which can specify `dest` and `format`)
    {
        input,
        external: externalPackages,
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
