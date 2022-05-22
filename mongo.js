const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI // llega por una variable de entorno , instalar npm install dotenv -D para que podamos usar el .env

mongoose
  .connect(connectionString, {
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
    // useFindAndModify:false,
    // useCreateIndex:true,
  })
  .then(() => {
    console.log('Database connected')
  })
  .catch((error) => {
    console.log(error)
  })

/*
Note.find({}).then((result) => {
  console.log(result);
  mongoose.connection.close();
});
*/

/*
const note = new Note({
  content: "MongoDB es increible",
  date: new Date(),
  important: true,
});

note
  .save()
  .then((result) => {
    console.log(result);
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log(error);
  });
*/
