module.exports = function override(config, env) {
  config.resolve.fallback = {
    crypto: false,
    util: false,
    stream: false,
    ...config.resolve.fallback
  };
  return config;
};
