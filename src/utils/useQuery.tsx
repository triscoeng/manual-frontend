import { useCallback, useState } from 'react'
import axios from 'axios'

const initState = {
  data: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null
}
export default function useQuery(init = initState) {
  const [state, setState] = useState(init)

  const api = axios.create({
    baseURL: import.meta.env.VITE_APIURL,
    headers: { 'Authorization': localStorage.getItem("token") },
  });

  async function get(url: string) {
    setState((prev: any) => ({ ...prev, isLoading: true }))
    await api({
      method: "GET",
      url: url
    }).then(async (r) => {
      return setState((prev: any) => ({ ...prev, isLoading: false, isSuccess: true, data: r.data }))
    }).catch((error: any) => {
      return setState((prev: any) => ({ ...prev, isLoading: false, isSuccess: false, isError: true, error: error, data: null }))
    })
  }

  const post = async (url: string, incomeData: any) => {
    setState((prev: any) => ({ ...prev, isLoading: true }))
    try {
      const { data } = await api({
        method: "POST",
        data: incomeData,
        url
      })
      setState((prev: any) => ({ ...prev, isLoading: false, isSuccess: true, data }))
      return data
    } catch (error) {
      setState((prev: any) => ({ ...prev, isLoading: false, isSuccess: false, isError: true, error: error, data: null }))
    }
  }

  const remove = async (url: string) => {
    setState((prev: any) => ({ ...prev, isLoading: true }))
    try {
      const { data } = await api({
        method: "DELETE",
        url
      })
      setState((prev: any) => ({ ...prev, isLoading: false, isSuccess: true, data }))
      return data
    } catch (error) {
      setState((prev: any) => ({ ...prev, isLoading: false, isSuccess: false, isError: true, error: error, data: null }))
    }
  }

  return {
    ...state, post, remove
  }
}
