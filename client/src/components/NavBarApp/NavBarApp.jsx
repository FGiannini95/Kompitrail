import { Link } from "react-router-dom";

export const NavBarApp = ({ children }) => {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/search">Buscar</Link>
            </li>
            <li>
              <Link to="/profile">Perfil</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>{ children }</main>
    </>
  );
};
