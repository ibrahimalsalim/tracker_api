const asyncHandler = require("express-async-handler");
const { Shipment, ShipmentState, State, sequelize, Truck } = require("../config/database");
const moment = require('moment-timezone');
const { validateUpdateShipmentState } = require("../models/shipmentstate");
const paginate = require("../utils/pagination");
const { Op, where } = require("sequelize");

/**
 *  @desc    Get shipment state by shipment
 *  @route   /api/shipmentstate/id
 *  @method  GET
 *  @access  private (driver or manager)
 */
module.exports.getShipmentStateByShipment = asyncHandler(async (req, res) => {

    const shipment = await Shipment.findByPk(req.params.id)
    if (!shipment) {
        res.status(404).json({ message: "there are no shipment with this id" });
    }

    const Shipmentstate = await ShipmentState.findAll({
        where: {
            shipment_id: req.params.id
        },
        include: [
            {
                model: State,
                attributes: ['state'],
            }
        ]
    });

    res.status(200).json(Shipmentstate);
});
/**
 *  @desc    update shipment state by shipment
 *  @route   /api/shipment/:id
 *  @method  PUT
 *  @access  private (driver or manager)
 */
module.exports.updateShipmentStateByShipment = asyncHandler(async (req, res) => {

    const { error } = validateUpdateShipmentState(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }


    const { states_id, shipment_id } = req.body;
    const currentDate = moment().tz("Etc/GMT-6").format("YYYY-MM-DD hh:mm:ss Z");

    const t = await sequelize.transaction();

    try {

        for (let i = 1; i < states_id; i++) {
            const stateExists = await ShipmentState.findOne({
                where: {
                    shipment_id: shipment_id,
                    states_id: i
                },
                transaction: t
            });

            if (!stateExists) {
                await t.rollback();
                return res.status(400).json({
                    success: false,
                    error: `Previous state ${i} does not exist for shipment_id ${shipment_id}`
                });
            }
        }

        const currentStateExists = await ShipmentState.findOne({
            where: {
                shipment_id: shipment_id,
                states_id: states_id
            },
            transaction: t
        });

        if (currentStateExists) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                error: `State ${states_id} already exists for shipment_id ${shipment_id}`
            });
        }

        let currShipmentState;

        switch (states_id) {
            case 1:
            case 2:
            case 3:
            case 4:
                currShipmentState = await updateShipmentState(shipment_id, states_id, currentDate, t);
                break;
            default:
                await t.rollback();
                return res.status(400).json({
                    success: false,
                    error: "Invalid states_id"
                });
        }

        await t.commit();
        res.status(201).json({ success: true, currShipmentState });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const updateShipmentState = async (shipmentId, stateId, currentDate, transaction) => {

    await ShipmentState.update(
        { end_date: currentDate },
        {
            where: {
                shipment_id: shipmentId,
                states_id: stateId - 1
            },
            transaction: transaction
        }
    );

    const currShipmentState = await ShipmentState.create(
        {
            shipment_id: shipmentId,
            states_id: stateId,
            start_date: currentDate,
            end_date: stateId === 4 ? currentDate : null
        },
        { transaction: transaction }
    );

    if (stateId === 4) {
        let shipment = await Shipment.findByPk(
            shipmentId,
        )

        let truck = await Truck.findByPk(
            shipment.truck_id,
        )
        await truck.update({
            is_ready: true,
            center_id: shipment.receive_center
        })
    }
    return currShipmentState;
};








