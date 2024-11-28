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
     let sql = SELECT * FROM user WHERE email = '${email}';
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
    //password incriptation
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

  googleLogin = async (req, res) => {
    const { email, given_name, family_name, picture } = req.body;

    console.log("Google login request body:", req.body);

    try {
      // Generate a default password as Google login does not provide one
      const defaultPassword = await bcrypt.hash("defaultPassword123", 10);

      // Check if the user already exists in the database
      const sqlSelect = `SELECT * FROM user WHERE email = "${email}" AND is_deleted = 0`;
      connection.query(sqlSelect, (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error searching for user", error: err });
        }

        // Helper function to generate response
        const generateResponse = (user, token) => ({
          token,
          user: {
            user_id: user.user_id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            img: user.img,
          },
        });

        if (result.length === 0) {
          // If no user exists, insert a new user into the database
          const sqlInsert = `
            INSERT INTO user (name, lastname, email, img, password)
            VALUES ("${given_name}", "${family_name}", "${email}", "${picture}", "${defaultPassword}")
          `;
          connection.query(sqlInsert, (errInsert, resultInsert) => {
            if (errInsert) {
              return res.status(500).json({
                message: "Error inserting user",
                error: errInsert,
              });
            }

            // Generate token for the new user
            const token = jwt.sign(
              { user: { user_id: resultInsert.insertId } },
              process.env.SECRET,
              { expiresIn: "1d" }
            );

            // Respond with the token and user details
            return res.status(200).json(
              generateResponse(
                {
                  user_id: resultInsert.insertId,
                  name: given_name,
                  lastname: family_name,
                  email,
                  img: picture,
                },
                token
              )
            );
          });
        } else {
          // If user already exists, generate a token for the existing user
          const user = result[0];
          const token = jwt.sign(
            { user: { user_id: user.user_id } },
            process.env.SECRET,
            { expiresIn: "1d" }
          );

          // Respond with the token and user details
          return res.status(200).json(generateResponse(user, token));
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "Unexpected error", error });
    }
  };
}

module.exports = new usersControllers();
