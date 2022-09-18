import React, { useState } from "react";

export const LayoutContext = React.createContext({});

export const LayoutContextProvider = ({ children }: any) => {
  const [navbar_title, setNavbar_title] = useState(
    "Tela Inicial do Sistema de Manual"
  );
  return (
    <LayoutContext.Provider
      value={{ navbar_title: navbar_title, setNavbar_title: setNavbar_title }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
