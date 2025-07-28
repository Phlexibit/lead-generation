require("dotenv").config();
// require("express-async-errors");

// extra security packages
const cors = require("cors");
const express = require("express");
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

const routes = require("./routes/index");

const connectDB = require("./db/connect");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
app.use(cors());

const path = require('path');

// Swagger Documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// routes
app.use("/api/v1/", routes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(" Error starting the Server - > ", error);
  }
};

start();
