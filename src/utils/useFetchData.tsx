import { useState, useEffect, useCallback } from 'react'
import axios from "axios"

export default function useFetchData(url: any, method = 'GET', data = null) {

  const baseURL = import.meta.env.VITE_APIURL + url;
  const api: any = axios.create({
    baseURL,
    method: method,
    headers: { 'Authorization': localStorage.getItem("token") },
  });

  const [state, setState]: any = useState({
    data: null,
    isLoading: true,
    isSuccess: false,
    isError: false,
    error: "",
  })

  const runQuery: any = useCallback(
    () => {
      setState((s: any) => ({ ...s, isLoading: true }))
      api()
        .then(({ data }: any) =>
          setState((s: any) => (
            {
              data,
              isLoading: false,
              isSuccess: true,
              isError: false,
              error: "",
            }
          ))
        )
        .catch((error: any) => {
          setState({
            data: null,
            isLoading: false,
            isSuccess: false,
            isError: true,
            error: error.message || "Failed to fetch",
          })
        })
    },
    [],
  )


  useEffect(() => {
    return () => {
      runQuery()
    }
  }, [])

  return { ...state, refresh: runQuery }
}