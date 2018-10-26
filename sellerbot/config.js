const fs = require('fs'); 
import config from './config.name';

if (fs.existsSync('./configs/'+config+'.js')) {
  const config_data = require('./configs/'+config+'.js');
  module.exports = config_data;
} else {
  console.error("Configuration "+config+" not found");
  module.exports = false;
}