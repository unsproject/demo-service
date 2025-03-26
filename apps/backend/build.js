import esbuild from 'esbuild';

esbuild.build({
	entryPoints: ['./src/index.ts'],
	bundle: true,
	minify: true,
	outfile: '../../dist/index.js',
	platform: 'node'
});
