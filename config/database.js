const { Sequelize, DataTypes } = require('sequelize');

const { CargoContentModel } = require('../models/cargocontent');
const { ShipmentPriorityModel } = require('../models/shipmentpriority');
const { ShipmentStateModel } = require('../models/shipmentstate');
const { CenterModel } = require('../models/center');
const { ClientModel } = require('../models/client');
const { CargoModel } = require('../models/cargo');
const { ContentTypeModel } = require('../models/contenttype');
const { ShipmentModel } = require('../models/shipment');
const { StateModel } = require('../models/state');
const { TruckModel } = require('../models/truck');
const { UserModel } = require('../models/user');
const { UserTypeModel } = require('../models/usertype');
const { TruckTypeModel } = require('../models/trucktype');

// Create Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        define: {
            timestamps: false,
            freezeTableName: true
        }
    });


const CargoContent = CargoContentModel(sequelize);
const ShipmentPriority = ShipmentPriorityModel(sequelize);
const ShipmentState = ShipmentStateModel(sequelize);
const Center = CenterModel(sequelize);
const Client = ClientModel(sequelize);
const Cargo = CargoModel(sequelize);
const ContentType = ContentTypeModel(sequelize);
const Shipment = ShipmentModel(sequelize);
const State = StateModel(sequelize);
const Truck = TruckModel(sequelize);
const User = UserModel(sequelize);
const UserType = UserTypeModel(sequelize);
const TruckType = TruckTypeModel(sequelize);



ShipmentPriority.hasMany(Shipment, { foreignKey: 'shipment_priority', as: 'Shipment' });
Shipment.belongsTo(ShipmentPriority, { foreignKey: 'shipment_priority', as: 'ShipmentPriority' });

Cargo.hasMany(CargoContent, { foreignKey: 'cargo_id', as: 'CargoContents' });
CargoContent.belongsTo(Cargo, { foreignKey: 'cargo_id', as: 'Cargo' });

ContentType.hasMany(CargoContent, { foreignKey: 'content_type_id', as: 'CargoContents' });
CargoContent.belongsTo(ContentType, { foreignKey: 'content_type_id', as: 'ContentType' });

Shipment.hasMany(ShipmentState, { foreignKey: 'shipment_id', as: 'ShipmentStates' });
ShipmentState.belongsTo(Shipment, { foreignKey: 'shipment_id', as: 'Shipment' });

State.hasMany(ShipmentState, { foreignKey: 'states_id', as: 'ShipmentStates' });
ShipmentState.belongsTo(State, { foreignKey: 'states_id', as: 'State' });

User.hasMany(Center, { foreignKey: 'manager', as: 'Centers' });
Center.belongsTo(User, { foreignKey: 'manager', as: 'User' });
Client.hasMany(Cargo, { foreignKey: 'sender_id', as: 'SentCargos' });
Client.hasMany(Cargo, { foreignKey: 'receiver_id', as: 'ReceivedCargos' });

Cargo.belongsTo(Client, { foreignKey: 'sender_id', as: 'sClient' });
Cargo.belongsTo(Client, { foreignKey: 'receiver_id', as: 'rClient' });

Shipment.hasMany(Cargo, { foreignKey: 'shipment_id', as: 'Cargos' });
Cargo.belongsTo(Shipment, { foreignKey: 'shipment_id', as: 'Shipment' });

Center.hasMany(Shipment, { foreignKey: 'send_center', as: 'SentShipments' });

Center.hasMany(Shipment, { foreignKey: 'recieve_center', as: 'ReceivedShipments' });

Shipment.belongsTo(Center, { foreignKey: 'send_center', as: 'sCenter' });
Shipment.belongsTo(Center, { foreignKey: 'recieve_center', as: 'rCenter' });

Truck.hasMany(Shipment, { foreignKey: 'truck_id', as: 'Shipments' });
Shipment.belongsTo(Truck, { foreignKey: 'truck_id', as: 'Truck' });

User.hasMany(Truck, { foreignKey: 'driver', as: 'Trucks' });
Truck.belongsTo(User, { foreignKey: 'driver', as: 'User' });

UserType.hasMany(User, { foreignKey: 'type', as: 'Users' });
User.belongsTo(UserType, { foreignKey: 'type', as: 'UserType' });

