const asyncHandler = require("express-async-handler");
const { Truck, TruckType, User, Center, Shipment, ShipmentState, sequelize } = require("../config/database");
const { validateNewTruck, validateUpdateTruck } = require("../models/truck");
const paginate = require("../utils/pagination");
const { Op, fn, col } = require("sequelize");
const { Where } = require("sequelize/lib/utils");

/**
 *  @desc    Get All truck
 *  @route   /api/truck
 *  @method  GET
 *  @access  private (admin)
 */
module.exports.getAllTrucks = asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const totalItems = await Truck.count();
    const { totalPages, offset } = paginate(page, limit, totalItems)

    const trucks = await Truck.findAll({
        attributes: {
            exclude: ['type', 'driver', "center_id"],
        },
        include: [
            {
                model: User,
                attributes: ['id', 'first_name', 'last_name', 'address']
            },
            {
                model: Center,
                attributes: ["city"]
            },
            {
                model: TruckType,
                attributes: ["type"]
            }
        ],
        limit,
        offset
    })

    const flattenedTrucks = trucks.map(truck => {
        const truckData = truck.toJSON();
        return {
            id: truckData.id,
            driverId: truckData.user.id,
            driverFirstName: truckData.user.first_name,
            driverLastName: truckData.user.last_name,
            driverAddress: truckData.user.address,
            center: truckData.center.city,
            truckType: truckData.Truck_type.type,
            model: truckData.model,
            latitude: truckData.latitude,
            longitude: truckData.longitude,
        };
    });
    res.status(200).json({
        data: flattenedTrucks,
        meta: {
            currentPage: Number(page),
            pageSize: limit,
            totalItems: totalItems,
            totalPages: totalPages
        }
    });
});
/**
 *  @desc    Get truck by id
 *  @route   /api/truck/id/:idd
 *  @method  GET
 *  @access  private (admin)
 */
module.exports.getTruckById = asyncHandler(async (req, res) => {
    const truck = await Truck.findByPk(
        req.params.id,
        {
            attributes: {
                exclude: ['type', 'driver'],
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'first_name', 'last_name', 'address']
                },
                {
                    model: Center,
                    attributes: ["city"]
                },
                {
                    model: TruckType,
                    attributes: ["type"]
                }
            ],
        });

    if (truck) {
        const truckData = truck.toJSON();
        const flattenedTruck = {
            id: truckData.id,
            driverId: truckData.user.id,
            driverFirstName: truckData.user.first_name,
            driverLastName: truckData.user.last_name,
            driverAddress: truckData.user.address,
            center: truckData.center.city,
            truckType: truckData.Truck_type.type,
            model: truckData.model,
            latitude: truckData.latitude,
            longitude: truckData.longitude,
        }
        res.status(200).json(flattenedTruck);
    } else {
        res.status(404).json({ message: "truck not found" });
    }
});
/**
 *  @desc    Get truck by center id
 *  @route   /api/truck/center/:centerId
 *  @method  GET
 *  @access  private (admin)
 */
module.exports.getTruckByCenterId = asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const totalItems = await Truck.count({
        where: {
            center_id: req.params.id
        }
    });
    const { totalPages, offset } = paginate(page, limit, totalItems)

    const trucks = await Truck.findAll({
        where: {
            center_id: req.params.id
        },

        attributes: {
            exclude: ['type', 'driver', "center_id"],
        },
        include: [
            {
                model: User,
                attributes: ['id', 'first_name', 'last_name', 'address']
            },
            {
                model: Center,
                attributes: ["city"]
            },
            {
                model: TruckType,
                attributes: ["type"]
            }
        ],
        limit,
        offset
    });

    const flattenedTrucks = trucks.map(truck => {
        const truckData = truck.toJSON();
        return {
            id: truckData.id,
            driverId: truckData.user.id,
            driverFirstName: truckData.user.first_name,
            driverLastName: truckData.user.last_name,
            driverAddress: truckData.user.address,
            center: truckData.center.city,
            truckType: truckData.Truck_type.type,
            model: truckData.model,
            latitude: truckData.latitude,
            longitude: truckData.longitude,
        };
    });
    res.status(200).json({
        data: flattenedTrucks,
        meta: {
            currentPage: Number(page),
            pageSize: limit,
            totalItems: totalItems,
            totalPages: totalPages
        }
    });
});
/**
 *  @desc    Get truck that ready to go by center id
 *  @route   /api/truck/readytogo/:Id
 *  @method  GET
 *  @access  private (admin)
 */
module.exports.getTruckReadyToloadingByCenterId = asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const totalItems = await Truck.count({
        where: {
            center_id: req.params.id,
            is_ready: true,
        }
    });
    const { totalPages, offset } = paginate(page, limit, totalItems)

    const trucks = await Truck.findAll({
        where: {
            center_id: req.params.id,
            is_ready: true,
        },
        attributes: {
            exclude: ['type', 'driver', "center_id"],
        },
        include: [
            {
                model: User,
                attributes: ['id', 'first_name', 'last_name', 'address']
            },
            {
                model: Center,
                attributes: ["city"]
            },
            {
                model: TruckType,
                attributes: ["type"]
            }
        ],
        limit,
        offset
    });

    const flattenedTrucks = trucks.map(truck => {
        const truckData = truck.toJSON();
        return {
            id: truckData.id,
            driverId: truckData.user.id,
            driverFirstName: truckData.user.first_name,
            driverLastName: truckData.user.last_name,
            driverAddress: truckData.user.address,
            center: truckData.center.city,
            truckType: truckData.Truck_type.type,
            model: truckData.model,
            latitude: truckData.latitude,
            longitude: truckData.longitude,
            is_ready: truckData.is_ready,
        };
    });
    res.status(200).json({
        data: flattenedTrucks,
        meta: {
            currentPage: Number(page),
            pageSize: limit,
            totalItems: totalItems,
            totalPages: totalPages
        }
    });
});

