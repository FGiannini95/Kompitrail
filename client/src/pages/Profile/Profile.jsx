import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getLocalStorage } from "../../helpers/localStorageUtils";

export const Profile = () => {
  const [motorbikesAnalytics, setMotorbikesAnalytics] = useState();
  const tokenLocalStorage = getLocalStorage("token");

  useEffect(() => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    axios
      .get(`http://localhost:3000/motorbikes/motorbikes-analytics/${user_id}`)
      .then((res) => {
        setMotorbikesAnalytics(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <p>La primera parte es muy muy similar a la de infoUser</p>
      <p>
        En esta sección tiene que aparecer un cuadro con todas las estadisticas:
        motos, rutas creadas, rutas en las que has participado
      </p>
      <ul>
        <li>Número de motos: {motorbikesAnalytics?.total_motorbikes}</li>
        <li>Rutas creadas: </li>
        <li>Rutas participada:</li>
      </ul>
      <button>Modificar perfil</button>
      <button>Premium</button>
      <p>
        la opción de elegir entre rutas creadas y ruta participadas (habrá un
        pequeñoi resumen con la info más importante)
      </p>
      <p>el listado de las mismas. Si no hay ruta, icono más mensaje</p>
      {/* import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined'; */}
    </div>
  );
};
