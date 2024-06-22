const asyncHandler = require("express-async-handler");
const { Truck, TruckType, User } = require("../config/database");
const { validateNewTruck, validateUpdateTruck } = require("../models/truck");
const paginate = require("../utils/pagination");

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

    const truck = await Truck.findAll({
        limit,
        offset
    });

    res.status(200).json({
        data: truck,
        meta: {
            currentPage: Number(page),
            pageSize: limit,
            totalItems: totalItems,
            totalPages: totalPages
        }
    });
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
        return res.status(400).json({ message: 'this id is not belong to driver user ' });
    }

    const truckType = await TruckType.findByPk(req.body.type)
    if (!truckType) {
        return res.status(400).json({ message: 'there is no truck type with this id' });
    }

    let truckWithSameDriver = await Truck.findOne({ where: { driver: req.body.driver } });
    if (truckWithSameDriver) {
        return res.status(400).json({ message: 'this driver alredy have truck ' });
    }

    await Truck.create({
        driver: req.body.driver,
        type: req.body.type,
        model: req.body.model
    });

    return res.status(200).json({ message: "new Content type added successfully" });
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
        return res.status(400).json({ message: "there is no truck with this id" });
    }

    if (req.body.driver) {
        let truckWithSameDriver = await Truck.findOne({ where: { driver: req.body.driver } });
        if (truckWithSameDriver && truckWithSameDriver.id != req.params.id) {
            return res.status(400).json({ message: 'this driver alredy have truck' });
        }
    }
    const truckType = await TruckType.findByPk(req.body.type)
    if (!truckType) {
        return res.status(400).json({ message: 'there is no truck type with this id' });
    }

    const driver = await User.findByPk(req.body.driver)
    if (!driver) {
        return res.status(400).json({ message: 'there is no driver with this id ' });
    }
    await truck.update({
        driver: req.body.driver,
        type: req.body.type,
        model: req.body.model
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
        return res.status(404).json({ message: "there is no truck with this id" });
    }
    return res.status(200).json({ message: "truck deleted successfully" });
});