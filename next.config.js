const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const localConfig = require('./config/local.next.config');

module.exports = (phase) => {
  let env;
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    env = localConfig.env;
  }

  return {
    env: env,
    eslint: {
      ignoreDuringBuilds: true,
    },
  };
};