const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const customerRouter = require("./routes/customerRouter");
const workerRouter = require("./routes/workerRouter");
const homeRouter = require("./routes/homeRouter");

dotenv.config();

app.use(bodyParser.json());
app.use("/customer", customerRouter);
app.use("/worker", workerRouter);
app.use("/", homeRouter);


const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    app.listen(port, () => {
        console.log(`Server running on ${port}, http://localhost:${port}`)}
    );
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

