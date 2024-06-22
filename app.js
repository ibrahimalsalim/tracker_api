const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({
  origin : "*"
}
));
const { notFound, errorHanlder } = require("./middlewares/errors")
const logger = require("./middlewares/logger")

// const helmet = require("helmet");
require("dotenv").config()


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger)




// app.use(helmet());


app.use("/api/auth", require("./routes/auth"));
app.use("/api/centers", require("./routes/centers"));
app.use("/api/clients", require("./routes/clients"));
app.use("/api/contenttypes", require("./routes/contentTypes"));
app.use("/api/shipmentpriorities", require("./routes/shipmentpriorities"));
app.use("/api/states", require("./routes/states"));
app.use("/api/trucks", require("./routes/trucks"));
app.use("/api/users", require("./routes/users"));
app.use("/api/usertypes", require("./routes/userTypes"));


app.use(notFound);
app.use(errorHanlder);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} mode on porttttttttttttt ${PORT}`));
