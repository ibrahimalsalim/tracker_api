const asyncHandler = require("express-async-handler");
const { User } = require("../config/database");
const { validateUpdateUser, hashPassword } = require("../models/user");
const paginate = require("../utils/pagination")

/**
 *  @desc    Get All Users
 *  @route   /api/users
 *  @method  GET
 *  @access  private (only admin)
 */
module.exports.getAllUsers = asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const totalItems = await User.count();

    const { totalPages, offset } = paginate(page, limit, totalItems)

    const users = await User.findAll({
        attributes: { exclude: ['password'] },
        limit,
        offset
    });

    res.status(200).json({
        data: users,
        meta: {
            currentPage: Number(page),
            pageSize: limit,
            totalItems: totalItems,
            totalPages: totalPages
        }
    });
});
/**
 *  @desc    Get User By Id
 *  @route   /api/users/:id
 *  @method  GET
 *  @access  private (only admin & user himself)
 */
module.exports.getUserById = asyncHandler(async (req, res) => {
    const user = await User.findByPk(
        req.params.id,
        {
            attributes: { exclude: ['password'] }
        });
    if (user) {
        res.status(200).json(user.toJSON());
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

/**
 *  @desc    Update User
 *  @route   /api/users/:id
 *  @method  PUT
 *  @access  private (only admin & user himself)
 */
module.exports.updateUser = asyncHandler(async (req, res) => {
    const { error } = validateUpdateUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let user = await User.findOne({ where: { email: req.body.email } })
    if (user && user.id != req.params.id) {
        return res.status(400).json({ message: "Email is already in use" });
    }

    user = await User.findByPk(req.params.id)
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (req.body.password) {
        req.body.password = await hashPassword(req.body.password);
    }

    await user.update({
        type: req.body.type,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        date_of_birth: req.body.date_of_birth,
        address: req.body.address,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    const updatedUser = await User.findByPk(req.params.id)

    const { password, ...userWithoutPassword } = updatedUser.toJSON();
    return res.status(200).json(userWithoutPassword);
});

/**
 *  @desc    Delete User
 *  @route   /api/users/:id
 *  @method  DELETE
 *  @access  private (only admin & user himself)
 */
module.exports.deleteUser = asyncHandler(async (req, res) => {
    const deletedRowCount = await User.destroy({
        where: {
            id: req.params.id
        }
    });
    if (deletedRowCount === 0) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
});

