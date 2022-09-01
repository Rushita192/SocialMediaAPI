const express = require("express");
const app = express();
const chalk = require("chalk");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

// env configuration
require("dotenv").config();

// databse connection
require("./config/dbConfig");

const { handleNotFound, handleError } = require("./utils/errorHandle");

// import routes
const userRouter = require("./routes/userRoutes");
const tweetRouter = require("./routes/tweetRoutes");

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// image upload path set
app.use(express.static(path.join(__dirname, "../uploads")));

//routes use
app.use("/api/v1/user", userRouter);
app.use("/api/v1/tweet", tweetRouter);

// declare port
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'development') {
    app.get('/', (req, res, next) => {
        res.status(200).json({ message: 'Server is Running!!', code: 'ACTIVE' })
    });
}

// Error handler
app.use(handleError);

// 404 error handler
app.use(handleNotFound);

app.listen(port, () => {
    console.log(chalk.yellow(`Server running at http://localhost:${port}/`));
});
