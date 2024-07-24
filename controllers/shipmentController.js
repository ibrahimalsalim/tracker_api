const asyncHandler = require("express-async-handler");
const { Shipment, ShipmentType, User, Center, Truck, ShipmentPriority, ShipmentState, State } = require("../config/database");
const { validateNewShipment, validateUpdateShipment } = require("../models/shipment");
const paginate = require("../utils/pagination");
const { Op, where } = require("sequelize");
const moment = require('moment-timezone');

/**
 *  @desc    Get All shipment
 *  @route   /api/shipment
 *  @method  GET
 *  @access  private (admin)
 */
module.exports.getAllShipments = asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const totalItems = await Shipment.count();
    const { totalPages, offset } = paginate(page, limit, totalItems)

    const shipment = await Shipment.findAll({

        attributes: { exclude: ['shipment_priority_id', 'type', 'send_center', 'receive_center'] },
        include: [
            {
                model: Truck,
                attributes: ['type'],
            },
            {
                model: Center,
                as: 'send',
                attributes: ['city'],
            },
            {
                model: Center,
                as: 'receive',
                attributes: ['city'],
            },
            {
                model: ShipmentPriority,
                attributes: ['priority'],
            },
            {
                model: ShipmentState,
                attributes: ['start_date', 'end_date'],
                include: [{
                    model: State,
                    attributes: ['state'],
                }]
            }],
        limit,
        offset
    });

    res.status(200).json({
        data: shipment,
        meta: {
            currentPage: Number(page),
            pageSize: limit,
            totalItems: totalItems,
            totalPages: totalPages
        }
    });
});
/**
 *  @desc    Get shipment by id
 *  @route   /api/shipment/id/:id
 *  @method  GET
 *  @access  private (admin)
 */
module.exports.getShipmentById = asyncHandler(async (req, res) => {
    const shipment = await Shipment.findByPk(
        req.params.id
        ,
        {
            attributes: { exclude: ['shipment_priority_id', 'type', 'send_center', 'receive_center'] },
            include: [
                {
                    model: Truck,
                    attributes: ['type'],
                },
                {
                    model: Center,
                    as: 'send',
                    attributes: ['city'],
                },
                {
                    model: Center,
                    as: 'receive',
                    attributes: ['city'],
                },
                {
                    model: ShipmentPriority,
                    attributes: ['priority'],
                },
                {
                    model: ShipmentState,
                    attributes: ['start_date', 'end_date'],
                    include: [{
                        model: State,
                        attributes: ['state'],
                    }]
                }],
        }
    );
    if (shipment) {
        res.status(200).json(shipment.toJSON());
    } else {
        res.status(404).json({ message: "shipment not found" });
    }
});
/**
 *  @desc    Get shipment by center id
 *  @route   /api/shipment/centerId/:id
 *  @method  GET
 *  @access  private (admin)
 */
module.exports.getShipmentByCenterId = asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const totalItems = await Shipment.count({
        where: {
            [Op.or]: [
                { send_center: req.params.id },
                { receive_center: req.params.id }
            ]
        },

    });
    const { totalPages, offset } = paginate(page, limit, totalItems)

    const shipments = await Shipment.findAll({
        where: {
            [Op.or]: [
                { send_center: req.params.id },
                { receive_center: req.params.id }
            ]
        }
        ,
        attributes: { exclude: ['shipment_priority_id', 'type', 'send_center', 'receive_center'] },
        include: [
            {
                model: Truck,
                attributes: ['type'],
            },
            {
                model: Center,
                as: 'send',
                attributes: ['city'],
            },
            {
                model: Center,
                as: 'receive',
                attributes: ['city'],
            },
            {
                model: ShipmentPriority,
                attributes: ['priority'],
            },
            {
                model: ShipmentState,
                attributes: ['start_date', 'end_date'],
                include: [{
                    model: State,
                    attributes: ['state'],
                }]
            }],
        limit,
        offset
    });

    const flattenedShipment = shipments.map(shipment => {
        const shipmentData = shipment.toJSON();
        return {
            ...shipmentData,
            destination: shipmentData.send_center == req.params.id ? 'send' : 'receive'
        };
    });
    res.status(200).json({
        data: flattenedShipment,
        meta: {
            currentPage: Number(page),
            pageSize: limit,
            totalItems: totalItems,
            totalPages: totalPages
        }
    });
});
/**
 *  @desc    Get sent shipment by center id
 *  @route   /api/shipment/sentshipmentbycenterid/:id
 *  @method  GET
 *  @access  private (admin)
 */
