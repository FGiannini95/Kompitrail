import { Link } from "react-router-dom";

export const NavBarApp = ({ children }) => {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/home">Inicio</Link>  {/*Cambiar a / */}
            </li>
            <li>
              <Link to="/search">Buscar</Link>
            </li>
            <li>
              <Link to="/profile">Perfil</Link>
            </li>
            <li>
              <Link to="/register">Registro</Link>
            </li>
            <li>
              <Link to="/">Landing</Link>   {/*Cambiar a /landing */}
            </li>
          </ul>
        </nav>
      </header>

      <main>{ children }</main>
    </>
  );
};
