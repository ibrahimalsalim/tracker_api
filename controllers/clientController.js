const asyncHandler = require("express-async-handler");
const { Client } = require("../config/database");
const { validateNewClient, validateUpdateClient } = require("../models/client");
const paginate = require("../utils/pagination")

/**
 *  @desc    add new client
 *  @route   /api/clients
 *  @method  Post
 *  @access  private (only admin)
 */
module.exports.addNewClient = asyncHandler(async (req, res) => {

    const { error } = validateNewClient(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let client = await Client.findOne({ where: { national_id: req.body.national_id } })
    if (client) {
        return res.status(400).json({ message: "this national id is already exist" });
    }

    client = await Client.create({
        national_id: req.body.national_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        date_of_birth: req.body.date_of_birth,
        address: req.body.address,
        phone_number: req.body.phone_number,
    });

    return res.status(200).json({ message: "new client added successfully" });
});

/**
 *  @desc    Get All Clients
 *  @route   /api/clients
 *  @method  GET
 *  @access  private (only admin)
 */
module.exports.getAllClients = asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const totalItems = await Client.count();
    const { totalPages, offset } = paginate(page, limit, totalItems)

    const clients = await Client.findAll({
        limit,
        offset
    });

    res.status(200).json({
        data: clients,
        meta: {
            currentPage: Number(page),
            pageSize: limit,
            totalItems: totalItems,
            totalPages: totalPages
        }
    });
});

/**
 *  @desc    Get clients By Id
 *  @route   /api/clients/id/:id
 *  @method  GET
 *  @access  private (only admin)
 */
module.exports.getClientById = asyncHandler(async (req, res) => {
    const client = await Client.findByPk(
        req.params.id
    );
    if (client) {
        res.status(200).json(client.toJSON());
    } else {
        res.status(404).json({ message: "client not found" });
    }
});
/**
 *  @desc    Get clients By get client by national id
 *  @route   /api/clients/nationalid/:nationalid
 *  @method  GET
 *  @access  private (only admin)
 */
module.exports.getClientByNationalId = asyncHandler(async (req, res) => {
    let client = await Client.findOne(
        {
            where: { national_id: req.params.nationalid }
        }
    )
    if (client) {
        res.status(200).json(client.toJSON());
    } else {
        res.status(404).json({ message: "client not found" });
    }
});

/**
 *  @desc    Update client
 *  @route   /api/clients/:id
 *  @method  PUT
 *  @access  private (only admin)
 */
module.exports.updateClient = asyncHandler(async (req, res) => {
    const { error } = validateUpdateClient(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let client
    if (req.body.national_id) {
        client = await Client.findOne({ where: { national_id: req.body.national_id } })
    }
    if (client && client.id != req.params.id) {
        return res.status(404).json({ message: "this national id is already exist" });
    }

    client = await Client.findByPk(req.params.id)
    if (!client) {
        return res.status(404).json({ message: "this client not found" });
    }

    await client.update({
        national_id: req.body.national_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        date_of_birth: req.body.date_of_birth,
        address: req.body.address,
        phone_number: req.body.phone_number,
    });

    const updatedClient = await Client.findByPk(req.params.id)

    return res.status(200).json(message = updatedClient.toJSON());
});

/**
 *  @desc    Delete Client
 *  @route   /api/clients/:id
 *  @method  DELETE
 *  @access  private (only admin)
 */
module.exports.deleteClient = asyncHandler(async (req, res) => {
    const deletedRowCount = await Client.destroy({
        where: {
            id: req.params.id
        }
    });
    if (deletedRowCount === 0) {
        return res.status(404).json({ message: "this client not found" });
    }
    return res.status(200).json({ message: "client deleted successfully" });
});