module.exports.sentShipmentByCenterId = asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const totalItems = await Shipment.count({
        where: {
            send_center: req.params.id
        },

    });
    const { totalPages, offset } = paginate(page, limit, totalItems)

    const shipments = await Shipment.findAll({
        where: {
            send_center: req.params.id
        },
        attributes: { exclude: ['shipment_priority_id', 'type', 'send_center', 'receive_center'] },
        include: [
            {
                model: Truck,
                attributes: ['type'],
            },
            {
                model: Center,
                as: 'send',
                attributes: ['city'],
            },
            {
                model: Center,
                as: 'receive',
                attributes: ['city'],
            },
            {
                model: ShipmentPriority,
                attributes: ['priority'],
            },
            {
                model: ShipmentState,
                attributes: ['start_date', 'end_date'],
                include: [{
                    model: State,
                    attributes: ['state'],
                }]
            }],
        limit,
        offset
    });

    const flattenedShipment = shipments.map(shipment => {
        const shipmentData = shipment.toJSON();
        return {
            ...shipmentData,
            destination: shipmentData.send_center == req.params.id ? 'send' : 'receive'
        };
    });
    res.status(200).json({
        data: flattenedShipment,
        meta: {
            currentPage: Number(page),
            pageSize: limit,
            totalItems: totalItems,
            totalPages: totalPages
        }
    });
});
/**
 *  @desc    Get received shipment by center id
 *  @route   /api/shipment/receivedshipmentbycenterid/:id
 *  @method  GET
 *  @access  private (admin)
 */
module.exports.receivedShipmentByCenterId = asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const totalItems = await Shipment.count({
        where: {
            receive_center: req.params.id
        },

    });
    const { totalPages, offset } = paginate(page, limit, totalItems)

    const shipments = await Shipment.findAll({
        where: {
            receive_center: req.params.id
        },
        attributes: { exclude: ['shipment_priority_id', 'type', 'send_center', 'receive_center'] },
        include: [
            {
                model: Truck,
                attributes: ['type'],
            },
            {
                model: Center,
                as: 'send',
                attributes: ['city'],
            },
            {
                model: Center,
                as: 'receive',
                attributes: ['city'],
            },
            {
                model: ShipmentPriority,
                attributes: ['priority'],
            },
            {
                model: ShipmentState,
                attributes: ['start_date', 'end_date'],
                include: [{
                    model: State,
                    attributes: ['state'],
                }]
            }],
        limit,
        offset
    });

    const flattenedShipment = shipments.map(shipment => {
        const shipmentData = shipment.toJSON();
        return {
            ...shipmentData,
            destination: shipmentData.send_center == req.params.id ? 'send' : 'receive'
        };
    });
    res.status(200).json({
        data: flattenedShipment,
        meta: {
            currentPage: Number(page),
            pageSize: limit,
            totalItems: totalItems,
            totalPages: totalPages
        }
    });
});
/**
 *  @desc    Get loading shipment by center id
 *  @route   /api/shipment/loadingshipmentbycenterid/:id
 *  @method  GET
 *  @access  private (admin)
 */
