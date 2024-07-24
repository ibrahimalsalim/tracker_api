const http = require('http');
const express = require("express");
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server,
  {
    cors: {
      origin: "*"
    }
  }
);

const cors = require("cors");
const helmet = require("helmet");
const asyncHandler = require("express-async-handler")
require("dotenv").config()

const { notFound, errorHanlder } = require("./middlewares/errors")
const logger = require("./middlewares/logger");
const { Truck } = require('./config/database');
const { where } = require('sequelize');



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



io.on('connection', (socket) => {

  socket.on('updateinfo', asyncHandler(async (info) => {

    // validation  

    await Truck.update(
      {
        latitude: info.location.lat,
        longitude: info.location.lon
      },
      {
        where: {
          id: info.truckId
        }
      });
    console.log(info);
    io.emit('infoupdated', info);
  })
  )
})




app.use(notFound);
app.use(errorHanlder);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
