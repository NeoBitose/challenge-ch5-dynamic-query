const { where, Op } = require("sequelize");
const { Users } = require("../models");

const findUsers = async (req, res, next) => {
  try {
    const { name, age, address, role, page = 1, limit = 10 } = req.query;
    // user condition
    const userCondition = {};
    if (name) userCondition.name = { [Op.iLike]: `%${name}%` }
    if (address) userCondition.address = { [Op.iLike]: `%${address}%` }
    if (role) userCondition.role = { [Op.iLike]: `%${role}%` }
    if (age) userCondition.age = age

    // setting offset
    const offset = (page - 1) * limit;

    const users = await Users.findAndCountAll({
      attributes: ["id", "name", "age", "address", "role"],
      where: userCondition,
      limit: limit,
      offset: offset
    });

    // count data shop 
    const totalData = users.count;
    // count total page
    const totalPages = Math.ceil(totalData / limit);

    res.status(200).json({
      message: "Success get users data",
      isSuccess: true,
      status: "Success",
      data: {
        totalData,
        totalPages,
        currentPage: page,
        users: users.rows
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
      isSuccess: false,
      data: null,
    });
  }
};

const findUserById = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (err) { }
};

const updateUser = async (req, res, next) => {
  const { name, age, role, address, shopId } = req.body;
  try {
    await Users.update(
      {
        name,
        age,
        role,
        address,
        shopId,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({
      status: "Success",
      message: "sukses update user",
    });
  } catch (err) { }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });

    await Users.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "sukses delete user",
    });
  } catch (err) { }
};

module.exports = {
  findUsers,
  findUserById,
  updateUser,
  deleteUser,
};
