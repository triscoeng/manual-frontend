import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import useFetchData from '../../utils/useFetchData';
import { LayoutContext } from '../../context/LayoutContext'
import { AddCircleOutline, ContentCopy } from '@mui/icons-material'
import { Button, CircularProgress, Icon } from '@mui/material'
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'


import './Arquivos.scss';

const Arquivos = () => {

  const arquivos: any = useFetchData('/arquivos')

  console.log(arquivos)

  const handleDeleteUnidade = (id: any) => {
    console.log(id)
  }

  const FilterArea = () => {

  }

  return (
    <div id="files" className='contentContainer '>
      <h2>Lista de Arquivos para edição:</h2>
      <div className='header'>
        <FilterArea />
      </div>
      <div className='content'>
        <table className='tabela' style={{ gridTemplateColumns: "repeat(5, 0.3fr)" }}>
          <thead>
            <tr>
              <th>Nome Exibição</th>
              <th>Empreendimento</th>
              <th>Construtora</th>
              <th>Acessos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {
              arquivos.isLoading ?
                <CircularProgress />
                :
                arquivos?.apiData.map((arquivo: any, index: number) => (
                  <tr key={arquivo.id}>
                    <td>
                      {arquivo.nomeExibicao}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <p>{arquivo.empreendimento.nomeEmpreendimento}</p>
                      </div>
                    </td>
                    <td>
                      <p>{arquivo.empreendimento.construtora.nome}</p>
                    </td>
                    <td>
                      <p>{arquivo.quantidadeDownload}</p>
                    </td>
                    <td>
                      <>
                        <Link to={`./${arquivo.id}`} state={arquivo}>
                          <VisibilityIcon className="actionIcons green" />
                        </Link>
                        <p onClick={() => handleDeleteUnidade(arquivo.id)}>
                          <DeleteIcon className="actionIcons red" />
                        </p>
                      </>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
      <div className="footer">

      </div>
    </div>
  )
}

export default Arquivos