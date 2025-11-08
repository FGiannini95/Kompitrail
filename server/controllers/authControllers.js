const connection = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

class authControllers {
  authGoogle = async (req, res) => {
    const { id_token: idToken } = req.body;
    console.log("id_token", idToken);

    // 1. Check we receive the token from the FE
    if (!idToken) {
      return res.status(400).json({ message: "Google token no disponible" });
    }
    // Check that the BE has the correct config
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Error en la configuración" });
    }
    if (!process.env.SECRET) {
      return res.status(500).json({ message: "Error en la configuración" });
    }

    try {
      // 2.Verify token authencity
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      // It has to be signed by Google, not expired and for our audience
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      // Extract the payload
      const payload = ticket.getPayload();

      // 3. Extract user info
      const {
        email,
        email_verified: emailVerified,
        given_name: givenName = "",
        family_name: familyName = "",
        picture = null,
      } = payload || {};

      if (emailVerified === false) {
        return res
          .status(401)
          .json({ message: "Correo de Google no verificado" });
      }

      // 4. Format data for FE
      const formatUser = (row) => ({
        user_id: row.user_id,
        name: row.name,
        lastname: row.lastname,
        email: row.email,
        img: row.img,
        is_deleted: row.is_deleted,
      });

      // 5. Create a JWT token
      const generateToken = (userId) => {
        return jwt.sign(
          {
            user: { user_id: userId },
          },
          process.env.SECRET,
          { expiresIn: "1d" }
        );
      };

      // 6. Check if there is already an user with that email
      const selectSql = `SELECT * FROM user WHERE email = ? AND is_deleted=0 LIMIT 1`;
      connection.query(selectSql, [email], (selectErr, selectResult) => {
        if (selectErr) {
          return res
            .status(500)
            .json({ message: "Error al buscar usuario", error: selectErr });
        }

        // If user exist, we process that info and send back to the FE
        if (selectResult && selectResult.length > 0) {
          const existingUser = selectResult[0];

          // Decide if we should update the picture or not depending on the origin
          const hasNoPhoto =
            !existingUser.img || existingUser.img.trim() === "";
          const isGooglePhoto = existingUser.img?.includes(
            "googleusercontent.com"
          );
          const shouldUpdatePhoto = (hasNoPhoto || isGooglePhoto) && picture;

          if (shouldUpdatePhoto) {
            const updateSql = `UPDATE user SET img = ? WHERE user_id = ?`;
            connection.query(
              updateSql,
              [picture, existingUser.user_id],
              (updateErr, updateResult) => {
                if (updateErr) {
                  console.err(
                    "Error actualizando la imagen de Google",
                    updateErr
                  );
                } else {
                  console.log(
                    "Foto de Google actualizada con éxito para el user_id:",
                    existingUser.user_id
                  );
                }
              }
            );

            existingUser.img = picture;
          } else {
            console.log("El usuario tiene una foto personalizada");
          }

          const token = generateToken(existingUser.user_id);

          return res.status(200).json({
            token,
            user: formatUser(existingUser),
          });
        }

        // If no user, we generate a new password (in the db is NOT NULL)
        const randomPassword = crypto.randomBytes(32).toString("hex");
        const saltRounds = 8;
        bcrypt.hash(randomPassword, saltRounds, (hashErr, hashedPassword) => {
          if (hashErr) {
            return res.status(500).json({
              message: "Error al encriptar la contraseña",
              error: hashErr,
            });
          }
          // Insert new user
          const insertSql = `INSERT INTO user (name, lastname, email, img, password) VALUES (?, ?, ?, ? ,?)`;
          const insertValues = [
            givenName,
            familyName,
            email,
            picture,
            hashedPassword,
          ];

          connection.query(
            insertSql,
            insertValues,
            (insertErr, insertResult) => {
              if (insertErr) {
                return res.status(500).json({
                  message: "Error al crear el usuario",
                  error: insertErr,
                });
              }
              const newUser = {
                user_id: insertResult.insertId,
                name: givenName,
                lastname: familyName,
                email,
                img: picture,
                is_deleted: 0,
              };

              const token = generateToken(newUser.user_id);

              return res.status(200).json({
                token,
                user: formatUser(newUser),
              });
            }
          );
        });
      });
    } catch (error) {
      console.error("Error de autenticación con Google", error);
      return res
        .status(400)
        .json({ message: "Token invalido o expirado", error: error.message });
    }
  };

  authApple = (req, res) => {
    console.log("hi from apple auth");
  };
}

module.exports = new authControllers();