TruckType.hasMany(Truck, { foreignKey: 'type', as: 'Trucks' });
Truck.belongsTo(TruckType, { foreignKey: 'type', as: 'TruckType' });




const testconnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testconnection();

const Meta = sequelize.define('Meta', {
    key: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

(async () => {
    try {
        await sequelize.sync();
        console.log('Meta table synchronized successfully.');

        // Check if the sync has already been run
        const syncMeta = await Meta.findOne({ where: { key: 'databaseSync' } });

        if (!syncMeta) {
            // Run the synchronization for other models
            await sequelize.sync({ alter: true });
            console.log('Database synchronized successfully.');

            await insertInitialData();
            await Meta.create({ key: 'databaseSync', value: 'true' });
            console.log('Initial data inserted successfully');

        } else {
            console.log('Database synchronization already performed.');
        }
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
})();


module.exports = {
    CargoContent,
    ShipmentPriority,
    ShipmentState,
    Center,
    Client,
    Cargo,
    ContentType,
    Shipment,
    State,
    Truck,
    User,
    UserType,
    TruckType
}

const insertInitialData = async () => {
    await UserType.bulkCreate([
        { type: 'admin' },
        { type: 'manager' },
        { type: 'driver' }
    ]);
    await TruckType.bulkCreate([
        { type: 'Truck' },
        { type: 'Refrigerated Truck' },
    ]);
    await User.bulkCreate([
        {
            type: 1,
            first_name: 'admin',
            last_name: 'admin',
            date_of_birth: '1985-05-17',
            address: 'admin',
            email: 'admin@gmail.com',
            username: 'admin',
            password: '$2a$10$f6FNO1U/bAu36yBhUyb0w.llmPZ6NZ9i8.Rck60vJOumd6iFtkfo6'
        },
        {
            type: "2",
            first_name: "Ahmed",
            last_name: "Mansour",
            date_of_birth: "1985-06-15",
            address: "123 Aleppo Street",
            email: "ahmed.mansour@gmail.com",
            username: "ahmed_mansour",
            password: "$2a$10$vg5tyi82Pd0PBy8VHwN5Pet1IhaYlm3eFnW0Wy91igKrGezIrzXBq"
        }, {
            type: "2",
            first_name: "Omar",
            last_name: "Khalil",
            date_of_birth: "1988-11-23",
            address: "456 Damascus Avenue",
            email: "omar.khalil@gmail.com",
            username: "omar_khalil",
            password: "$2a$10$sZxKJFxOtm2FsfLlYnMV1eAjblchRktMBG8w81kNWo9meuMF/d0hm"
        }, {
            type: "2",
            first_name: "Hassan",
            last_name: "Nasser",
            date_of_birth: "1990-03-30",
            address: "789 Latakia Road",
            email: "hassan.nasser@gmail.com",
            username: "hassan_nasser",
            password: "$2a$10$G0nlvuABlrVT6aDv9H6rqOZ1uf5o5pfDDogGTlwIr1r6u.VpS7K8q"
        }, {
            type: "2",
            first_name: "Yousef",
            last_name: "Haddad",
            date_of_birth: "1992-07-05",
            address: "101 Homs Blvd",
            email: "yousef.haddad@gmail.com",
            username: "yousef_haddad",
            password: "$2a$10$zg.znQkMfWtiTIYLxcUX1OqrnHgoYyE5fE2oSi62gfCn8jhbRaayy"
        },
        {
            type: 3,
            first_name: 'driver',
            last_name: 'driver',
            date_of_birth: '1999-05-17',
            address: 'driver',
            email: 'driver@gmail.com',
            username: 'driver',
            password: '$2a$10$lqOtytijmhYemcQjwgH8Qu4P4vMa2RQvttNCNxAUTGw.yOy68bBMq'
        }
    ]);
    await State.bulkCreate([
        { state: 'يتم التحميل' },
        { state: 'جاهز للانطلاق' },
        { state: 'في الطريق' },
        { state: 'تم الوصول' }
    ]);
    await Center.bulkCreate([
        { manager: 3, city: 'Damascus', location: 'Damascus Center Location' },
        { manager: 2, city: 'Aleppo', location: 'Aleppo Center Location' },
        { manager: 5, city: 'Homs', location: 'Homs Center Location' },
        { manager: 4, city: 'Latakia', location: 'Latakia Center Location' }
    ]);
    await Client.bulkCreate([
        {
            national_id: '12345678901',
            first_name: 'Omar',
            last_name: 'Al-Khalid',
            date_of_birth: '1985-07-13',
            address: '123 Elm St, Damascus, Syria',
            phone_number: '963912345678'
        },
        {
            national_id: '23456789012',
            first_name: 'Sara',
            last_name: 'Al-Fayed',
            date_of_birth: '1990-08-21',
            address: '456 Maple St, Aleppo, Syria',
            phone_number: '963921234567'
        },
        {
            national_id: '34567890123',
            first_name: 'Hassan',
            last_name: 'Al-Hussein',
            date_of_birth: '1978-05-30',
            address: '789 Oak St, Homs, Syria',
            phone_number: '963931234567'
        },
        {
            national_id: '45678901234',
            first_name: 'Laila',
            last_name: 'Al-Masri',
            date_of_birth: '1983-12-25',
            address: '321 Pine St, Latakia, Syria',
            phone_number: '963941234567'
        },
        {
            national_id: '56789012345',
            first_name: 'Mahmoud',
            last_name: 'Al-Amin',
            date_of_birth: '1995-03-15',
            address: '654 Cedar St, Tartus, Syria',
            phone_number: '963951234567'
        },
        {
            national_id: '67890123456',
            first_name: 'Yasmin',
            last_name: 'Al-Bakri',
            date_of_birth: '1989-11-20',
            address: '987 Cypress St, Raqqa, Syria',
            phone_number: '963961234567'
        },
        {
            national_id: '78901234567',
            first_name: 'Karim',
            last_name: 'Al-Najjar',
            date_of_birth: '1992-04-10',
            address: '123 Fir St, Deir ez-Zor, Syria',
            phone_number: '963971234567'
        },
        {
            national_id: '89012345678',
            first_name: 'Aisha',
            last_name: 'Al-Hindi',
            date_of_birth: '1986-09-29',
            address: '456 Juniper St, Qamishli, Syria',
            phone_number: '963981234567'
        },
        {
            national_id: '90123456789',
            first_name: 'Fadi',
            last_name: 'Al-Zein',
            date_of_birth: '1993-06-05',
            address: '789 Willow St, Daraa, Syria',
            phone_number: '963991234567'
        },
        {
            national_id: '01234567890',
            first_name: 'Rana',
            last_name: 'Al-Khatib',
            date_of_birth: '1980-10-12',
            address: '321 Palm St, Hama, Syria',
            phone_number: '963902345678'
        },
        {
            national_id: '11223344556',
            first_name: 'Tamer',
            last_name: 'Al-Qudsi',
            date_of_birth: '1982-05-22',
            address: '654 Ash St, Idlib, Syria',
            phone_number: '963912345679'
        },
        {
            national_id: '22334455667',
            first_name: 'Lina',
            last_name: 'Al-Fayez',
            date_of_birth: '1997-01-15',
            address: '987 Sycamore St, As-Suwayda, Syria',
            phone_number: '963922345678'
        },
        {
            national_id: '33445566778',
            first_name: 'Said',
            last_name: 'Al-Rifai',
            date_of_birth: '1984-08-08',
            address: '321 Cedar St, Damascus, Syria',
            phone_number: '963932345678'
        },
        {
            national_id: '44556677889',
            first_name: 'Maya',
            last_name: 'Al-Khayat',
            date_of_birth: '1990-12-25',
            address: '456 Walnut St, Aleppo, Syria',
            phone_number: '963942345678'
        },
        {
            national_id: '55667788990',
            first_name: 'Kamal',
            last_name: 'Al-Mansour',
            date_of_birth: '1987-07-09',
            address: '789 Maple St, Homs, Syria',
            phone_number: '963952345678'
        },
        {
            national_id: '66778899001',
            first_name: 'Nour',
            last_name: 'Al-Jundi',
            date_of_birth: '1995-05-23',
            address: '321 Elm St, Latakia, Syria',
            phone_number: '963962345678'
        },
        {
            national_id: '77889900112',
            first_name: 'Ziad',
            last_name: 'Al-Hamwi',
            date_of_birth: '1986-11-18',
            address: '654 Oak St, Tartus, Syria',
            phone_number: '963972345678'
        },
        {
            national_id: '88990011223',
            first_name: 'Rami',
            last_name: 'Al-Qasim',
            date_of_birth: '1991-01-12',
            address: '987 Pine St, Raqqa, Syria',
            phone_number: '963982345678'
        },
        {
            national_id: '99001122334',
            first_name: 'Salim',
            last_name: 'Al-Bakir',
            date_of_birth: '1974-04-25',
            address: '123 Cedar St, Deir ez-Zor, Syria',
            phone_number: '963992345678'
        },
        {
            national_id: '00112233445',
            first_name: 'Layla',
            last_name: 'Al-Kabir',
            date_of_birth: '1993-03-18',
            address: '456 Fir St, Qamishli, Syria',
            phone_number: '963902345679'
        },
        {
            national_id: '11223344556',
            first_name: 'Nidal',
            last_name: 'Al-Hasan',
            date_of_birth: '1980-06-30',
            address: '789 Juniper St, Daraa, Syria',
            phone_number: '963912345680'
        },
        {
            national_id: '22334455667',
            first_name: 'Dina',
            last_name: 'Al-Fakhouri',
            date_of_birth: '1987-09-03',
            address: '321 Spruce St, Hama, Syria',
            phone_number: '963922345679'
        },
        {
            national_id: '33445566778',
            first_name: 'Samir',
            last_name: 'Al-Saadi',
            date_of_birth: '1990-11-26',
            address: '654 Poplar St, Idlib, Syria',
            phone_number: '963932345679'
        },
        {
            national_id: '44556677889',
            first_name: 'Hala',
            last_name: 'Al-Husari',
            date_of_birth: '1989-01-19',
            address: '987 Ash St, As-Suwayda, Syria',
            phone_number: '963942345679'
        },
        {
            national_id: '55667788990',
            first_name: 'Amal',
            last_name: 'Al-Naimi',
            date_of_birth: '1992-08-22',
            address: '123 Elm St, Damascus, Syria',
            phone_number: '963952345679'
        },
        {
            national_id: '66778899001',
            first_name: 'Bassam',
            last_name: 'Al-Daher',
            date_of_birth: '1977-12-30',
            address: '456 Maple St, Aleppo, Syria',
            phone_number: '963962345679'
        },
        {
            national_id: '77889900112',
            first_name: 'Raghad',
            last_name: 'Al-Mudallal',
            date_of_birth: '1985-10-22',
            address: '789 Oak St, Homs, Syria',
            phone_number: '963972345679'
        },
        {
            national_id: '88990011223',
            first_name: 'Ayman',
            last_name: 'Al-Hilal',
            date_of_birth: '1990-12-05',
            address: '321 Pine St, Latakia, Syria',
            phone_number: '963982345679'
        },
        {
            national_id: '99001122334',
            first_name: 'Marwan',
            last_name: 'Al-Hindi',
            date_of_birth: '1973-02-28',
            address: '654 Cedar St, Tartus, Syria',
            phone_number: '963992345679'
        },
        {
            national_id: '00112233445',
            first_name: 'Nour',
            last_name: 'Al-Jundi',
            date_of_birth: '1997-09-15',
            address: '987 Cypress St, Raqqa, Syria',
            phone_number: '963902345680'
        },
        {
            national_id: '11223344556',
            first_name: 'Jalal',
            last_name: 'Al-Khatib',
            date_of_birth: '1982-07-08',
            address: '123 Fir St, Deir ez-Zor, Syria',
            phone_number: '963912345681'
        },
        {
            national_id: '22334455667',
            first_name: 'Suha',
            last_name: 'Al-Razi',
            date_of_birth: '1995-05-23',
            address: '456 Juniper St, Qamishli, Syria',
            phone_number: '963922345680'
        },
        {
            national_id: '33445566778',
            first_name: 'Qusay',
            last_name: 'Al-Majid',
            date_of_birth: '1986-11-18',
            address: '789 Willow St, Daraa, Syria',
            phone_number: '963932345680'
        },
        {
            national_id: '44556677889',
            first_name: 'Rami',
            last_name: 'Al-Qassim',
            date_of_birth: '1991-01-12',
            address: '321 Palm St, Hama, Syria',
            phone_number: '963942345680'
        },
        {
            national_id: '55667788990',
            first_name: 'Layla',
            last_name: 'Al-Kabir',
            date_of_birth: '1974-04-25',
            address: '654 Ash St, Idlib, Syria',
            phone_number: '963952345680'
        },
        {
            national_id: '66778899001',
            first_name: 'Hisham',
            last_name: 'Al-Fayez',
            date_of_birth: '1993-03-18',
            address: '987 Sycamore St, As-Suwayda, Syria',
            phone_number: '963962345680'
        },
        {
            national_id: '77889900112',
            first_name: 'Huda',
            last_name: 'Al-Masri',
            date_of_birth: '1980-06-30',
            address: '321 Cedar St, Damascus, Syria',
            phone_number: '963972345680'
        },
        {
            national_id: '88990011223',
            first_name: 'Yasser',
            last_name: 'Al-Rifai',
            date_of_birth: '1987-09-03',
            address: '456 Walnut St, Aleppo, Syria',
            phone_number: '963982345680'
        },
        {
            national_id: '99001122334',
            first_name: 'Mona',
            last_name: 'Al-Khayat',
            date_of_birth: '1990-11-26',
            address: '789 Maple St, Homs, Syria',
            phone_number: '963992345680'
        },
        {
            national_id: '00112233445',
            first_name: 'Ibrahim',
            last_name: 'Al-Amin',
            date_of_birth: '1989-01-19',
            address: '321 Elm St, Latakia, Syria',
            phone_number: '963902345681'
        },
        {
            national_id: '11223344556',
            first_name: 'Amina',
            last_name: 'Al-Bakri',
            date_of_birth: '1992-08-22',
            address: '456 Maple St, Aleppo, Syria',
            phone_number: '963912345682'
        },
        {
            national_id: '22334455667',
            first_name: 'Bilal',
            last_name: 'Al-Mansour',
            date_of_birth: '1977-12-30',
            address: '789 Oak St, Homs, Syria',
            phone_number: '963922345681'
        },
        {
            national_id: '33445566778',
            first_name: 'Hala',
            last_name: 'Al-Daher',
            date_of_birth: '1985-10-22',
            address: '321 Pine St, Latakia, Syria',
            phone_number: '963932345681'
        },
        {
            national_id: '44556677889',
            first_name: 'Marwan',
            last_name: 'Al-Hindi',
            date_of_birth: '1990-12-05',
            address: '654 Cedar St, Tartus, Syria',
            phone_number: '963942345681'
        },
        {
            national_id: '55667788990',
            first_name: 'Nour',
            last_name: 'Al-Jundi',
            date_of_birth: '1973-02-28',
            address: '987 Cypress St, Raqqa, Syria',
            phone_number: '963952345681'
        },
        {
            national_id: '66778899001',
            first_name: 'Zaid',
            last_name: 'Al-Qudsi',
            date_of_birth: '1997-09-15',
            address: '123 Fir St, Deir ez-Zor, Syria',
            phone_number: '963962345681'
        },
        {
            national_id: '77889900112',
            first_name: 'Hisham',
            last_name: 'Al-Razi',
            date_of_birth: '1982-07-08',
            address: '456 Juniper St, Qamishli, Syria',
            phone_number: '963972345681'
        },
        {
            national_id: '88990011223',
            first_name: 'Nada',
            last_name: 'Al-Saadi',
            date_of_birth: '1995-05-23',
            address: '789 Willow St, Daraa, Syria',
            phone_number: '963982345681'
        },
        {
            national_id: '99001122334',
            first_name: 'Ghadir',
            last_name: 'Al-Hasan',
            date_of_birth: '1986-11-18',
            address: '321 Palm St, Hama, Syria',
            phone_number: '963992345681'
        },
        {
            national_id: '00112233445',
            first_name: 'Omar',
            last_name: 'Al-Masri',
            date_of_birth: '1991-01-12',
            address: '654 Ash St, Idlib, Syria',
            phone_number: '963902345682'
        },
        {
            national_id: '11223344556',
            first_name: 'Sara',
            last_name: 'Al-Fayez',
            date_of_birth: '1974-04-25',
            address: '987 Sycamore St, As-Suwayda, Syria',
            phone_number: '963912345683'
        },
        {
            national_id: '22334455667',
            first_name: 'Hassan',
            last_name: 'Al-Hussein',
            date_of_birth: '1993-03-18',
            address: '321 Cedar St, Damascus, Syria',
            phone_number: '963922345682'
        },
        {
            national_id: '33445566778',
            first_name: 'Laila',
            last_name: 'Al-Fakhouri',
            date_of_birth: '1980-06-30',
            address: '456 Walnut St, Aleppo, Syria',
            phone_number: '963932345682'
        },
        {
            national_id: '44556677889',
            first_name: 'Mahmoud',
            last_name: 'Al-Naimi',
            date_of_birth: '1987-09-03',
            address: '789 Maple St, Homs, Syria',
            phone_number: '963942345682'
        },
        {
            national_id: '55667788990',
            first_name: 'Yasmin',
            last_name: 'Al-Rifai',
            date_of_birth: '1990-11-26',
            address: '321 Elm St, Latakia, Syria',
            phone_number: '963952345682'
        },
        {
            national_id: '66778899001',
            first_name: 'Karim',
            last_name: 'Al-Khayat',
            date_of_birth: '1989-01-19',
            address: '456 Maple St, Aleppo, Syria',
            phone_number: '963962345682'
        },
        {
            national_id: '77889900112',
            first_name: 'Aisha',
            last_name: 'Al-Mudallal',
            date_of_birth: '1992-08-22',
            address: '789 Oak St, Homs, Syria',
            phone_number: '963972345682'
        },
        {
            national_id: '88990011223',
            first_name: 'Fadi',
            last_name: 'Al-Hilal',
            date_of_birth: '1977-12-30',
            address: '321 Pine St, Latakia, Syria',
            phone_number: '963982345682'
        },
        {
            national_id: '99001122334',
            first_name: 'Rana',
            last_name: 'Al-Hindi',
            date_of_birth: '1985-10-22',
            address: '654 Cedar St, Tartus, Syria',
            phone_number: '963992345682'
        },
        {
            national_id: '00112233445',
            first_name: 'Tamer',
            last_name: 'Al-Zein',
            date_of_birth: '1990-12-05',
            address: '987 Cypress St, Raqqa, Syria',
            phone_number: '963902345683'
        },
        {
            national_id: '11223344556',
            first_name: 'Lina',
            last_name: 'Al-Jundi',
            date_of_birth: '1973-02-28',
            address: '123 Fir St, Deir ez-Zor, Syria',
            phone_number: '963912345684'
        },
        {
            national_id: '22334455667',
            first_name: 'Said',
            last_name: 'Al-Qudsi',
            date_of_birth: '1997-09-15',
            address: '456 Juniper St, Qamishli, Syria',
            phone_number: '963922345683'
        },
        {
            national_id: '33445566778',
            first_name: 'Maya',
            last_name: 'Al-Razi',
            date_of_birth: '1982-07-08',
            address: '789 Willow St, Daraa, Syria',
            phone_number: '963932345683'
        },
        {
            national_id: '44556677889',
            first_name: 'Samir',
            last_name: 'Al-Saadi',
            date_of_birth: '1995-05-23',
            address: '321 Palm St, Hama, Syria',
            phone_number: '963942345683'
        },
        {
            national_id: '55667788990',
            first_name: 'Hala',
            last_name: 'Al-Hasan',
            date_of_birth: '1986-11-18',
            address: '654 Ash St, Idlib, Syria',
            phone_number: '963952345683'
        },
        {
            national_id: '66778899001',
            first_name: 'Amal',
            last_name: 'Al-Fayez',
            date_of_birth: '1991-01-12',
            address: '987 Sycamore St, As-Suwayda, Syria',
            phone_number: '963962345683'
        },
        {
            national_id: '77889900112',
            first_name: 'Bassam',
            last_name: 'Al-Khayat',
            date_of_birth: '1980-06-30',
            address: '321 Cedar St, Damascus, Syria',
            phone_number: '963972345683'
        },
        {
            national_id: '88990011223',
            first_name: 'Raghad',
            last_name: 'Al-Naimi',
            date_of_birth: '1987-09-03',
            address: '456 Walnut St, Aleppo, Syria',
            phone_number: '963982345683'
        },
        {
            national_id: '99001122334',
            first_name: 'Ayman',
            last_name: 'Al-Rifai',
            date_of_birth: '1990-11-26',
            address: '789 Maple St, Homs, Syria',
            phone_number: '963992345683'
        },
        {
            national_id: '00112233445',
            first_name: 'Salim',
            last_name: 'Al-Khayat',
            date_of_birth: '1989-01-19',
            address: '321 Elm St, Latakia, Syria',
            phone_number: '963902345684'
        },
        {
            national_id: '11223344556',
            first_name: 'Layla',
            last_name: 'Al-Mudallal',
            date_of_birth: '1992-08-22',
            address: '456 Maple St, Aleppo, Syria',
            phone_number: '963912345685'
        },
        {
            national_id: '22334455667',
            first_name: 'Nidal',
            last_name: 'Al-Hilal',
            date_of_birth: '1977-12-30',
            address: '789 Oak St, Homs, Syria',
            phone_number: '963922345684'
        },
        {
            national_id: '33445566778',
            first_name: 'Dina',
            last_name: 'Al-Jundi',
            date_of_birth: '1985-10-22',
            address: '321 Pine St, Latakia, Syria',
            phone_number: '963932345684'
        },
        {
            national_id: '44556677889',
            first_name: 'Samir',
            last_name: 'Al-Fayez',
            date_of_birth: '1990-12-05',
            address: '654 Cedar St, Tartus, Syria',
            phone_number: '963942345684'
        },
        {
            national_id: '55667788990',
            first_name: 'Hala',
            last_name: 'Al-Khayat',
            date_of_birth: '1973-02-28',
            address: '987 Cypress St, Raqqa, Syria',
            phone_number: '963952345684'
        },
        {
            national_id: '66778899001',
            first_name: 'Amal',
            last_name: 'Al-Masri',
            date_of_birth: '1997-09-15',
            address: '123 Fir St, Deir ez-Zor, Syria',
            phone_number: '963962345684'
        },
        {
            national_id: '77889900112',
            first_name: 'Bassam',
            last_name: 'Al-Mudallal',
            date_of_birth: '1982-07-08',
            address: '456 Juniper St, Qamishli, Syria',
            phone_number: '963972345684'
        },
        {
            national_id: '88990011223',
            first_name: 'Raghad',
            last_name: 'Al-Razi',
            date_of_birth: '1995-05-23',
            address: '789 Willow St, Daraa, Syria',
            phone_number: '963982345684'
        },
        {
            national_id: '99001122334',
            first_name: 'Ayman',
            last_name: 'Al-Saadi',
            date_of_birth: '1986-11-18',
            address: '321 Palm St, Hama, Syria',
            phone_number: '963992345684'
        },
        {
            national_id: '00112233445',
            first_name: 'Layla',
            last_name: 'Al-Hasan',
            date_of_birth: '1991-01-12',
            address: '654 Ash St, Idlib, Syria',
            phone_number: '963902345685'
        },
        {
            national_id: '11223344556',
            first_name: 'Nidal',
            last_name: 'Al-Fayez',
            date_of_birth: '1974-04-25',
            address: '987 Sycamore St, As-Suwayda, Syria',
            phone_number: '963912345686'
        },
        {
            national_id: '22334455667',
            first_name: 'Dina',
            last_name: 'Al-Rifai',
            date_of_birth: '1993-03-18',
            address: '321 Cedar St, Damascus, Syria',
            phone_number: '963922345685'
        }
    ]);
    await ShipmentPriority.bulkCreate([
        { priority: "عادي", additional_wages: 0 },
        { priority: "مستعجل", additional_wages: 30 },
        { priority: "فوري", additional_wages: 50 },
    ]);
    await ContentType.bulkCreate([
        { type: 'clothes', description: 'Clothes, accessories, boxes , Documents ,...', price: 500 },
        { type: 'Electronic Devices', description: 'Mobile/Smartphones, Tv, Computer/Laptop, etc.', price: 2500 },
        { type: 'Fragile', description: 'Easy to break such as glasses.', price: 4000 },
        { type: 'Perishable', description: 'Perishable: Refers to items that spoil quickly and require refrigeration to stay fresh, such as meat, vegetables,fruits.', price: 5000 },

    ]);
};
