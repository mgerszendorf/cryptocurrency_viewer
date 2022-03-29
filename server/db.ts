const mongooseDb = require("mongoose");

module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    try {
        mongooseDb.connect(process.env.DB, connectionParams);
        console.log("Connect to database successfully")
    } catch (error: any) {
        console.log(error);
        console.log("Could not connect to databse");
    }
}