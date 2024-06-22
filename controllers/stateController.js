const asyncHandler = require("express-async-handler");
const { State } = require("../config/database");
const { validateNewState, validateUpdateState } = require("../models/state");
const paginate = require("../utils/pagination")

/**
 *  @desc    Get All states
 *  @route   /api/state
 *  @method  GET
 *  @access  private (admin and manager)
 */
module.exports.getAllStates = asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const totalItems = await State.count();
    const { totalPages, offset } = paginate(page, limit, totalItems)

    const state = await State.findAll({
        limit,
        offset
    });

    res.status(200).json({
        data: state,
        meta: {
            currentPage: Number(page),
            pageSize: limit,
            totalItems: totalItems,
            totalPages: totalPages
        }
    });
});

/**
 *  @desc    add new state
 *  @route   /api/state
 *  @method  Post
 *  @access  private (only admin)
 */
module.exports.addNewState = asyncHandler(async (req, res) => {

    const { error } = validateNewState(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let state = await State.findOne({ where: { state: req.body.state } })
    if (state) {
        return res.status(400).json({ message: "this state alredy exist" });
    }
    state = await State.create({
        state: req.body.state
    });

    return res.status(200).json({ message: "new state added successfully" });
});

/**
 *  @desc    Update state
 *  @route   /api/state/:id
 *  @method  PUT
 *  @access  private (only admin)
 */
module.exports.updateState = asyncHandler(async (req, res) => {

    const { error } = validateUpdateState(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }


    let state = await State.findOne({ where: { id: req.params.id } })

    if (!state) {
        return res.status(400).json({ message: "there is no state with this id" });
    }

    let isRepeated = await State.findOne({ where: { state: req.body.state } })

    if (isRepeated && isRepeated.id != req.params.id) {
        return res.status(400).json({ message: "this state alredy exist" });
    }

    await state.update({
        state: req.body.state,
    });



    const updatedState = await State.findByPk(req.params.id)

    return res.status(200).json(updatedState.toJSON());
});

/**
 *  @desc    Delete state
 *  @route   /api/state/:id
 *  @method  DELETE
 *  @access  private (only admin)
 */
module.exports.deleteState = asyncHandler(async (req, res) => {
    const deletedRowCount = await State.destroy({
        where: {
            id: req.params.id
        }
    });
    if (deletedRowCount === 0) {
        return res.status(404).json({ message: "there is no state with this id" });
    }
    return res.status(200).json({ message: "state deleted successfully" });
});