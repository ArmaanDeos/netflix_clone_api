const express = require('express');
const app = express();
const mongoose = require("mongoose")
const dotenv = require('dotenv')
dotenv.config();
const PORT = process.env.PORT || 8800
const MONGO_URL = process.env.MONOG_URL;
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const movieRoute = require("./routes/movies")
const listRoute = require("./routes/lists")
const cors = require('cors')
app.use(cors())


// { MIDDLEWARES }
app.use(express.json());



// { ROUTE }

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movie", movieRoute);
app.use("/api/lists", listRoute);

// { Database Connection }
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => console.log('DBs Connection Done'))
    .catch((err) => console.log(err));


// { App Listen }
app.listen(PORT, () => {
    console.log(`Backend Server is running on ${PORT}`)
})