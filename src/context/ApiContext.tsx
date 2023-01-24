import { createContext, useState } from "react";
import useFetchData from "../utils/useFetchData";

export const ApiContext: any = createContext([])

export const ApiContextBuilder = ({ children }: any) => {

  const companies: any = useFetchData(import.meta.env.VITE_APIURL + "/construtoras/list")
  const empreendimentos: any = useFetchData(import.meta.env.VITE_APIURL + "/empreendimentos")


  return (
    <ApiContext.Provider value={{ c: companies, e: empreendimentos }}>
      {children}
    </ApiContext.Provider>
  )
}