import React, { useMemo, useEffect, useState, useLayoutEffect } from 'react'
import axios from 'axios'
import './styles.scss'
import { Box, Modal } from '@mui/material';
import QrCodeGenerator from '../../utils/QrCodeGenerator';
import { FilterArea } from '../../components/FilterArea';
import useFetchData from '../../utils/useFetchData';
import { CircularProgress } from "@mui/material";


const Arquivos = () => {

  const [fileList, setFileList]: any = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [searchState, setSearchState]: any = useState();

  const arqList: any = useFetchData(import.meta.env.VITE_APIURL + '/arquivos', 'GET')

  const handleFilterButton = async () => {
    console.log('entrou')
    const query = new URLSearchParams(searchState)
    const fetchdata = await axios.get(import.meta.env.VITE_APIURL + '/arquivos?' + query, {
      headers: {
        'authorization': localStorage.getItem('token') as any
      }
    })
    const data = await fetchdata.data
    setFileList(data)
  }




  useEffect(() => {
    console.log(arqList)

  }, [arqList])



  useLayoutEffect(() => {
    let newList: any = {}
    if (searchState && searchState.hasOwnProperty("empreendimento")) {
      newList = fileList.filter((file: any) => file.construtora.value === searchState.construtora
        &&
        file.empreendimento.value === searchState.empreendimento
      )
    } else {
      newList = fileList.filter((file: any) => file.construtora.value === searchState.construtora)
    }
    setSearchList(newList)
  }, [searchState])

  return (
    <div className='contentContainer'>
      <h2>Arquivos</h2>
      <div className="filterArea">
        <FilterArea state={searchState} setState={setSearchState} onPressFilter={() => { console.log(searchState) }} />
      </div>
      <div className="filesWrapper">
        {
          arqList.isLoading ? <CircularProgress /> :
            arqList.apiData.map((file: any) => (
              <div className="file" key={file.id}>
                <p><span>Nome: </span>{file.nomeArquivo.substring(0, 20)}</p>
                <p><span>Empreendimento: </span>{file.empreendimento.label}</p>
                <p><span>Construtora: </span>{file.construtora.label}</p>
              </div>
            ))
        }
        {/* {
          (!searchState ? fileList : searchList).map((file: any) => (
            <div className="file" key={file.id}>
              <p><span>Nome: </span>{file.nomeArquivo.substring(0, 20)}</p>
              <p><span>Empreendimento: </span>{file.empreendimento.label}</p>
              <p><span>Construtora: </span>{file.construtora.label}</p>
            </div>
          ))
        } */}
      </div>
    </div>


  )
}

export default Arquivos