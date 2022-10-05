import { useState, useEffect } from 'react';
import AsyncSelect, { useAsync } from 'react-select/async';
import { Button } from "@mui/material";
import axios from 'axios';
import './styles.scss';
import Select from 'react-select';
import { DeleteRounded } from '@mui/icons-material';
import { useLocation } from 'react-router-dom'

interface FilterAreaProps {
  state: any;
  setState: any;
}

export function FilterArea({ setState, state }: FilterAreaProps) {

  const [initState, setInitState] = useState(state);

  const [construtoraList, ConstrutoraList]: any = useState({});
  const [empreendimentoList, setEmpreendimentoList]: any = useState({});
  const [construtoraSelected, setConstrutoraSelected]: any = useState();
  const [empSelected, setEmpSelected]: any = useState();

  const location = useLocation().pathname

  const handleReset = () => {
    setState(initState)
    setConstrutoraSelected('')
    setEmpSelected('')
  }


  const handleLoadOptions = async (input: string, cb: any) => {
    const { data } = await axios.get(process.env.REACT_APP_APIURL + '/construtoras?', {
      headers: {
        'authorization': localStorage.getItem('token') as any
      }
    })
    const afterFilter = data.filter((i: any) => i.nome.toLowerCase().includes(input.toLowerCase()))
    cb(afterFilter)
    return data
  }

  const handleFilter = () => {
    console.log({ const: construtoraSelected, emp: empSelected })
    const tempo = state.filter((single: any) => {
      console.log(single)
      return single.construtora.label === construtoraSelected.label
    })
    console.log(tempo)
  }

  const handleConstrutoraChange = async (e: any) => {
    setConstrutoraSelected({
      label: e.nome,
      value: e.id
    })
    setEmpreendimentoList(e.Empreendimentos)
  }

  const handleEmpreendimentoChange = (value: any) => {
    setEmpSelected({
      label: value.nomeEmpreendimento,
      value: value.id
    })
  }

  return (
    <div className="filter_group">
      <div className="filter_cell">
        <AsyncSelect defaultOptions
          styles={{ menu: base => ({ ...base, zIndex: 9999 }) }}
          placeholder="Escolha a Construtora"
          loadOptions={handleLoadOptions}
          getOptionLabel={(i: any) => i.nome}
          getOptionValue={(v: any) => v.id}
          defaultValue
          onChange={handleConstrutoraChange}
        />
      </div>
      {!location.includes('construtoras') &&
        <div className="filter_cell">
          <Select
            styles={{ menu: base => ({ ...base, zIndex: 9999 }) }}
            placeholder={"Escolha o Empreendimento"}
            options={empreendimentoList}
            getOptionLabel={(l: any) => l.nomeEmpreendimento}
            getOptionValue={(v: any) => v.id}
            onChange={handleEmpreendimentoChange} />
        </div>
      }
      <div className="filter_cell actionbutton">
        <Button variant="contained" onClick={handleFilter}>
          Filtrar
        </Button>
        <Button variant="contained" sx={{ marginLeft: 2 }} color={"error"} onClick={handleReset}>
          <DeleteRounded color={"action"} />
        </Button>
      </div>
    </div>
  );
}
