import ts from '@rollup/plugin-typescript'

export default {
  input: {
    dom: 'src/dom.ts',
    content: 'src/content.ts',
    service: 'src/service.ts',
    'extension-dom': 'src/extension-dom.ts'
  },
  output: {
    dir: '.',
    format: 'es'
  },
  plugins: [ts()]
};