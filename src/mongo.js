const mongoose = require('mongoose')
const { Connection } = mongoose


const results = {
  0: "Disconnected",
  1: "Connected",
  2: "Connecting",
  3: "Disconnecting",
};

const mongo = async (
  mongoPath,
  instance,
  dbOptions = {}
) => {
  await mongoose.connect(mongoPath, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    ...dbOptions,
  });

  const { connection } = mongoose;
  const state = results[connection.readyState] || "Unknown";
  instance.emit('database', connection, state);
};
module.exports = mongo
module.exports.getMongoConnection = () => {
  return mongoose.connection;
};