module.exports.loadingShipmentByCenterId = asyncHandler(async (req, res) => {
    try {
        const shipments = await Shipment.findAll({
            attributes: { exclude: ['shipment_priority_id', 'type', 'send_center', 'receive_center'] },
            include: [
                {
                    model: Truck,
                    attributes: ['type'],
                },
                {
                    model: Center,
                    as: 'send',
                    attributes: ['city'],
                    where: { id: req.params.id }
                }
                ,
                {
                    model: Center,
                    as: 'receive',
                    attributes: ['city'],
                },
                {
                    model: ShipmentPriority,
                    attributes: ['priority'],
                },
                {
                    model: ShipmentState,
                }
            ]
        });
        const filteredShipments = shipments.filter(shipment => {
            const stateCount = shipment.toJSON().shipment_states.length;
            return (stateCount - 1) % 4 === 0;
        });

        res.status(200).json({
            success: true,
            data: filteredShipments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 *  @desc    add new shipment
 *  @route   /api/shipment
 *  @method  Post
 *  @access  private (only admin)
 */
module.exports.addNewShipment = asyncHandler(async (req, res) => {

    const { error } = validateNewShipment(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    if (req.body.send_center === req.body.receive_center) {
        return res.status(400).json({ message: "you can not send to same center" })
    }

    const truck = await Truck.findByPk(req.body.truck_id)
    if (!truck || !(truck.is_ready) || (truck.center_id != req.body.send_center)) {
        return res.status(400).json({ message: 'There are no truck with this ID in this center.' });
    }

    const shipmentPriority = await ShipmentPriority.findByPk(req.body.shipment_priority_id)
    if (!shipmentPriority) {
        return res.status(400).json({ message: 'There are no shipment priority with this ID.' });
    }

    const sendCenter = await Center.findByPk(req.body.send_center)
    const receiveCenter = await Center.findByPk(req.body.receive_center)
    if (!sendCenter || !receiveCenter) {
        return res.status(400).json({ message: 'Invalid center ID provided.' });
    }


    const shipment = await Shipment.create({
        truck_id: req.body.truck_id,
        shipment_priority_id: req.body.shipment_priority_id,
        send_center: req.body.send_center,
        receive_center: req.body.receive_center
    });

    await truck.update({ is_ready: false });


    await ShipmentState.create({
        shipment_id: shipment.id,
        states_id: 1,
        start_date: moment().tz("Etc/GMT-6").format("YYYY-MM-DD hh:mm:ss Z"),
    });



    return res.status(200).json({ message: "New shipment added successfully." });
});

/**
 *  @desc    Update shipment
 *  @route   /api/shipment/:id
 *  @method  PUT
 *  @access  private (only admin)
 */
module.exports.updateShipment = asyncHandler(async (req, res) => {

    const { error } = validateUpdateShipment(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let shipment = await Shipment.findOne({ where: { id: req.params.id } })
    if (!shipment) {
        return res.status(400).json({ message: "there are no shipment with this id" });
    }

    if (req.body.driver) {
        let user = await User.findOne({ where: { id: req.body.driver } });
        if (!user || user.type != 3) {
            return res.status(400).json({ message: 'This ID does not belong to a driver user.' });
        }

        let shipmentWithSameDriver = await Shipment.findOne({ where: { driver: req.body.driver } });
        if (shipmentWithSameDriver && shipmentWithSameDriver.id != req.params.id) {
            return res.status(400).json({ message: 'this driver alredy have shipment' });
        }

        const driver = await User.findByPk(req.body.driver)
        if (!driver) {
            return res.status(400).json({ message: 'there are no driver with this id ' });
        }
    }
    if (req.body.type) {
        const shipmentType = await ShipmentType.findByPk(req.body.type)
        if (!shipmentType) {
            return res.status(400).json({ message: 'there are no shipment type with this id' });
        }
    }
    if (req.body.center_id) {
        const center = await Center.findByPk(req.body.center_id);
        if (!center) {
            return res.status(400).json({ message: 'There are no center with this ID.' });
        }
    }

    await shipment.update({
        driver: req.body.driver,
        type: req.body.type,
        model: req.body.model
    });

    const updatedShipment = await Shipment.findByPk(req.params.id)

    return res.status(200).json(updatedShipment.toJSON());
});

/**
 *  @desc    Delete shipment
 *  @route   /api/shipment/:id
 *  @method  DELETE
 *  @access  private (only admin)
 */
module.exports.deleteShipment = asyncHandler(async (req, res) => {
    const deletedRowCount = await Shipment.destroy({
        where: {
            id: req.params.id
        }
    });
    if (deletedRowCount === 0) {
        return res.status(404).json({ message: "there are no shipment with this id" });
    }
    return res.status(200).json({ message: "shipment deleted successfully" });
});







