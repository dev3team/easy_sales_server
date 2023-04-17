const mongoose = require('mongoose');
const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } = process.env;
const ConnectMongoDB = async() => {
    try {
        if(mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
			mongoose.set("strictQuery", false);
            // await mongoose.connect(`mongodb://127.0.0.1:27017/upwork_db`);
            await mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
		}
    } catch (error) {
        console.log(error)
    }
}

module.exports = ConnectMongoDB;