const removeImports = require('next-remove-imports')();
const localConfig = require('./config/local.next.config');
const preProductionConfig = require('./config/pre-production.next.config');

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

  console.log('config env:', env);

  return removeImports({
    env: env,
    eslint: {
      ignoreDuringBuilds: true,
    },
  });
};
