const server = require('./server');
const cronPing = require('./cron-ping');
const scraper = require('./scraper/index');
const PORT = 3306;

const log = (error) => {
  if ( error ) {
    console.log("Error on listen: ", error);
    process.exit(1);
  }
  console.log(`Server start in ${PORT} port`);
};

scraper();
server(PORT, log);
cronPing();    


