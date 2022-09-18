import { useContext } from "react";
import { LayoutContext } from "../../context/LayoutContext";
import "./navbar.scss";

const Navbar = () => {
  const layoutContext: any = useContext(LayoutContext);

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="navbar-conteiner-left">
          <h2>{layoutContext.navbar_title}</h2>
        </div>
        <div className="navbar-container-right">
          <p>
            Gabriel<span> Guerreiro</span>
          </p>
          <img
            src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
            className="avatar"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
