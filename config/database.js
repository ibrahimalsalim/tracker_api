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



ShipmentPriority.hasMany(Shipment, { foreignKey: 'shipment_priority_id' });
Shipment.belongsTo(ShipmentPriority, { foreignKey: 'shipment_priority_id' });

Cargo.hasMany(CargoContent, { foreignKey: 'cargo_id' });
CargoContent.belongsTo(Cargo, { foreignKey: 'cargo_id' });

ContentType.hasMany(CargoContent, { foreignKey: 'content_type_id' });
CargoContent.belongsTo(ContentType, { foreignKey: 'content_type_id' });

Shipment.hasMany(ShipmentState, { foreignKey: 'shipment_id' });
ShipmentState.belongsTo(Shipment, { foreignKey: 'shipment_id' });

State.hasMany(ShipmentState, { foreignKey: 'states_id' });
ShipmentState.belongsTo(State, { foreignKey: 'states_id' });

User.hasMany(Center, { foreignKey: 'manager' });
Center.belongsTo(User, { foreignKey: 'manager' });

Client.hasMany(Cargo, { foreignKey: 'sender_id', as: 'sender' });
Client.hasMany(Cargo, { foreignKey: 'receiver_id', as: 'receiver' });
Cargo.belongsTo(Client, { foreignKey: 'sender_id', as: 'sender' });
Cargo.belongsTo(Client, { foreignKey: 'receiver_id', as: 'receiver' });

Shipment.hasMany(Cargo, { foreignKey: 'shipment_id' });
Cargo.belongsTo(Shipment, { foreignKey: 'shipment_id' });

Center.hasMany(Shipment, { foreignKey: 'send_center', as: 'send' });
Center.hasMany(Shipment, { foreignKey: 'receive_center', as: 'receive' });
Shipment.belongsTo(Center, { foreignKey: 'send_center', as: 'send' });
Shipment.belongsTo(Center, { foreignKey: 'receive_center', as: 'receive' });

Truck.hasMany(Shipment, { foreignKey: 'truck_id' });
Shipment.belongsTo(Truck, { foreignKey: 'truck_id' });

Center.hasMany(Truck, { foreignKey: 'center_id' });
Truck.belongsTo(Center, { foreignKey: 'center_id' });

User.hasMany(Truck, { foreignKey: 'driver' });
Truck.belongsTo(User, { foreignKey: 'driver' });

UserType.hasMany(User, { foreignKey: 'type' });
User.belongsTo(UserType, { foreignKey: 'type' });

