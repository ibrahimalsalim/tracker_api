const express = require("express");
const app = express();
const { notFound, errorHanlder } = require("./middlewares/errors")
const logger = require("./middlewares/logger")
require("dotenv").config()
app.use(logger)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", require("./routes/auth"));

app.use("/api/contenttype", require("./routes/contentTypes"));
app.use("/api/state", require("./routes/states"));
app.use("/api/usertypes", require("./routes/userTypes"));


app.use(notFound);
app.use(errorHanlder);

app.listen(3000, () => console.log(`Server is running on port 3000`));