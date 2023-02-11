import { AccountTree, ContactPhone, HomeMini, House, MenuBook, RoomPreferences, WorkspacePremium } from '@mui/icons-material'
import React from 'react'
import { Outlet } from 'react-router-dom'

import pdfLogo from '../../components/images/pdf-ico.png'
import useWindowDimensions from '../../utils/useWindowDim'
import './paginadousuario.scss'






interface iData {
  data: {
    arquivo: [],
    empreendimento: {
      logo: string,
      construtora: {
        email: string,
        logo: string,
        nome: string
      }
    },
    nome: string,
    categoria: number
    id: string
  }
}

export default function PaginaDoUsuario({ data }: iData) {

  const [section, setSection] = React.useState('home')
  const { width } = useWindowDimensions()
  const isMobile: boolean = width <= 465 ? true : false

  const MobileMenu = () => {
    return (
      <aside className=''>
        <div className='mobile-menu'>
          <a className='mobile-link' onClick={() => setSection('home')}>
            <House />
            <p>INÍCIO</p>
          </a>
          <a className='mobile-link' onClick={() => setSection('manual')}>
            <MenuBook />
            <p>Manual</p>
          </a>
          <a className='mobile-link disable'>
            <AccountTree />
            <p>PROJETOS</p>
          </a>
          <a className='mobile-link disable'>
            <RoomPreferences />
            <p>MANUTENÇÕES</p>
          </a>
          <a className='mobile-link disable'>
            <WorkspacePremium />
            <p>GARANTIAS</p>
          </a>
          <a className='mobile-link' onClick={() => setSection('contato')}>
            <ContactPhone />
            <p>Contato</p>
          </a>
        </div>
      </aside>
    )
  }

  const Home = () => {
    return (
      <div className='welcome'>
        <h1>Seja Bem Vindo à Pagina do Manual do Proprietário</h1>
        <div>
          <p>Utilize o menu {width > 465 ? "ao lado" : "acima"} para navergar pelas sessões </p>

          {isMobile &&
            <>
              <br />
              <br />
              <p>O menu possui scroll lateral.{'\n'} Arraste o menu para a esquerda para visualizar as opções.</p>
            </>
          }
        </div>

      </div>
    )
  }

  const Manual = ({ arquivos }: any) => (
    <>
      <div className='manual_header'>
        <h3 className='subtitle'>MANUAL DE USO OPERAÇÃO E MANUTENÇÃO</h3>
        <p className='text'>Clique no ícone abaixo para baixar/visualizar o documento manual do
          proprietário/condomínio integralmente.</p>
      </div>
      <div className='files'>
        <h3>Downloads</h3>
        <div className="fileArea">
          {arquivos.map((arquivo: any) => (
            <a href={`${import.meta.env.VITE_APIURL}/${arquivo.urlArquivo}`}>
              <div className='fileNode' key={arquivo.id}>
                <img src={pdfLogo} alt="pdf icon logo" />
                <p>{arquivo.nomeExibicao}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  )

  const Contato = ({ data }: any) => {
    console.log(data)
    return (
      <div className='contatoWrapper'>
        <div className='contatoHeader'>
          <h1 className='subtitle'>DADOS PARA CONTATO:</h1>
          <p>Utilize as informações abaixo caso necessite entrar em contato com a construtora</p>
        </div>
        <div className="contatoGroupFlex">
          <p>Contato:</p>
          <span>{data.nomeContato}</span>
        </div>
        <div className="contatoGroupFlex">
          <p>Email para contato:</p>
          <span>{data.email}</span>
        </div>
        <div className="contatoGroupFlex">
          <p>Telefone:</p>
          <span>{data.telefone}</span>
        </div>
        <div className="contatoGroupFlex">
          <p>Whatsapp:</p>
          <span>{data.telefone}</span>
        </div>
      </div>
    )
  }


  function getContent(v: string): any {
    switch (v) {
      case 'manual':
        return <Manual arquivos={data.arquivo} />
        break;
      case 'contato':
        return <Contato data={data.empreendimento.construtora} />
        break;
      default:
        return <Home />
        break;
    }
  }

  return (
    <div className="paginadousuario_container">
      <header>
        <img src="/images/logo-trisco-white.png" alt="Trisco Icone" />
      </header>
      <div className='main'>

        {width > 475 ? <aside className="sidebar">
          <div className='construtora_logo'>
            <img src={`${import.meta.env.VITE_APIURL}/${data.empreendimento.construtora.logo}`} alt="" />
          </div>
          <div className='menu'>
            <a onClick={() => setSection('home')}>INÍCIO</a>
            <a onClick={() => setSection('manual')}>MANUAL</a>
            <a className='disable'>PROJETOS</a>
            <a className='disable'>MANUTENÇÕES</a>
            <a className='disable'>GARANTIAS</a>
            <a onClick={() => setSection('contato')}>CONTATO</a>
          </div>
          <div className='empreendimento_logo'>
            <img src={`${import.meta.env.VITE_APIURL}/${data.empreendimento.logo}`} alt="" />

          </div>
        </aside> :
          <MobileMenu />
        }


        <div className="content">
          {getContent(section)}
        </div>
      </div >
      <div className='footer'>
        <p>©Trisco Engenharia ● {data.empreendimento.construtora.nome}</p>
      </div>
    </div >
  )
}

