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
    //validación con libreria PTE
    //encriptación de la contraseña
    let saltRounds = 8;
    bcrypt.genSalt(saltRounds, function (err, saltRounds) {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
          console.log(err);
        } else {
          let sql = `INSERT INTO user (name, lastname, email, password) VALUES ('${name}', '${lastname}', '${email}', '${hash}')`;
          connection.query(sql, (error, result) => {
            error
              ? res.status(500).json({ error }, console.log(error))
              : res.status(200).json(result);
          });
        }
      });
    });
  };

  loginUser = (req, res) => {
    const { email, password } = req.body;
    let sql = `SELECT * FROM user WHERE email= "${email}"`;
    connection.query(sql, (err, result) => {
      if (err) return res.status(500).json(err);

      if (!result || result.length == 0) {
        res.status(401).json("Email no existe");
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
            res.status(401).json("Email o contraseña incorrecta");
          }
          console.log("responseee", response);
        });
      }
    });
  };

  oneUser = (req, res) => {
    const user_id = req.params.id;
    let sql = `SELECT * FROM user WHERE user_id = ${user_id} AND is_deleted = 0`;
    connection.query(sql, (err, result) => {
      err ? res.status(400).json({ err }) : res.status(200).json(result[0]);
    });
  };
}

module.exports = new usersControllers();