/**
 *  @desc    Get Coordinates of truck by shipment id
 *  @route   /api/truck/shipmentid/:Id
 *  @method  GET
 *  @access  private (admin)
 */
module.exports.getCoordinatesByShipmentId = asyncHandler(async (req, res) => {

    const shipment = await Shipment.findOne({
        where: { id: req.params.id },
        attributes: ["id"],
        include:
        {
            model: Truck,
            attributes: ["id", "longitude", "latitude"],
        }
    });

    if (!shipment) {
        return res.status(400).json({ message: 'There is no shipment with this ID.' });
    }

    console.log(shipment);

    res.status(200).json({
        truckId: shipment.truck.id,
        latitude: shipment.truck.latitude,
        longitude: shipment.truck.longitude,
    })

});
/**
 *  @desc    Get truck and his shipment by user id (driver)
 *  @route   /api/truck/userid/:Id
 *  @method  GET
 *  @access  private (admin)
 */
module.exports.getTruckAndHisShipmentById = asyncHandler(async (req, res) => {

    const truck = await Truck.findOne({
        where: { driver: req.params.id },
        attributes: ["id", "latitude", "longitude"],
        include:
        {
            model: Shipment,
            attributes: { exclude: ["send_center", "receive_center", "shipment_priority_id", "truck_id"] },
            limit: 1,
            order: [['id', 'DESC']],
            include: [
                {
                    model: Center,
                    as: 'send',
                },
                {
                    model: Center,
                    as: 'receive',
                }]
        }
    });

    if (!truck) {
        return res.status(400).json({ message: 'There is no no truck to this driver' });
    }

    res.status(200).json(truck)

});

/**
 *  @desc    add new truck
 *  @route   /api/truck
 *  @method  Post
 *  @access  private (only admin)
 */
module.exports.addNewTruck = asyncHandler(async (req, res) => {

    const { error } = validateNewTruck(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let user = await User.findOne({ where: { id: req.body.driver } });
    if (!user || user.type != 3) {
        return res.status(400).json({ message: 'This ID does not belong to a driver user.' });
    }

    const truckType = await TruckType.findByPk(req.body.type)
    if (!truckType) {
        return res.status(400).json({ message: 'There is no truck type with this ID.' });
    }

    let truckWithSameDriver = await Truck.findOne({ where: { driver: req.body.driver } });
    if (truckWithSameDriver) {
        return res.status(400).json({ message: 'This driver already has a truck.' });
    }

    const center = await Center.findByPk(req.body.center_id);
    if (!center) {
        return res.status(400).json({ message: 'There are no center with this ID.' });
    }

    await Truck.create({
        driver: req.body.driver,
        center_id: req.body.center_id,
        type: req.body.type,
        model: req.body.model,
        is_ready: true
    });

    return res.status(200).json({ message: "New truck added successfully." });
});

/**
 *  @desc    Update truck
 *  @route   /api/truck/:id
 *  @method  PUT
 *  @access  private (only admin)
 */
module.exports.updateTruck = asyncHandler(async (req, res) => {

    const { error } = validateUpdateTruck(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let truck = await Truck.findOne({ where: { id: req.params.id } })
    if (!truck) {
        return res.status(400).json({ message: "there are no truck with this id" });
    }

    if (req.body.driver) {
        let user = await User.findOne({ where: { id: req.body.driver } });
        if (!user || user.type != 3) {
            return res.status(400).json({ message: 'This ID does not belong to a driver user.' });
        }

        let truckWithSameDriver = await Truck.findOne({ where: { driver: req.body.driver } });
        if (truckWithSameDriver && truckWithSameDriver.id != req.params.id) {
            return res.status(400).json({ message: 'this driver alredy have truck' });
        }

        const driver = await User.findByPk(req.body.driver)
        if (!driver) {
            return res.status(400).json({ message: 'there are no driver with this id ' });
        }
    }
    if (req.body.type) {
        const truckType = await TruckType.findByPk(req.body.type)
        if (!truckType) {
            return res.status(400).json({ message: 'there are no truck type with this id' });
        }
    }
    if (req.body.center_id) {
        const center = await Center.findByPk(req.body.center_id);
        if (!center) {
            return res.status(400).json({ message: 'There are no center with this ID.' });
        }
    }

    await truck.update({
        driver: req.body.driver,
        center_id: req.body.center_id,
        type: req.body.type,
        model: req.body.model,
        is_ready: true
    });

    const updatedTruck = await Truck.findByPk(req.params.id)

    return res.status(200).json(updatedTruck.toJSON());
});

/**
 *  @desc    Delete truck
 *  @route   /api/truck/:id
 *  @method  DELETE
 *  @access  private (only admin)
 */
module.exports.deleteTruck = asyncHandler(async (req, res) => {
    const deletedRowCount = await Truck.destroy({
        where: {
            id: req.params.id
        }
    });
    if (deletedRowCount === 0) {
        return res.status(404).json({ message: "there are no truck with this id" });
    }
    return res.status(200).json({ message: "truck deleted successfully" });
});