TruckType.hasMany(Truck, { foreignKey: 'type' });
Truck.belongsTo(TruckType, { foreignKey: 'type' });




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
    sequelize,
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
    await ContentType.bulkCreate([
        { type: 'clothes', description: 'Clothes, accessories, boxes , Documents ,...', price: 500 },
        { type: 'Electronic Devices', description: 'Mobile/Smartphones, Tv, Computer/Laptop, etc.', price: 2500 },
        { type: 'Fragile', description: 'Easy to break such as glasses.', price: 4000 },
        { type: 'Perishable', description: 'Perishable: Refers to items that spoil quickly and require refrigeration to stay fresh, such as meat, vegetables,fruits.', price: 5000 },

    ]);
    await ShipmentPriority.bulkCreate([
        { priority: "عادي", additional_wages: 0 },
        { priority: "مستعجل", additional_wages: 30 },
        { priority: "فوري", additional_wages: 50 },
    ]);
    await User.bulkCreate([{
        id: 1,
        type: 1,
        first_name: 'admin',
        last_name: 'admin',
        date_of_birth: '1985-05-17',
        address: 'admin',
        email: 'admin@gmail.com',
        username: 'admin',
        password: '$2a$10$f6FNO1U/bAu36yBhUyb0w.llmPZ6NZ9i8.Rck60vJOumd6iFtkfo6'
    }
        ,
    {
        id: 2,
        type: 2,
        first_name: 'Ahmed',
        last_name: 'Mansour',
        date_of_birth: '1985-06-15',
        address: '123 Aleppo Street',
        email: 'ahmed.mansour@gmail.com',
        username: 'ahmed_mansour',
        password: '$2a$10$vg5tyi82Pd0PBy8VHwN5Pet1IhaYlm3eFnW0Wy91igKrGezIrzXBq'
    }
        ,
    {
        id: 3,
        type: 2,
        first_name: 'Omar',
        last_name: 'Khalil',
        date_of_birth: '1988-11-23',
        address: '456 Damascus Avenue',
        email: 'omar.khalil@gmail.com',
        username: 'omar_khalil',
        password: '$2a$10$sZxKJFxOtm2FsfLlYnMV1eAjblchRktMBG8w81kNWo9meuMF/d0hm'
    }
        ,
    {
        id: 4,
        type: 2,
        first_name: 'Hassan',
        last_name: 'Nasser',
        date_of_birth: '1990-03-30',
        address: '789 Latakia Road',
        email: 'hassan.nasser@gmail.com',
        username: 'hassan_nasser',
        password: '$2a$10$G0nlvuABlrVT6aDv9H6rqOZ1uf5o5pfDDogGTlwIr1r6u.VpS7K8q'
    }
        ,
    {
        id: 5,
        type: 2,
        first_name: 'Yousef',
        last_name: 'Haddad',
        date_of_birth: '1992-07-05',
        address: '101 Homs Blvd',
        email: 'yousef.haddad@gmail.com',
        username: 'yousef_haddad',
        password: '$2a$10$zg.znQkMfWtiTIYLxcUX1OqrnHgoYyE5fE2oSi62gfCn8jhbRaayy'
    }
        ,
    {
        id: 6,
        type: 3,
        first_name: 'Rami',
        last_name: 'Al-Khatib',
        date_of_birth: '1987-01-15',
        address: '123 Elm St, Damascus, Syria',
        email: 'rami87@gmail.com',
        username: 'rami87',
        password: '$2a$10$HqVdn34Z8RP7ilcJBii6x.F60v0nsMgDRC06LTROq4HVdid9vUyta'
    }
        ,
    {
        id: 7,
        type: 3,
        first_name: 'Tarek',
        last_name: 'Mahmoud',
        date_of_birth: '1985-06-20',
        address: '456 Oak Ave, Aleppo, Syria',
        email: 'tarek85@gmail.com',
        username: 'tarek85',
        password: '$2a$10$a4DOqcsQK5o/R/GNKnFYu..v68IZ.SrMDPTnUHOxVGm2vlnilyX.G'
    }
        ,
    {
        id: 8,
        type: 3,
        first_name: 'Majd',
        last_name: 'Hassan',
        date_of_birth: '1983-11-12',
        address: '789 Maple Blvd, Homs, Syria',
        email: 'majd83@gmail.com',
        username: 'majd83',
        password: '$2a$10$F5Fy.SUt/Bk2fsaQ0i5PxOtK0/Ss6JT8ZelyvB9n6dg806ebKlhmW'
    }
        ,
    {
        id: 9,
        type: 3,
        first_name: 'Fadi',
        last_name: 'Ali',
        date_of_birth: '1980-08-25',
        address: '101 Pine St, Latakia, Syria',
        email: 'fadi80@gmail.com',
        username: 'fadi80',
        password: '$2a$10$fKzFChWO1Gf2GOY5zdk4puoloqTeo0XyEyr1CAZUMdNfbPTkcJbyq'
    }
        ,
    {
        id: 10,
        type: 3,
        first_name: 'Karim',
        last_name: 'Omar',
        date_of_birth: '1982-03-15',
        address: '555 Cedar Ave, Tartus, Syria',
        email: 'karim82@gmail.com',
        username: 'karim82',
        password: '$2a$10$oV8lsyNWtihYgH5./N1tc.x2C5EkQ5U6G.Wb0d4kfwv0LLXDcQE76'
    }
        ,
    {
        id: 11,
        type: 3,
        first_name: 'Bilal',
        last_name: 'Saeed',
        date_of_birth: '1985-09-18',
        address: '321 Elm St, Raqqa, Syria',
        email: 'bilal85@gmail.com',
        username: 'bilal85',
        password: '$2a$10$HhXOMegOVTVD1sDA6m8VhelDIss0Xp8/UA9OrMpYs/e9gfkgF9dse'
    }
        ,
    {
        id: 12,
        type: 3,
        first_name: 'Omar',
        last_name: 'Hassan',
        date_of_birth: '1978-12-25',
        address: '777 Cedar Blvd, Deir ez-Zor, S',
        email: 'omar78@gmail.com',
        username: 'omar78',
        password: '$2a$10$OWpIxV..DkNjMMZogBwwHuwAW5/Bog2fnqGh9m1dbi7fBjW5cR08S'
    }
        ,
    {
        id: 13,
        type: 3,
        first_name: 'Nabil',
        last_name: 'Khalil',
        date_of_birth: '1984-05-05',
        address: '888 Oak Rd, Al-Hasakah, Syria',
        email: 'nabil84@gmail.com',
        username: 'nabil84',
        password: '$2a$10$1U2l0EHuMA0w1Mf7vUXup.fyn0lVN0b/IAvr9i2iYG.4buiRTa/96'
    }
        ,
    {
        id: 14,
        type: 3,
        first_name: 'Raed',
        last_name: 'Saad',
        date_of_birth: '1981-07-12',
        address: '999 Pine Lane, Damascus, Syria',
        email: 'raed81@gmail.com',
        username: 'raed81',
        password: '$2a$10$WChjQX5eTx3CwE8jA3zqYePCeUR1XAwb5L5pwjGDnW/utW9sg4p6a'
    }
        ,
    {
        id: 15,
        type: 3,
        first_name: 'Khalid',
        last_name: 'Abdullah',
        date_of_birth: '1986-02-19',
        address: '123 Cedar Ave, Hama, Syria',
        email: 'khalid86@gmail.com',
        username: 'khalid86',
        password: '$2a$10$ayC8nC4lurtyuowk7GAymeWUuYEJ1HYHHfRDN3T4Kqkd7D.Detys2'
    }
        ,
    {
        id: 16,
        type: 3,
        first_name: 'Waleed',
        last_name: 'Fawzi',
        date_of_birth: '1979-09-08',
        address: '456 Elm Rd, Idlib, Syria',
        email: 'waleed79@gmail.com',
        username: 'waleed79',
        password: '$2a$10$FWtV81tf2oeqnbEEe4ER4u9AcbNXcX7eu3ciOHh6pUaiVz6jajY3e'
    }
        ,
    {
        id: 17,
        type: 3,
        first_name: 'Hassan',
        last_name: 'Omar',
        date_of_birth: '1989-01-22',
        address: '789 Maple Blvd, Daraa, Syria',
        email: 'hassan89@gmail.com',
        username: 'hassan89',
        password: '$2a$10$g9cz7VUjrzFZaY/Qr7LO.uHHdAdsMyqdiYTjBO2eHaUjU2g67NQGi'
    }
        ,
    {
        id: 18,
        type: 3,
        first_name: 'Abdullah',
        last_name: 'Karim',
        date_of_birth: '1983-04-17',
        address: '101 Pine Lane, Al-Qamishli, Sy',
        email: 'abdullah83@gmail.com',
        username: 'abdullah83',
        password: '$2a$10$tY/8ArcMiAOtIguHG8yUlOBLN4ySNGPTC9cs1nIxWY4ZVnnESiC1G'
    }
        ,
    {
        id: 19,
        type: 3,
        first_name: 'Tariq',
        last_name: 'Sami',
        date_of_birth: '1987-08-30',
        address: '555 Cedar St, As-Suwayda, Syri',
        email: 'tariq87@gmail.com',
        username: 'tariq87',
        password: '$2a$10$YKiVyl72hMlnjBa0aUKod.tH0WV5C4ZvhR7f/xMRBulGJTOUeVboG'
    }
        ,
    {
        id: 20,
        type: 3,
        first_name: 'Mohammed',
        last_name: 'Amin',
        date_of_birth: '1982-03-14',
        address: '321 Oak Blvd, Salamiyah, Syria',
        email: 'mohammed82@gmail.com',
        username: 'mohammed82',
        password: '$2a$10$I8IvZ6trqJYww7aEg0IWrOlDUQ7GzsL2I.09B3yDY3WliLhPDQ26C'
    }
        ,
    {
        id: 21,
        type: 3,
        first_name: 'Ali',
        last_name: 'Fathi',
        date_of_birth: '1984-10-05',
        address: '777 Elm Rd, Jaramana, Syria',
        email: 'ali84@gmail.com',
        username: 'ali84',
        password: '$2a$10$q9nI0Tt/B9Q2d1yZm/FcFuA4/mNSsBNNgIHneT5do/sJU78powW66'
    }
        ,
    {
        id: 22,
        type: 3,
        first_name: 'Bilal',
        last_name: 'Saeed',
        date_of_birth: '1980-06-18',
        address: '888 Maple Ave, Darayya, Syria',
        email: 'bilal80@gmail.com',
        username: 'bilal80',
        password: '$2a$10$tRvvtlIstPsc.kPf09i5Ue97wo0MeKgsKC377WQhMpC.8ofr79Y2m'
    }
        ,
    {
        id: 23,
        type: 3,
        first_name: 'Fadi',
        last_name: 'Najjar',
        date_of_birth: '1986-12-01',
        address: '999 Pine Blvd, Maarat al-Numan',
        email: 'fadi86@gmail.com',
        username: 'fadi86',
        password: '$2a$10$Py4Y9/wGT/wHof1teLH8IOVQpTw.DL8cCJ3Ix1yNFEG6OCZPSnSa.'
    }
        ,
    {
        id: 24,
        type: 3,
        first_name: 'Sami',
        last_name: 'Hamza',
        date_of_birth: '1981-07-24',
        address: '123 Oak St, Al-Bab, Syria',
        email: 'sami81@gmail.com',
        username: 'sami81',
        password: '$2a$10$IK7kKhbEeFxTK2nHPSA3JO/qrdwMaBGLlLSmI3rQe0PryL/TKRtSO'
    }
        ,
    {
        id: 25,
        type: 3,
        first_name: 'Ammar',
        last_name: 'Khalid',
        date_of_birth: '1985-02-17',
        address: '456 Cedar Rd, Azaz, Syria',
        email: 'ammar85@gmail.com',
        username: 'ammar85',
        password: '$2a$10$KxOiQVVpQ7PO2lQhmBd0RuvfgY7tTcF4OpRpIx4M785/Ru/ZfgmBO'
    }
        ,
    {
        id: 26,
        type: 3,
        first_name: 'Mahmoud',
        last_name: 'Farid',
        date_of_birth: '1978-09-10',
        address: '789 Oak Lane, Manbij, Syria',
        email: 'mahmoud78@gmail.com',
        username: 'mahmoud78',
        password: '$2a$10$mHN102ATH3hCuhzXTOdm8.YxYl9KUtAY5YbIqM4q0fMIcTnxVJqqa'
    }
        ,
    {
        id: 27,
        type: 3,
        first_name: 'Jamal',
        last_name: 'Hadi',
        date_of_birth: '1983-04-03',
        address: '101 Pine Ave, Afrin, Syria',
        email: 'jamal83@gmail.com',
        username: 'jamal83',
        password: '$2a$10$5QUD/XLErxXgb1lnH.dmPOLbsP76Jxzgja4x4MVhFRpsgfjxvLdRW'
    }
        ,
    {
        id: 28,
        type: 3,
        first_name: 'Mazen',
        last_name: 'Salem',
        date_of_birth: '1987-08-18',
        address: '555 Cedar Blvd, Al-Quṣayr, Syr',
        email: 'mazen87@gmail.com',
        username: 'mazen87',
        password: '$2a$10$XSXY96sk4OScXq7c7v69ZOr7GF/Z9.9t4xoRTV3oC.P4J9XptetQy'
    }
        ,
    {
        id: 29,
        type: 3,
        first_name: 'Kareem',
        last_name: 'Taha',
        date_of_birth: '1980-03-05',
        address: '321 Oak Rd, Darayya, Syria',
        email: 'kareem80@gmail.com',
        username: 'kareem80',
        password: '$2a$10$BD7M0Rd4j4y6DcG4sHRX8OMjAZcm8SICfjm8QmakQNJekqSt5BM3K'
    }
        ,
    {
        id: 30,
        type: 3,
        first_name: 'Ziad',
        last_name: 'Badawi',
        date_of_birth: '1984-09-30',
        address: '777 Elm St, Al-Hasakah, Syria',
        email: 'ziad84@gmail.com',
        username: 'ziad84',
        password: '$2a$10$/dc3cfoIovSjpUdlwJklqOU4M45VgOrZypFz7MFSgDUAngqIYoDVa'
    }
        ,
    {
        id: 31,
        type: 3,
        first_name: 'Hadi',
        last_name: 'Dagher',
        date_of_birth: '1988-11-28',
        address: '888 Pine Lane, Al-Rastan, Syri',
        email: 'hadi88@gmail.com',
        username: 'hadi88',
        password: '$2a$10$b6mho.T7XWqo5I4vofBWSeLLeq7WjdKs3iikMfm9GQmSeh24lxlKi'
    }
        ,
    {
        id: 32,
        type: 3,
        first_name: 'Tamer',
        last_name: 'Khaled',
        date_of_birth: '1981-06-15',
        address: '999 Oak St, Jableh, Syria',
        email: 'tamer81@gmail.com',
        username: 'tamer81',
        password: '$2a$10$Ok4.EpZPBu140gsrytRw1.g/rp/HiOhC6qXEF.ThSkAVBrNuK/1qC'
    }
        ,
    {
        id: 33,
        type: 3,
        first_name: 'Khaled',
        last_name: 'Adel',
        date_of_birth: '1985-09-02',
        address: '123 Cedar Ave, Abu Kamal, Syri',
        email: 'khaled85@gmail.com',
        username: 'khaled85',
        password: '$2a$10$KKUmcK8h3MFqkz6XBZVixe.2THWf0zoEnA4HeB3AZ6XLPnUNxq//y'
    }
        ,
    {
        id: 34,
        type: 3,
        first_name: 'Samir',
        last_name: 'Fawaz',
        date_of_birth: '1979-04-19',
        address: '456 Elm Rd, Al-Suqaylabiyah, S',
        email: 'samir79@gmail.com',
        username: 'samir79',
        password: '$2a$10$9fCw1j0ZwVmRQomCRI9n..kJvSqgfBcYU5M5jiSuheUSk2dnWhnhi'
    }
        ,
    {
        id: 35,
        type: 3,
        first_name: 'Ammar',
        last_name: 'Saad',
        date_of_birth: '1983-10-25',
        address: '789 Maple Blvd, Al-Safira, Syr',
        email: 'ammar83@gmail.com',
        username: 'ammar83',
        password: '$2a$10$bhG01tU1Sf4G/AiI/nTFmeuaIikrVbR8Dg.TK/7GdWwF/VNi1ueVG'
    }
        ,
    {
        id: 36,
        type: 3,
        first_name: 'Youssef',
        last_name: 'Riad',
        date_of_birth: '1987-05-08',
        address: '101 Pine Lane, Qatana, Syria',
        email: 'youssef87@gmail.com',
        username: 'youssef87',
        password: '$2a$10$RpAWovpYrHhIGqvQp07IvO54EMDEC5NzGhRF6rTpet0T.7yQDEqji'
    }
        ,
    {
        id: 37,
        type: 3,
        first_name: 'Kamal',
        last_name: 'Ali',
        date_of_birth: '1982-02-14',
        address: '555 Cedar St, Al-Salamiyah, Sy',
        email: 'kamal82@gmail.com',
        username: 'kamal82',
        password: '$2a$10$1mqhW0whT2ZweqQQTai9M.NPjRnyJS.0q1pB7pmQDubn/awkKQGeO'
    }
        ,
    {
        id: 38,
        type: 3,
        first_name: 'Hazem',
        last_name: 'Mustafa',
        date_of_birth: '1984-07-21',
        address: '321 Oak Blvd, Al-Malikiyah, Sy',
        email: 'hazem84@gmail.com',
        username: 'hazem84',
        password: '$2a$10$SG5qke0cTYuoOqvvFYK/de9MbOoHCarSWj.A22BXrisC3gLNL7.s2'
    }
        ,
    {
        id: 39,
        type: 3,
        first_name: 'Ahmad',
        last_name: 'Jamal',
        date_of_birth: '1980-12-03',
        address: '777 Elm St, Al-Qamishli, Syria',
        email: 'ahmad80@gmail.com',
        username: 'ahmad80',
        password: '$2a$10$gTXRxpgrdaXW8zk.l5Nn4eYwlPOd5LMq44E/7KhiEt35H40qRissa'
    }
        ,
    {
        id: 40,
        type: 3,
        first_name: 'Riad',
        last_name: 'Hassan',
        date_of_birth: '1986-08-16',
        address: '888 Maple Ave, Al-Qusayr, Syri',
        email: 'riad86@gmail.com',
        username: 'riad86',
        password: '$2a$10$yv0Lm4cHOK8lXPFIfgy5lerccmsAE2kx3tcG4M25aayZxbx5FBTLO'
    }
        ,
    {
        id: 41,
        type: 3,
        first_name: 'Hussein',
        last_name: 'Khalid',
        date_of_birth: '1978-03-09',
        address: '999 Pine Blvd, Salamiyah, Syri',
        email: 'hussein78@gmail.com',
        username: 'hussein78',
        password: '$2a$10$8vuh5ylYeb5Xi/2N4ncqoOYAlZjIs.nYwYSn1GUsqUf4Dmtgp0dRO'
    }
        ,
    {
        id: 42,
        type: 3,
        first_name: 'Faisal',
        last_name: 'Nasser',
        date_of_birth: '1981-10-12',
        address: '123 Oak St, Azaz, Syria',
        email: 'faisal81@gmail.com',
        username: 'faisal81',
        password: '$2a$10$E3JXoj/Va84ONattbGGjoufZ1LiAuFsn3KdOZug0x8GGxcuyNO3em'
    }
        ,
    {
        id: 43,
        type: 3,
        first_name: 'Omar',
        last_name: 'Ibrahim',
        date_of_birth: '1985-04-27',
        address: '456 Cedar Rd, Daraa, Syria',
        email: 'omar85@gmail.com',
        username: 'omar85',
        password: '$2a$10$/ZksIJEc6hTPJE5.dwepPeV7MrDUe4xZCKjtdyS2a8p39WdlCrgti'
    }
        ,
    {
        id: 44,
        type: 3,
        first_name: 'Yassin',
        last_name: 'Ali',
        date_of_birth: '1979-11-08',
        address: '789 Oak Lane, Al-Tabqah, Syria',
        email: 'yassin79@gmail.com',
        username: 'yassin79',
        password: '$2a$10$yRmx3347J5xL4fqKPIfdEu/MR96VQT7wktOHSRm4tKIYWx5YtFpR6'
    }
        ,
    {
        id: 45,
        type: 3,
        first_name: 'Ammar',
        last_name: 'Kareem',
        date_of_birth: '1983-06-05',
        address: '101 Pine Ave, As-Suwayda, Syri',
        email: 'ammar83@gmail.com',
        username: 'ammar83',
        password: '$2a$10$dRL91eFH7xlQjKM9W0KdQ.t/T13W7A/Tmk6lNhoEyyHIgnQc9nJ/m'
    }
        ,
    {
        id: 46,
        type: 3,
        first_name: 'Mazen',
        last_name: 'Rami',
        date_of_birth: '1987-01-25',
        address: '555 Cedar Blvd, Al-Bab, Syria',
        email: 'mazen87@gmail.com',
        username: 'mazen87',
        password: '$2a$10$o5lw5NErEFrwAswCF5PgE.vNBnlKJNZLjjps6WGH66nh6ik9Fbny6'
    }
        ,
    {
        id: 47,
        type: 3,
        first_name: 'Hassan',
        last_name: 'Adnan',
        date_of_birth: '1980-07-18',
        address: '321 Elm St, Al-Suqaylabiyah, S',
        email: 'hassan80@gmail.com',
        username: 'hassan80',
        password: '$2a$10$VZ.7R2eK5pZNI1od0cvb8u1fdlWe/CDODmNH7QC/hfn74FgysTtou'
    }
        ,
    {
        id: 48,
        type: 3,
        first_name: 'Abdullah',
        last_name: 'Fadi',
        date_of_birth: '1984-12-01',
        address: '777 Cedar Blvd, Al-Safira, Syr',
        email: 'abdullah84@gmail.com',
        username: 'abdullah84',
        password: '$2a$10$tDRdrQI/b.oKc4bTNQzqzOrft/EIH7hh6ie2p5/r3Q8X7R8vSQ.LC'
    }
        ,
    {
        id: 49,
        type: 3,
        first_name: 'Tariq',
        last_name: 'Rami',
        date_of_birth: '1981-08-24',
        address: '888 Oak Rd, Qamishli, Syria',
        email: 'tariq81@gmail.com',
        username: 'tariq81',
        password: '$2a$10$g1o4jbm5lZZtSqvx2tFUxengtpOd9ZgF6LXHB7eAxL.qyuSWHDibO'
    }
        ,
    {
        id: 50,
        type: 3,
        first_name: 'Mohammed',
        last_name: 'Khalid',
        date_of_birth: '1986-03-17',
        address: '999 Pine Lane, Hama, Syria',
        email: 'mohammed86@gmail.com',
        username: 'mohammed86',
        password: '$2a$10$sCQZsRNv8LhmOr0DXgTfce0jiYExCunqTy55/angvHExYjt2M6xVi'
    }
        ,
    {
        id: 51,
        type: 3,
        first_name: 'Ali',
        last_name: 'Fahed',
        date_of_birth: '1978-10-30',
        address: '123 Cedar Ave, Al-Hasakah, Syr',
        email: 'ali78@gmail.com',
        username: 'ali78',
        password: '$2a$10$AiStBbM0ZGS6r8x3MSlQ9evJVn487ow9zr.2EeyOsooDc1nWMJjZi'
    }
        ,
    {
        id: 52,
        type: 3,
        first_name: 'Bilal',
        last_name: 'Hassan',
        date_of_birth: '1982-05-15',
        address: '456 Elm Rd, Afrin, Syria',
        email: 'bilal82@gmail.com',
        username: 'bilal82',
        password: '$2a$10$BF1B5g0fIAi03a9y8fc.aO4Csb.gnhtBsWdBcug3AvFrJ9zQuiqdK'
    }
        ,
    {
        id: 53,
        type: 3,
        first_name: 'Fadi',
        last_name: 'Sami',
        date_of_birth: '1984-12-18',
        address: '789 Maple Blvd, Al-Qamishli, S',
        email: 'fadi84@gmail.com',
        username: 'fadi84',
        password: '$2a$10$ApFNiH6veUQjJfUltYDPdOPvzX7bntYhLeU524koG8lJmGbxttY9O'
    }
        ,
    {
        id: 54,
        type: 3,
        first_name: 'Sami',
        last_name: 'Karim',
        date_of_birth: '1980-06-01',
        address: '101 Pine Lane, Darayya, Syria',
        email: 'sami80@gmail.com',
        username: 'sami80',
        password: '$2a$10$1sBCFnYmqliHDghnuiQp0OUlXxoEX5v/4wGnf1JRBhpG3HPnJSQKi'
    }
        ,
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
    await Truck.bulkCreate([
        {
            driver: 6,
            center_id: 1,
            type: 2,
            model: "volvo FH16 2020",
            is_ready: true
        },
        {
            driver: 7,
            center_id: 1,
            type: 1,
            model: "scania R730 2021",
            is_ready: true,
        },
        {
            driver: 8,
            center_id: 1,
            type: 1,
            model: "mercedes Actros 2019",
            is_ready: true
        },
        {
            driver: 9,
            center_id: 1,
            type: 2,
            model: "iveco S-Way 2022"
        },
        {
            driver: 10,
            center_id: 1,
            type: 1,
            model: "man TGX 2020"
        },
        {
            driver: 11,
            center_id: 1,
            type: 1,
            model: "renault T480 2023"
        },
        {
            driver: 12,
            center_id: 1,
            type: 2,
            model: "daf XF 106 2017"
        },
        {
            driver: 13,
            center_id: 1,
            type: 1,
            model: "volvo FH12 2018"
        },
        {
            driver: 14,
            center_id: 1,
            type: 1,
            model: "scania S730 2021"
        },
        {
            driver: 15,
            center_id: 1,
            type: 2,
            model: "mercedes Actros 2019"
        },
        {
            driver: 16,
            center_id: 1,
            type: 1,
            model: "iveco S-Way 2022"
        },
        {
            driver: 17,
            center_id: 1,
            type: 1,
            model: "man TGX 2020"
        },
        {
            driver: 18,
            center_id: 2,
            type: 2,
            model: "renault T480 2023"
        },
        {
            driver: 19,
            center_id: 2,
            type: 1,
            model: "daf XF 106 2017"
        },
        {
            driver: 20,
            center_id: 2,
            type: 1,
            model: "volvo FH16 2020"
        },
        {
            driver: 21,
            center_id: 2,
            type: 2,
            model: "scania R730 2021"
        },
        {
            driver: 22,
            center_id: 2,
            type: 1,
            model: "mercedes Actros 2019"
        },
        {
            driver: 23,
            center_id: 2,
            type: 1,
            model: "iveco S-Way 2022"
        },
        {
            driver: 24,
            center_id: 2,
            type: 2,
            model: "man TGX 2020"
        },
        {
            driver: 25,
            center_id: 2,
            type: 1,
            model: "renault T480 2023"
        },
        {
            driver: 26,
            center_id: 2,
            type: 1,
            model: "daf XF 106 2017"
        },
        {
            driver: 27,
            center_id: 2,
            type: 2,
            model: "volvo FH16 2020"
        },
        {
            driver: 28,
            center_id: 2,
            type: 1,
            model: "scania R730 2021"
        },
        {
            driver: 29,
            center_id: 2,
            type: 1,
            model: "mercedes Actros 2019"
        },
        {
            driver: 30,
            center_id: 3,
            type: 2,
            model: "iveco S-Way 2022"
        },
        {
            driver: 31,
            center_id: 3,
            type: 1,
            model: "man TGX 2020"
        },
        {
            driver: 32,
            center_id: 3,
            type: 1,
            model: "renault T480 2023"
        },
        {
            driver: 33,
            center_id: 3,
            type: 2,
            model: "daf XF 106 2017"
        },
        {
            driver: 34,
            center_id: 3,
            type: 1,
            model: "volvo FH16 2020"
        },
        {
            driver: 35,
            center_id: 3,
            type: 1,
            model: "scania R730 2021"
        },
        {
            driver: 36,
            center_id: 3,
            type: 2,
            model: "mercedes Actros 2019"
        },
        {
            driver: 37,
            center_id: 3,
            type: 1,
            model: "iveco S-Way 2022"
        },
        {
            driver: 38,
            center_id: 3,
            type: 1,
            model: "man TGX 2020"
        },
        {
            driver: 39,
            center_id: 3,
            type: 2,
            model: "renault T480 2023"
        },
        {
            driver: 40,
            center_id: 3,
            type: 1,
            model: "daf XF 106 2017"
        },
        {
            driver: 41,
            center_id: 3,
            type: 1,
            model: "volvo FH16 2020"
        },
        {
            driver: 42,
            center_id: 4,
            type: 2,
            model: "scania R730 2021"
        },
        {
            driver: 43,
            center_id: 4,
            type: 1,
            model: "mercedes Actros 2019"
        },
        {
            driver: 44,
            center_id: 4,
            type: 1,
            model: "iveco S-Way 2022"
        },
        {
            driver: 45,
            center_id: 4,
            type: 2,
            model: "man TGX 2020"
        },
        {
            driver: 46,
            center_id: 4,
            type: 1,
            model: "renault T480 2023"
        },
        {
            driver: 47,
            center_id: 4,
            type: 1,
            model: "daf XF 106 2017"
        },
        {
            driver: 48,
            center_id: 4,
            type: 2,
            model: "volvo FH16 2020"
        },
        {
            driver: 49,
            center_id: 4,
            type: 1,
            model: "scania R730 2021"
        },
        {
            driver: 50,
            center_id: 4,
            type: 1,
            model: "mercedes Actros 2019"
        },
        {
            driver: 51,
            center_id: 4,
            type: 2,
            model: "iveco S-Way 2022"
        },
        {
            driver: 52,
            center_id: 4,
            type: 1,
            model: "man TGX 2020"
        },
        {
            driver: 53,
            center_id: 4,
            type: 1,
            model: "renault T480 2023"
        }
    ]);
    await Shipment.bulkCreate([
        { truck_id: 1, shipment_priority_id: 1, send_center: 1, receive_center: 2 },
        { truck_id: 2, shipment_priority_id: 2, send_center: 1, receive_center: 3 },
        { truck_id: 3, shipment_priority_id: 3, send_center: 1, receive_center: 4 },
        { truck_id: 4, shipment_priority_id: 1, send_center: 1, receive_center: 2 },
        { truck_id: 5, shipment_priority_id: 2, send_center: 1, receive_center: 3 },
        { truck_id: 6, shipment_priority_id: 3, send_center: 1, receive_center: 4 },
        { truck_id: 7, shipment_priority_id: 1, send_center: 1, receive_center: 2 },
        { truck_id: 8, shipment_priority_id: 2, send_center: 1, receive_center: 3 },

        { truck_id: 13, shipment_priority_id: 1, send_center: 2, receive_center: 1 },
        { truck_id: 14, shipment_priority_id: 2, send_center: 2, receive_center: 3 },
        { truck_id: 15, shipment_priority_id: 3, send_center: 2, receive_center: 4 },
        { truck_id: 16, shipment_priority_id: 1, send_center: 2, receive_center: 1 },
        { truck_id: 17, shipment_priority_id: 2, send_center: 2, receive_center: 3 },
        { truck_id: 18, shipment_priority_id: 3, send_center: 2, receive_center: 4 },
        { truck_id: 19, shipment_priority_id: 1, send_center: 2, receive_center: 1 },
        { truck_id: 20, shipment_priority_id: 2, send_center: 2, receive_center: 3 },

        { truck_id: 25, shipment_priority_id: 1, send_center: 3, receive_center: 1 },
        { truck_id: 26, shipment_priority_id: 2, send_center: 3, receive_center: 2 },
        { truck_id: 27, shipment_priority_id: 3, send_center: 3, receive_center: 4 },
        { truck_id: 28, shipment_priority_id: 1, send_center: 3, receive_center: 1 },
        { truck_id: 29, shipment_priority_id: 2, send_center: 3, receive_center: 2 },
        { truck_id: 30, shipment_priority_id: 3, send_center: 3, receive_center: 4 },
        { truck_id: 31, shipment_priority_id: 1, send_center: 3, receive_center: 1 },
        { truck_id: 32, shipment_priority_id: 2, send_center: 3, receive_center: 2 },

        { truck_id: 37, shipment_priority_id: 1, send_center: 4, receive_center: 1 },
        { truck_id: 38, shipment_priority_id: 2, send_center: 4, receive_center: 2 },
        { truck_id: 39, shipment_priority_id: 3, send_center: 4, receive_center: 3 },
        { truck_id: 40, shipment_priority_id: 1, send_center: 4, receive_center: 1 },
        { truck_id: 41, shipment_priority_id: 2, send_center: 4, receive_center: 2 },
        { truck_id: 42, shipment_priority_id: 3, send_center: 4, receive_center: 3 },
        { truck_id: 43, shipment_priority_id: 1, send_center: 4, receive_center: 1 },
        { truck_id: 44, shipment_priority_id: 2, send_center: 4, receive_center: 2 }
    ]);
    await ShipmentState.bulkCreate([
        // Shipment 1
        { shipment_id: 1, states_id: 1, start_date: '2024-02-05', end_date: '2024-02-10' },
        { shipment_id: 1, states_id: 2, start_date: '2024-02-11', end_date: '2024-02-15' },
        { shipment_id: 1, states_id: 3, start_date: '2024-02-16', end_date: '2024-02-20' },

        // Shipment 2
        { shipment_id: 2, states_id: 1, start_date: '2024-03-12', end_date: '2024-03-15' },
        { shipment_id: 2, states_id: 2, start_date: '2024-03-16', end_date: '2024-03-18' },
        { shipment_id: 2, states_id: 3, start_date: '2024-03-19', end_date: '2024-03-22' },

        // Shipment 3
        { shipment_id: 3, states_id: 1, start_date: '2024-04-01', end_date: '2024-04-03' },
        { shipment_id: 3, states_id: 2, start_date: '2024-04-04', end_date: '2024-04-07' },
        { shipment_id: 3, states_id: 3, start_date: '2024-04-08', end_date: '2024-04-12' },

        // Shipment 4
        { shipment_id: 4, states_id: 1, start_date: '2024-04-15', end_date: '2024-04-18' },
        { shipment_id: 4, states_id: 2, start_date: '2024-04-19', end_date: '2024-04-22' },
        { shipment_id: 4, states_id: 3, start_date: '2024-04-23', end_date: '2024-04-26' },

        // Shipment 5
        { shipment_id: 5, states_id: 1, start_date: '2024-05-02', end_date: '2024-05-06' },
        { shipment_id: 5, states_id: 2, start_date: '2024-05-07', end_date: '2024-05-10' },
        { shipment_id: 5, states_id: 3, start_date: '2024-05-11', end_date: '2024-05-14' },

        // Shipment 6
        { shipment_id: 6, states_id: 1, start_date: '2024-05-15', end_date: '2024-05-18' },
        { shipment_id: 6, states_id: 2, start_date: '2024-05-19', end_date: '2024-05-22' },
        { shipment_id: 6, states_id: 3, start_date: '2024-05-23', end_date: '2024-05-26' },

        // Shipment 7
        { shipment_id: 7, states_id: 1, start_date: '2024-06-01', end_date: '2024-06-04' },
        { shipment_id: 7, states_id: 2, start_date: '2024-06-05', end_date: '2024-06-08' },
        { shipment_id: 7, states_id: 3, start_date: '2024-06-09', end_date: '2024-06-12' },

        // Shipment 8
        { shipment_id: 8, states_id: 1, start_date: '2024-06-10', end_date: '2024-06-13' },
        { shipment_id: 8, states_id: 2, start_date: '2024-06-14', end_date: '2024-06-17' },
        { shipment_id: 8, states_id: 3, start_date: '2024-06-18', end_date: '2024-06-21' }
    ]);
    await Cargo.bulkCreate([
        // Shipment 1
        {
            shipment_id: 1,
            sender_id: 1,
            receiver_id: 2,
            state: "Received"
        },
        {
            shipment_id: 1,
            sender_id: 1,
            receiver_id: 3,
            state: "Received"
        },
        {
            shipment_id: 1,
            sender_id: 2,
            receiver_id: 4,
            state: "Received"
        },
        {
            shipment_id: 1,
            sender_id: 2,
            receiver_id: 5,
            state: "Received"
        },
        {
            shipment_id: 1,
            sender_id: 3,
            receiver_id: 6,
            state: "Received"
        },
        {
            shipment_id: 1,
            sender_id: 3,
            receiver_id: 7,
            state: "Received"
        },
        {
            shipment_id: 1,
            sender_id: 4,
            receiver_id: 8,
            state: "Received"
        },
        {
            shipment_id: 1,
            sender_id: 4,
            receiver_id: 9,
            state: "Received"
        },
        {
            shipment_id: 1,
            sender_id: 5,
            receiver_id: 10,
            state: "Received"
        },
        {
            shipment_id: 1,
            sender_id: 5,
            receiver_id: 11,
            state: "Received"
        },

        // Shipment 2
        {
            shipment_id: 2,
            sender_id: 6,
            receiver_id: 12,
            state: "Received"
        },
        {
            shipment_id: 2,
            sender_id: 6,
            receiver_id: 13,
            state: "Received"
        },
        {
            shipment_id: 2,
            sender_id: 7,
            receiver_id: 14,
            state: "Received"
        },
        {
            shipment_id: 2,
            sender_id: 7,
            receiver_id: 15,
            state: "Received"
        },
        {
            shipment_id: 2,
            sender_id: 8,
            receiver_id: 16,
            state: "Received"
        },
        {
            shipment_id: 2,
            sender_id: 8,
            receiver_id: 17,
            state: "Received"
        },
        {
            shipment_id: 2,
            sender_id: 9,
            receiver_id: 18,
            state: "Received"
        },
        {
            shipment_id: 2,
            sender_id: 9,
            receiver_id: 19,
            state: "Received"
        },
        {
            shipment_id: 2,
            sender_id: 10,
            receiver_id: 20,
            state: "Received"
        },
        {
            shipment_id: 2,
            sender_id: 10,
            receiver_id: 21,
            state: "Received"
        },

        // Shipment 3
        {
            shipment_id: 3,
            sender_id: 11,
            receiver_id: 22,
            state: "Received"
        },
        {
            shipment_id: 3,
            sender_id: 11,
            receiver_id: 23,
            state: "Received"
        },
        {
            shipment_id: 3,
            sender_id: 12,
            receiver_id: 24,
            state: "Received"
        },
        {
            shipment_id: 3,
            sender_id: 12,
            receiver_id: 25,
            state: "Received"
        },
        {
            shipment_id: 3,
            sender_id: 13,
            receiver_id: 26,
            state: "Received"
        },
        {
            shipment_id: 3,
            sender_id: 13,
            receiver_id: 27,
            state: "Received"
        },
        {
            shipment_id: 3,
            sender_id: 14,
            receiver_id: 28,
            state: "Received"
        },
        {
            shipment_id: 3,
            sender_id: 14,
            receiver_id: 29,
            state: "Received"
        },
        {
            shipment_id: 3,
            sender_id: 15,
            receiver_id: 30,
            state: "Received"
        },
        {
            shipment_id: 3,
            sender_id: 15,
            receiver_id: 31,
            state: "Received"
        },

        // Shipment 4
        {
            shipment_id: 4,
            sender_id: 16,
            receiver_id: 32,
            state: "Received"
        },
        {
            shipment_id: 4,
            sender_id: 16,
            receiver_id: 33,
            state: "Received"
        },
        {
            shipment_id: 4,
            sender_id: 17,
            receiver_id: 34,
            state: "Received"
        },
        {
            shipment_id: 4,
            sender_id: 17,
            receiver_id: 35,
            state: "Not Received"
        },
        {
            shipment_id: 4,
            sender_id: 18,
            receiver_id: 36,
            state: "Received"
        },
        {
            shipment_id: 4,
            sender_id: 18,
            receiver_id: 37,
            state: "Received"
        },
        {
            shipment_id: 4,
            sender_id: 19,
            receiver_id: 38,
            state: "Not Received"
        },
        {
            shipment_id: 4,
            sender_id: 19,
            receiver_id: 39,
            state: "Received"
        },
        {
            shipment_id: 4,
            sender_id: 20,
            receiver_id: 40,
            state: "Received"
        },
        {
            shipment_id: 4,
            sender_id: 20,
            receiver_id: 41,
            state: "Received"
        }
    ]
    );
};
