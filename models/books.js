'use strict';
module.export = (sequelize, DataTypes) => {
    const Books = sequelize.define('Book', {
        title: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Title is required"
                }
            }
        },
        author: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Author is required"
                }
            }
        },
        genre: DataTypes.STRING,
        year: {
            type: DataTypes.INTEGER,
        }

    });
    return Books;
};