import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const ConnectDB = async () => {
  const DB_URL =
    'mongodb+srv://xxxxxxxxxxxxxx@xxxxxxxxx.mongodb.net/nodejs-sls-mc';

  try {
    await mongoose.connect(DB_URL);
  } catch (err) {
    console.log(err);
  }
};

export { ConnectDB };
