let config = 'default';
if (process.argv[3]!==undefined) {
  config = process.argv[3];
};
module.exports = config;