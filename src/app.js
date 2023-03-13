const server = require('./server');
const cronPing = require('./cron-ping');
const scraper = require('./scraper/index');
const PORT = process.env.PORT

const log = (error) => {
  if ( error ) {
    console.log("Error on listen: ", error);
    process.exit(1);
  }
  console.log(`Server start in ${PORT} port`);
};

server(PORT, log);
scraper();
cronPing();    


