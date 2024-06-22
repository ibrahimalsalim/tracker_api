const express = require("express");
const app = express();
const logger = require("./middlewares/logger")
require("dotenv").config()
app.use(logger)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/api/usertypes", require("./routes/userTypes"));


app.listen(3000, () => console.log(`Server is running on port 3000`));