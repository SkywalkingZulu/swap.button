const fs = require('fs'); 
let config = 'default';
if (process.argv[3]!==undefined) {
  config = process.argv[3];
};
if (fs.existsSync('./configs/'+config+'.js')) {
  const config_data = require('./configs/'+config+'.js');
  module.exports = config_data;
} else {
  console.error("Configuration "+config+" not found");
  module.exports = false;
}