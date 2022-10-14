import { useState, useEffect } from 'react'
import axios from "axios"

export default function useFetchData(url: any, method?: any, data?: any) {
  const [isLoading, setIsLoading]: any = useState(true);
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true)
    const fetch = async () => {
      try {
        const resp = await axios({
          method: method,
          url: url,
          data: data,
          headers: {
            'authorization': localStorage.getItem('token') as any
          }
        });
        const apiData = await resp?.data
        setApiData(apiData)
        setIsLoading(false)
      } catch (error: any) {
        setError(error)
        setIsLoading(false)
      }
    }

    fetch()
  }, [url])

  return { isLoading, apiData, error }
}