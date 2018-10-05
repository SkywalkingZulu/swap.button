const consolebot = require('commander');
const worker = require('./app/worker');


consolebot
  .version('0.0.1')
  .description('Swap.Online button seller bot');
  
consolebot
  .command('run')
  .description('Run the bot')
  .action(() => {
    console.log("Init Swap.online Button seller bot...");
    worker();
  });
  
consolebot.parse(process.argv);