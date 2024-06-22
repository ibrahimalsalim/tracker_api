const asyncHandler = require("express-async-handler");
const { ContentType } = require("../config/database");
const { validateNewContentType, validateUpdateContentType } = require("../models/contenttype");
const paginate = require("../utils/pagination")

/**
 *  @desc    Get All content types
 *  @route   /api/contenttype
 *  @method  GET
 *  @access  private (admin and manager)
 */
module.exports.getAllContentType = asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const totalItems = await ContentType.count();
    const { totalPages, offset } = paginate(page, limit, totalItems)

    const contentType = await ContentType.findAll({
        limit,
        offset
    });

    res.status(200).json({
        data: contentType,
        meta: {
            currentPage: Number(page),
            pageSize: limit,
            totalItems: totalItems,
            totalPages: totalPages
        }
    });
});

/**
 *  @desc    add new content type
 *  @route   /api/contenttype
 *  @method  Post
 *  @access  private (only admin)
 */
module.exports.addNewContentType = asyncHandler(async (req, res) => {

    const { error } = validateNewContentType(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let contentType = await ContentType.findOne({ where: { type: req.body.type } })
    if (contentType) {
        return res.status(400).json({ message: "this content type alredy exist" });
    }
    contentType = await ContentType.create({
        type: req.body.type,
        description: req.body.description,
        price: req.body.price
    });

    return res.status(200).json({ message: "new Content type added successfully" });
});

/**
 *  @desc    Update content type
 *  @route   /api/contenttype/:id
 *  @method  PUT
 *  @access  private (only admin)
 */
module.exports.updateContentType = asyncHandler(async (req, res) => {

    const { error } = validateUpdateContentType(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }


    let contentType = await ContentType.findOne({ where: { id: req.params.id } })

    if (!contentType) {
        return res.status(400).json({ message: "there is no content type with this id" });
    }

    if (req.body.type) {
        let isRepeated = await ContentType.findOne({ where: { type: req.body.type } })

        if (isRepeated && isRepeated.id != req.params.id) {
            return res.status(400).json({ message: "this content type alredy exist" });
        }
    }
    await contentType.update({
        type: req.body.type,
        description: req.body.description,
        price: req.body.price
    });



    const updatedContentType = await ContentType.findByPk(req.params.id)

    return res.status(200).json(updatedContentType.toJSON());
});



/**
 *  @desc    Delete content type
 *  @route   /api/contenttype/:id
 *  @method  DELETE
 *  @access  private (only admin)
 */
module.exports.deleteContentType = asyncHandler(async (req, res) => {
    const deletedRowCount = await ContentType.destroy({
        where: {
            id: req.params.id
        }
    });
    if (deletedRowCount === 0) {
        return res.status(404).json({ message: "there is no content type with this id" });
    }
    return res.status(200).json({ message: "content type deleted successfully" });
});