// 'use strict';
// module.export = (sequelize, DataTypes) => {
//     const Books = sequelize.define('Book', {
//         title: {
//             type: DataTypes.STRING,
//             validate: {
//                 notEmpty: {
//                     msg: "Title is required"
//                 }
//             }
//         },
//         author: {
//             type: DataTypes.STRING,
//             validate: {
//                 notEmpty: {
//                     msg: "Author is required"
//                 }
//             }
//         },
//         genre: DataTypes.STRING,
//         year: {
//             type: DataTypes.INTEGER,
//         }

//     });
//     return Books;
// };
"use strict";
module.exports = (sequelize, DataTypes) => {
    const Books = sequelize.define("Book", {
        title: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            }
        },
        author: {
            type: DataTypes.STRING
        },
        genre: DataTypes.STRING,
        year: DataTypes.INTEGER
    });
    return Books;
};