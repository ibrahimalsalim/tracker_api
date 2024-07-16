const express = require("express");
const http = require('http');
const socketIo = require('socket.io');

const cors = require("cors");
const helmet = require("helmet");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const { notFound, errorHanlder } = require("./middlewares/errors")
const logger = require("./middlewares/logger")
require("dotenv").config()


const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger)

let latestLocation = { latitude: 0, longitude: 0 };

app.use("/api/auth", require("./routes/auth"));
app.use("/api/centers", require("./routes/centers"));
app.use("/api/clients", require("./routes/clients"));
app.use("/api/contenttypes", require("./routes/contentTypes"));
app.use("/api/shipmentpriorities", require("./routes/shipmentpriorities"));
app.use("/api/shipments", require("./routes/shipments"));
app.use("/api/shipmentstates", require("./routes/shipmentStates"));
app.use("/api/states", require("./routes/states"));
app.use("/api/trucks", require("./routes/trucks"));
app.use("/api/users", require("./routes/users"));
app.use("/api/usertypes", require("./routes/userTypes"));
app.use("/api/cargos", require("./routes/cargos"));


app.use(notFound);
app.use(errorHanlder);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
