import { createContext, useState } from "react";
import useFetchData from "../utils/useFetchData";

export const ApiContext: any = createContext([])

export const ApiContextBuilder = ({ children }: any) => {

  const companies: any = useFetchData("/construtoras/list", "GET")
  const empreendimentos: any = useFetchData("/empreendimentos", "GET")


  return (
    <ApiContext.Provider value={{ c: companies, e: empreendimentos }}>
      {children}
    </ApiContext.Provider>
  )
}