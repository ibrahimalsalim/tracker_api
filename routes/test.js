
const express = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../config/database");
const { hashPassword } = require("../models/user");
const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const users = await User.findAll();

        for (const user of users) {
            const { id, password , email} = user;
console.log(id , "   " ,password.length);
            // console.log(user.toJSON());
            //     console.log(",");

            // if (password.length < 20) {

            //     const hashedPassword = await hashPassword(password);

            //     const isPasswordMatch = await bcrypt.compare(
            //         password,
            //         hashedPassword
            //     );

            //     console.log(id, password, hashedPassword, isPasswordMatch);
            //     await User.update({ password: hashedPassword }, { where: { id } });

                
            // }
        }
    } catch (error) {
        console.error('Error updating passwords:', error);
    }
    res.json({ m: "updatePasswords" })
});

module.exports = router;



// async function updatePasswords() {
//     try {
//         const users = await User.findAll();

//         for (const user of users) {
//             console.log(user);
//             const { id, password } = user;

//             if (password.length < 20) {

//                 const hashedPassword = await hashPassword(password);

//                 const isPasswordMatch = await bcrypt.compare(
//                     password,
//                     hashedPassword
//                 );


//                 console.log(id, password, hashedPassword, isPasswordMatch);
//                 // await User.update({ password: hashedPassword }, { where: { id } });
//             }
//         }

//         console.log('Passwords updated successfully');
//     } catch (error) {
//         console.error('Error updating passwords:', error);
//     }
//     res.json({ m: "updatePasswords" })
// }










