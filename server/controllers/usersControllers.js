// const { response } = require("express");
const connection = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

{
  /*
    template example
    action = (req, res) => {
    #destructuring
    const {here what you need} = req.body
    #sql connection
    let sql = `SELECT * FROM user WHERE email = '${email}'`;
    connection.query(sql, (error, result) => {
      error
        ? res.status(500).json({ error });
        : res.status(200).json(result);
    });
    }
  */
}

class usersControllers {
  createUser = (req, res) => {
    const { name, lastname, email, password } = req.body;
    // Password incriptation
    let saltRounds = 8;
    bcrypt.genSalt(saltRounds, function (err, saltRounds) {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error al encriptar la contraseña", error: err });
        }
        let sql = `INSERT INTO user (name, lastname, email, password) VALUES ('${name}', '${lastname}', '${email}', '${hash}')`;
        connection.query(sql, (error, result) => {
          if (error) {
            // Handle error messages
            if (error.code === "ER_DUP_ENTRY") {
              return res
                .status(400)
                .json({ message: "El correo ya está en uso." });
            }
            return res
              .status(500)
              .json({ message: "Error al crear el usuario", error });
          }
          res.status(200).json({ message: "Usuario creado con éxito", result });
        });
      });
    });
  };

  loginUser = (req, res) => {
    const { email, password } = req.body;
    let sql = `SELECT * FROM user WHERE email= "${email}" and is_deleted = 0`;
    connection.query(sql, (err, result) => {
      if (err) return res.status(500).json(err);

      if (!result || result.length == 0) {
        res.status(401).json("Correo o contraseña incorrecta");
      } else {
        const user = result[0];
        const hash = user.password;

        bcrypt.compare(password, hash, (err, response) => {
          if (err) return res.status(500).json(err);

          if (response == true) {
            const token = jwt.sign(
              {
                user: {
                  user_id: user.user_id,
                },
              },
              process.env.SECRET,
              { expiresIn: "1d" }
            );

            res.status(200).json({ token, user });
          } else {
            res.status(401).json("Correo o contraseña incorrecta");
          }
        });
      }
    });
  };

  oneUser = (req, res) => {
    const { id: user_id } = req.params;
    let sql = `SELECT * FROM user WHERE user_id = ${user_id} AND is_deleted = 0`;
    connection.query(sql, (err, result) => {
      err ? res.status(400).json({ err }) : res.status(200).json(result[0]);
    });
  };

  deleteUser = (req, res) => {
    const { id: user_id } = req.params;
    let sql = `UPDATE user SET is_deleted = 1 WHERE user_id = "${user_id}"`;
    connection.query(sql, (err, result) => {
      err
        ? res.status(400).json({ err })
        : res.status(200).json({ message: "Usuario eliminado", result });
    });
  };

  editPassword = (req, res) => {
    console.log("Hola desde editPassword");
    const { id: user_id, password } = req.body;

    // We avoid nullable or undefined value
    if (!user_id || !password) {
      return res
        .status(400)
        .json({ message: "ID y contraseña son obligatorios" });
    }

    if (isNaN(user_id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // Password incriptation
    const saltRounds = 8;

    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error al generar el salt", error: err });
      }

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error al encriptar la contraseña", error: err });
        }

        const sqlUpdate = `UPDATE user SET password = "${hash}" WHERE user_id = "${user_id}" AND is_deleted = 0`;
        const values = [hash, user_id];

        console.log("Query ejecutado:", sqlUpdate, values);

        connection.query(sqlUpdate, values, (error, result) => {
          if (error) {
            return res
              .status(500)
              .json({ message: "Error al actualizar la contraseña", error });
          }

          // affectedRows is a property of result object. We use it to verify how many row we have modified in our table
          if (result.affectedRows === 0) {
            return res
              .status(404)
              .json({ message: "Usuario no encontrado o ya eliminado" });
          }

          res.status(200).json({ message: "Contraseña actualizada con éxito" });
        });
      });
    });
  };
}

module.exports = new usersControllers();
