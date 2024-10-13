const connection = require("../config/db");
const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");

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
}

module.exports = new usersControllers();
