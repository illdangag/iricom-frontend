const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const removeImports = require('next-remove-imports')();
const localConfig = require('./config/local.next.config');

module.exports = (phase) => {
  let env;
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    env = localConfig.env;
  } else {
    env = localConfig.env;
  }

  return removeImports({
    env: env,
    eslint: {
      ignoreDuringBuilds: true,
    },
  });
};
