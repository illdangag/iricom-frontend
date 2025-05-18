const removeImports = require('next-remove-imports')();
const localConfig = require('./config/local.next.config');
const preProductionConfig = require('./config/pre-production.next.config');
const process = require('process');

module.exports = (phase) => {
  let env;

  switch (process.env.NEXT_PUBLIC_RUN_MODE) {
    case 'local':
      env = localConfig.env;
      break;
    case 'pre-production':
      env = preProductionConfig.env;
      break;
  }

  console.log('mode: ', process.env.NEXT_PUBLIC_RUN_MODE);
  console.log('config env:', env);

  return removeImports({
    env: env,
    eslint: {
      ignoreDuringBuilds: true,
    },
    rewrites() {
      return [
        {
          source: '/file/:fileId',
          destination: env.backend.host + '/v1/file/:fileId/',
        }
      ];
    },
  });
};
