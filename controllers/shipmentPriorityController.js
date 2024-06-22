const asyncHandler = require("express-async-handler");
const { ShipmentPriority } = require("../config/database");
const { validateNewShipmentPriority, validateUpdateShipmentPriority } = require("../models/shipmentpriority");
const paginate = require("../utils/pagination")

/**
 *  @desc    Get All shipment priority
 *  @route   /api/shipmentpriority
 *  @method  GET
 *  @access  private (admin and manager)
 */
module.exports.getAllShipmentPriority = asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const totalItems = await ShipmentPriority.count();
    const { totalPages, offset } = paginate(page, limit, totalItems)

    const shipmentPriority = await ShipmentPriority.findAll({
        limit,
        offset
    });

    res.status(200).json({
        data: shipmentPriority,
        meta: {
            currentPage: Number(page),
            pageSize: limit,
            totalItems: totalItems,
            totalPages: totalPages
        }
    });
});

/**
 *  @desc    add new shipment priority
 *  @route   /api/shipmentpriority
 *  @method  Post
 *  @access  private (only admin)
 */
module.exports.addNewShipmentPriority = asyncHandler(async (req, res) => {

    const { error } = validateNewShipmentPriority(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let shipmentPriority = await ShipmentPriority.findOne({ where: { priority: req.body.priority } })
    if (shipmentPriority) {
        return res.status(400).json({ message: "this priority alredy exist" });
    }
    shipmentPriority = await ShipmentPriority.create({
        priority: req.body.priority,
        additional_wages: req.body.additional_wages
    });

    return res.status(200).json({ message: "new priority added successfully" });
});

/**
 *  @desc    Update shipment priority
 *  @route   /api/shipmentpriority/:id
 *  @method  PUT
 *  @access  private (only admin)
 */
module.exports.updateShipmentPriority = asyncHandler(async (req, res) => {

    const { error } = validateUpdateShipmentPriority(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let shipmentPriority = await ShipmentPriority.findOne({ where: { id: req.params.id } })

    if (!shipmentPriority) {
        return res.status(400).json({ message: "there is no priority with this id" });
    }

    if (req.body.priority) {
        let isRepeated = await ShipmentPriority.findOne({ where: { priority: req.body.priority } })

        if (isRepeated && isRepeated.id != req.params.id) {
            return res.status(400).json({ message: "this priority alredy exist" });
        }
    }
    await shipmentPriority.update({
        priority: req.body.priority,
        additional_wages: req.body.additional_wages
    });



    const updatedShipmentPriority = await ShipmentPriority.findByPk(req.params.id)

    return res.status(200).json(updatedShipmentPriority.toJSON());
});

/**
 *  @desc    Delete shipment priority
 *  @route   /api/shipmentpriority/:id
 *  @method  DELETE
 *  @access  private (only admin)
 */
module.exports.deleteShipmentPriority = asyncHandler(async (req, res) => {
    const deletedRowCount = await ShipmentPriority.destroy({
        where: {
            id: req.params.id
        }
    });
    if (deletedRowCount === 0) {
        return res.status(404).json({ message: "there is no priority with this id" });
    }
    return res.status(200).json({ message: "priority deleted successfully" });
});