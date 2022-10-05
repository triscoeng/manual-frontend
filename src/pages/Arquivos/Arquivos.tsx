import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './styles.scss'
import { Box, Modal } from '@mui/material';
import QrCodeGenerator from '../../utils/QrCodeGenerator';
import { FilterArea } from '../../components/FilterArea';

const Arquivos = () => {

  const [fileList, setFileList]: any = useState([]);
  const [modalQrCode, setModalQrCode] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState({});
  const [searchState, setSearchState] = useState();

  const handleFilterButton = async () => {
    console.log('entrou')
    const query = new URLSearchParams(searchState)
    const fetchdata = await axios.get(process.env.REACT_APP_APIURL + '/arquivos?' + query, {
      headers: {
        'authorization': localStorage.getItem('token') as any
      }
    })
    const data = await fetchdata.data
    setFileList(data)
  }


  const getFileList = async () => {
    await axios.get(process.env.REACT_APP_APIURL + '/arquivos', {
      headers: {
        'authorization': localStorage.getItem('token') as any
      }
    }).then((result) => {
      setFileList(result.data)
      console.log(result.data)
    })
  }


  useEffect(() => {
    getFileList();
    return () => {
    }
  }, []);

  return (
    <div className='contentContainer'>
      <h2>Arquivos</h2>
      <div className="filterArea">
        <FilterArea state={fileList} setState={setFileList} />
      </div>
      <div className="filesWrapper">
        {
          fileList.map((file: any) => (
            <div className="file" key={file.id}>
              <p><span>Nome: </span>{file.nomeArquivo.substring(0, 20)}</p>
              <p><span>Empreendimento: </span>{file.empreendimento.label}</p>
              <p><span>Construtora: </span>{file.construtora.label}</p>
              <p className="qrCode" onClick={() => {
                setSelectedQrCode(file)
                setModalQrCode(!modalQrCode)
              }}>QrCode</p>
            </div>
          ))
        }
      </div>
      <Modal open={modalQrCode} onClose={() => setModalQrCode(!modalQrCode)}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            borderRadius: "10px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "auto",
            bgcolor: "background.paper",
            border: "2px solid #0001A6",
            boxShadow: 24,
            p: 4,
          }}
        >
        </Box>
      </Modal>
    </div>


  )
}

export default Arquivos