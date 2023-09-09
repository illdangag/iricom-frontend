const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const removeImports = require('next-remove-imports')();
const localConfig = require('./config/local.next.config');
const preProductionConfig = require('./config/pre-production.next.config');

console.log('NEXT_PUBLIC_RUN_MODE:', process.env.NEXT_PUBLIC_RUN_MODE);

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

  return removeImports({
    env: env,
    eslint: {
      ignoreDuringBuilds: true,
    },
  });
};
