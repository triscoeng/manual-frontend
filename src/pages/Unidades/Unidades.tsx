import { AddCircleOutline, ContentCopy } from '@mui/icons-material'
import { Button } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import QrCodeGenerator from '../../utils/QrCodeGenerator'
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface IUnidade {
  nome: string,
  categoria: number,
  empreendimento: {
    nomeEmpreendimento: string
    construtora: {
      nome: true
    }
  }
  id: string,
}

export default function Unidades() {

  const [unidadesList, setUnidadesList] = useState([])

  async function getUnidadesList() {
    await axios.get(import.meta.env.VITE_APIURL + '/unidades', {
      headers: {
        'Authorization': localStorage.getItem('token') as any
      }
    }).then(({ data }) => {
      console.table(data)
      setUnidadesList(data)
    })
  }

  useEffect(() => {
    getUnidadesList()

  }, [])

  const navigate = useNavigate()
  return (
    <>
      <div className="contentContainer">
        <h2>Unidades</h2>
        <div className='tableContainer'>
          <div className="filterArea">
            <Button
              startIcon={<AddCircleOutline />}
              variant='contained' color='success'
              style={{ marginBottom: 12 }}
              onClick={() => {
                navigate('./novo')
              }}
            >
              Cadastrar
            </Button>
          </div>

          <table className='tabela'>
            <thead>
              <tr>
                <th>Nome da Unidade</th>
                <th>Empreendimento</th>
                <th>Construtora</th>
                <th>Categoria</th>
                <th>QR Code</th>
                <th>Ações</th>
              </tr>
            </thead>
            {unidadesList &&
              unidadesList.map((unidade: IUnidade, index: number) => (
                <tr key={unidade.id}>
                  <td>
                    {unidade.nome}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span>{unidade.empreendimento.nomeEmpreendimento}</span>
                    </div>
                  </td>
                  <td>
                    <span >{unidade.empreendimento.construtora.nome}</span>
                  </td>
                  <td>
                    <p
                      style={{ textAlign: 'center' }}
                      className={unidade.categoria === 0 ? 'badge' : ' badge badgeTwo'}
                    >
                      {unidade.categoria === 0 ? 'Padrao' : 'Privada'}
                    </p>
                  </td>
                  <td>
                    <div className=''>
                      <QrCodeGenerator data={{ id: unidade.id, url: `${import.meta.env.VITE_PUBLIC_URL}/qrcode/${unidade.id}`, rest: unidade }} />
                      <a className="tooltip" onClick={(e) => {
                        navigator.clipboard.writeText(`${import.meta.env.VITE_PUBLIC_URL}/qrcode/${unidade.id}`)
                      }} >
                        <ContentCopy />
                        <span className='tooltiptext'>CTRL+C</span>
                      </a>
                    </div>
                  </td>
                  <td>
                    <>
                      <Link to={`#`}>
                        <VisibilityIcon className="actionIcons green" />
                      </Link>
                      <span
                        onClick={() => {
                        }}
                      >
                        <DeleteIcon className="actionIcons red" />
                      </span>
                      {/* <Button
                        onClick={() => navigate(`./${row.id}`)}
                        startIcon={
                          <VisibilityIcon className="actionIcons green" />
                        }
                      />
                      <Button
                        //   onClick={() => handleDelete(row.id) as any}
                        startIcon={<DeleteIcon className="actionIcons red" />}
                      /> */}
                    </>
                  </td>
                </tr>
              ))}
          </table>
        </div>
      </div>
    </>
  )
}
