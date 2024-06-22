const asyncHandler = require("express-async-handler");
const { UserType } = require("../config/database");
const { validateNewUserType, validateUpdateUserType} = require("../models/usertype");
const paginate = require("../utils/pagination")

/**
 *  @desc    Get All user types
 *  @route   /api/usertypes
 *  @method  GET
 *  @access  private (admin and manager)
 */
module.exports.getAllUserTypes = asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const totalItems = await UserType.count();
    const { totalPages, offset } = paginate(page, limit, totalItems)

    const userType = await UserType.findAll({
        limit,
        offset
    });

    res.status(200).json({
        data: userType,
        meta: {
            currentPage: Number(page),
            pageSize: limit,
            totalItems: totalItems,
            totalPages: totalPages
        }
    });
});

/**
 *  @desc    add new user type
 *  @route   /api/usertypes
 *  @method  Post
 *  @access  private (only admin)
 */
module.exports.addNewUserType = asyncHandler(async (req, res) => {

    const { error } = validateNewUserType(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let userType = await UserType.findOne({ where: { type: req.body.type } })
    if (userType) {
        return res.status(400).json({ message: "this user type alredy exist" });
    }
    userType = await UserType.create({
        type: req.body.type
    });

    return res.status(200).json({ message: "new user type added successfully" });
});

/**
 *  @desc    Update user type
 *  @route   /api/usertypes/:id
 *  @method  PUT
 *  @access  private (only admin)
 */
module.exports.updateUserType = asyncHandler(async (req, res) => {

    const { error } = validateUpdateUserType(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }


    let userType = await UserType.findOne({ where: { id: req.params.id } })

    if (!userType) {
        return res.status(400).json({ message: "there is no user type with this id" });
    }

    let isRepeated = await UserType.findOne({ where: { type: req.body.type } })

    if (isRepeated && isRepeated.id != req.params.id) {
        return res.status(400).json({ message: "this user type alredy exist" });
    }

    await userType.update({
        type: req.body.type,
    });



    const updatedUserType = await UserType.findByPk(req.params.id)

    return res.status(200).json(updatedUserType.toJSON());
});



/**
 *  @desc    Delete user type
 *  @route   /api/usertypes/:id
 *  @method  DELETE
 *  @access  private (only admin)
 */
module.exports.deleteUserType = asyncHandler(async (req, res) => {
    const deletedRowCount = await UserType.destroy({
        where: {
            id: req.params.id
        }
    });
    if (deletedRowCount === 0) {
        return res.status(404).json({ message: "there is no user type with this id" });
    }
    return res.status(200).json({ message: "user type deleted successfully" });
});