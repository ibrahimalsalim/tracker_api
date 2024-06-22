const asyncHandler = require("express-async-handler");
const { Center, User } = require("../config/database");
const { validateNewCenter, validateUpdateCenter } = require("../models/center");
const paginate = require("../utils/pagination")

/**
 *  @desc    Get All centers
 *  @route   /api/center
 *  @method  GET
 *  @access  private (admin)
 */
module.exports.getAllCenter = asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const totalItems = await Center.count();
    const { totalPages, offset } = paginate(page, limit, totalItems)

    const center = await Center.findAll({
        limit,
        offset
    });

    res.status(200).json({
        data: center,
        meta: {
            currentPage: Number(page),
            pageSize: limit,
            totalItems: totalItems,
            totalPages: totalPages
        }
    });
});

/**
 *  @desc    add new center
 *  @route   /api/center
 *  @method  Post
 *  @access  private (only admin)
 */
module.exports.addNewCenter = asyncHandler(async (req, res) => {

    const { error } = validateNewCenter(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let center = await Center.findOne({ where: { location: req.body.location } })
    if (center) {
        return res.status(400).json({ message: "there is another center in this location" });
    }

    let user = await User.findOne({ where: { id: req.body.manager } });
    if (!user || user.type != 2) {
        return res.status(400).json({ message: 'this id is not belong to manager user ' });
    }

    center = await Center.create({
        manager: req.body.manager,
        city: req.body.city,
        location: req.body.location
    });

    return res.status(200).json({ message: "new center added successfully" });
});

/**
 *  @desc    Update center
 *  @route   /api/center/:id
 *  @method  PUT
 *  @access  private (only admin)
 */
module.exports.updateCenter = asyncHandler(async (req, res) => {

    const { error } = validateUpdateCenter(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let center = await Center.findOne({ where: { id: req.params.id } })

    if (!center) {
        return res.status(400).json({ message: "there is no center with this id" });
    }

    let user = await User.findOne({ where: { id: req.body.manager } });
    if (!user || user.type != 2) {
        return res.status(400).json({ message: 'this id is not belong to manager user ' });
    }

    if (req.body.location) {
        let isRepeated = await Center.findOne({ where: { location: req.body.location } })

        if (isRepeated && isRepeated.id != req.params.id) {
            return res.status(400).json({ message: "there is another center in this location" });
        }
    }
    await center.update({
        manager: req.body.manager,
        city: req.body.city,
        location: req.body.location
    });



    const updatedCenter = await Center.findByPk(req.params.id)

    return res.status(200).json(updatedCenter.toJSON());
});

/**
 *  @desc    Delete center
 *  @route   /api/center/:id
 *  @method  DELETE
 *  @access  private (only admin)
 */
module.exports.deleteCenter = asyncHandler(async (req, res) => {
    const deletedRowCount = await Center.destroy({
        where: {
            id: req.params.id
        }
    });
    if (deletedRowCount === 0) {
        return res.status(404).json({ message: "there is no center with this id" });
    }
    return res.status(200).json({ message: "center deleted successfully" });
});