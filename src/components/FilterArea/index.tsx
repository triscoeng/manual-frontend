import { useState, Suspense } from 'react';
import { Button } from "@mui/material";
import Select from 'react-select';
import { DeleteRounded } from '@mui/icons-material';
import { useLocation } from 'react-router-dom'
import useFetchData from '../../utils/useFetchData';

import './styles.scss';
export function FilterArea({ setState, state, onPressFilter }: any) {

  const [empreendimentoList, setEmpreendimentoList]: any = useState();
  const companies: any = useFetchData(import.meta.env.VITE_APIURL + '/construtoras/list', 'get', {})

  const location = useLocation().pathname
  // const { state: tempFilesArray } = { state }

  const handleReset = () => {
    console.log(companies)
  }

  const handleConstrutoraChange = async (e: any, action: any) => {
    setEmpreendimentoList(e.empreendimentos.map((s: any) => ({ label: s.label, value: s.value })))
    setState((prev: any) => ({ ...prev, construtora: e.value }))
  }

  const handleEmpreendimentoChange = (value: any, action: any) => {
    setState((prev: any) => ({ ...prev, empreendimento: value.value }))
  }

  return (
    <Suspense fallback={<p>Loading</p>}>
      {companies.apiData &&
        <div className="filter_group">
          <div className="filter_cell">
            <Select
              placeholder={"Escolha a Construtora"}
              isClearable={true}
              styles={{ menu: base => ({ ...base, zIndex: 9999 }) }}
              options={companies.apiData}
              onMenuClose={() => console.log(state)}
              onChange={handleConstrutoraChange} />
          </div>
          {!location.includes('construtoras') &&
            <div className="filter_cell">
              <Select
                placeholder={"Escolha o Empreendimento"}
                isClearable={true}
                styles={{ menu: base => ({ ...base, zIndex: 9999 }) }}
                options={empreendimentoList}
                onChange={handleEmpreendimentoChange} />
            </div>
          }
          <div className="filter_cell actionbutton">
            <Button variant="contained" onClick={onPressFilter}>
              Filtrar
            </Button>
            <Button variant="contained" sx={{ marginLeft: 2 }} color={"error"} onClick={handleReset}>
              <DeleteRounded color={"action"} />
            </Button>
          </div>
        </div>
      }
    </Suspense>
  );
}
