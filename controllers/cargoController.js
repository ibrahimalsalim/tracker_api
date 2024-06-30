const asyncHandler = require("express-async-handler");
const { Cargo, User, Client, Shipment, CargoContent, ContentType, sequelize } = require("../config/database");
const { validateNewCargo, validateUpdateCargo } = require("../models/cargo");
const paginate = require("../utils/pagination");

/**
 *  @desc    Get All cargos
 *  @route   /api/cargos
 *  @method  GET
 *  @access  private (admin)
 */
module.exports.getAllCargos = asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const totalItems = await Cargo.count();
    const { totalPages, offset } = paginate(page, limit, totalItems)

    const cargo = await Cargo.findAll({

        attributes: { exclude: ['sender_id', 'receiver_id'] },
        include: [
            {
                model: Client,
                as: 'sender',
                attributes: ['id', 'national_id', 'first_name', 'last_name']
            },
            {
                model: Client,
                as: 'receiver',
                attributes: ['id', 'national_id', 'first_name', 'last_name']
            }
        ],
        limit,
        offset
    });

    res.status(200).json({
        data: cargo,
        meta: {
            currentPage: Number(page),
            pageSize: limit,
            totalItems: totalItems,
            totalPages: totalPages
        }
    });
});

/**
 *  @desc    get cargo by id
 *  @route   /api/cargos/id/:id
 *  @method  Post
 *  @access  private (only admin)
 */
module.exports.getCargoById = asyncHandler(async (req, res) => {

    const cargo = await Cargo.findByPk(
        req.params.id
        ,
        {
            attributes: { exclude: ['sender_id', 'receiver_id'] },
            include: [
                {
                    model: Client,
                    as: 'sender',
                    attributes: ['id', 'national_id', 'first_name', 'last_name']
                },
                {
                    model: Client,
                    as: 'receiver',
                    attributes: ['id', 'national_id', 'first_name', 'last_name']
                }
            ],
        }
    );
    if (cargo) {
        res.status(200).json(cargo.toJSON());
    } else {
        res.status(404).json({ message: "cargo not found" });
    }
});
/**
 *  @desc    add new cargo
 *  @route   /api/cargos
 *  @method  Post
 *  @access  private (only admin)
 */
module.exports.getShipmentCargos = asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const totalItems = await Cargo.count({ where: { shipment_id: req.params.id }, });
    const { totalPages, offset } = paginate(page, limit, totalItems)
    let shipment = await Shipment.findByPk(req.params.id)
    if (!shipment) {
        return res.status(400).json({ message: 'thire are no shipment with this id' })
    }
    const cargo = await Cargo.findAll({
        where: { shipment_id: req.params.id },
        attributes: { exclude: ['sender_id', 'receiver_id'] },
        include: [
            {
                model: Client,
                as: 'sender',
                attributes: ['id', 'national_id', 'first_name', 'last_name']
            },
            {
                model: Client,
                as: 'receiver',
                attributes: ['id', 'national_id', 'first_name', 'last_name']
            }
        ],
        limit,
        offset
    });

    res.status(200).json({
        data: cargo,
        meta: {
            currentPage: Number(page),
            pageSize: limit,
            totalItems: totalItems,
            totalPages: totalPages
        }
    });
});

/**
 *  @desc    add new cargo
 *  @route   /api/cargos
 *  @method  Post
 *  @access  private (only admin)
 */

module.exports.addNewCargo = asyncHandler(async (req, res) => {

    const { error } = validateNewCargo(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { shipment_id, sender, receiver, contents } = req.body;

    if (sender.national_id == receiver.national_id) {
        return res.status(400).json({ message: "you cannot send cargos to same client" });
    }
    const t = await sequelize.transaction();

    try {
        const [senderClient, createdSender] = await Client.findOrCreate({
            where: { national_id: sender.national_id },
            defaults: sender,
            transaction: t
        });

        const [receiverClient, createdReceiver] = await Client.findOrCreate({
            where: { national_id: receiver.national_id },
            defaults: receiver,
            transaction: t
        });

        const cargo = await Cargo.create({
            shipment_id: shipment_id,
            sender_id: senderClient.id,
            receiver_id: receiverClient.id,
            state: "Not Received"
        }, { transaction: t });

        const cargoContents = contents.map(content => ({
            cargo_id: cargo.id,
            content_type_id: content.content_type_id,
            quantity: content.quantity,
            weight: content.weight
        }));
        await CargoContent.bulkCreate(cargoContents, { transaction: t });

        await t.commit();

        const createdCargo = await Cargo.findByPk(cargo.id, {

            attributes: { exclude: ['sender_id', 'receiver_id', 'state'] },
            include: [
                {
                    model: Client,
                    as: 'sender',
                    attributes: ['id', 'national_id', 'first_name', 'last_name']
                },
                {
                    model: Client,
                    as: 'receiver',
                    attributes: ['id', 'national_id', 'first_name', 'last_name']
                },
                {
                    model: CargoContent,
                    attributes: ['quantity', 'weight'],
                    include: {
                        model: ContentType,
                        attributes: ['type', 'description', 'price']
                    }
                }
            ],

        });

        res.status(201).json({ success: true, createdCargo });
    }
    catch (error) {
        await t.rollback();
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
/**
 *  @desc    Update cargo
 *  @route   /api/cargos/:id
 *  @method  PUT
 *  @access  private (only admin)
 */
module.exports.updateCargo = asyncHandler(async (req, res) => {

    const { error } = validateUpdateCargo(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let cargo = await Cargo.findOne({ where: { id: req.params.id } })
    if (!cargo) {
        return res.status(400).json({ message: "there are no cargo with this id" });
    }

    if (req.body.shipment_id) {
        const shipment = await Shipment.findByPk(req.body.shipment_id)
        if (!shipment) {
            return res.status(400).json({ message: 'Invalid shipment ID provided.' });
        }
    }

    if (req.body.sender_id) {
        const sender = await Client.findByPk(req.body.sender_id)
        if (!sender) {
            return res.status(400).json({ message: 'Invalid client ID provided.' });
        }
    }
    if (req.body.receiver_id) {
        const receiver = await Client.findByPk(req.body.receiver_id)
        if (!receiver) {
            return res.status(400).json({ message: 'Invalid client ID provided.' });
        }
    }

    if (req.body.sender_id && req.body.receiver_id) {
        if (req.body.sender_id === req.body.receiver_id) {
            return res.status(400).json({ message: "you can not send to same client" })
        }
    }

    await cargo.update({
        id: req.body.id,
        shipment_id: req.body.shipment_id,
        sender_id: req.body.sender_id,
        receiver_id: req.body.receiver_id,
        state: req.body.state,
    });

    const updatedCargo = await Cargo.findByPk(req.params.id)

    return res.status(200).json(updatedCargo.toJSON());
});

/**
 *  @desc    Delete cargo
 *  @route   /api/cargos/:id
 *  @method  DELETE
 *  @access  private (only admin)
 */
module.exports.deleteCargo = asyncHandler(async (req, res) => {
    const deletedRowCount = await Cargo.destroy({
        where: {
            id: req.params.id
        }
    });
    if (deletedRowCount === 0) {
        return res.status(404).json({ message: "there are no cargo with this id" });
    }
    return res.status(200).json({ message: "cargo deleted successfully" });
});