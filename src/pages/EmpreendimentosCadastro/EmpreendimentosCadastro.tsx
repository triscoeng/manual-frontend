import {
  Button,
  CircularProgress,
  FilledInput,
  FormControl,
  InputLabel,
} from "@mui/material";
import Select from "react-select";
import AsyncSelect from "react-select/async"
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import ClearIcon from "@mui/icons-material/Clear";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

import "./styles.scss";
import { borderBottom } from "@mui/system";

const EmpreendimentosCadastro = () => {
  const [uploadedFiles, setUploadedFiles]: any = useState([]);
  const [fileLimit, setFileLimit] = useState(false);
  const [construtoraSelected, setConstrutoraSelected]: any = useState("");
  const [nomeEmpreendimento, setNomeEmpreendimento]: any = useState("");
  const [cep, setCep]: any = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [construtorasData, setConstrutorasData] = useState([]);


  const handleSubmitRequest = async (data: any) => {
    setIsLoading(true);
    await axios
      .post(process.env.REACT_APP_APIURL + "/empreendimento/add", data, {
        headers: {
          authorization: localStorage.getItem("token") as string,
        },
      })
      .then((r) => {
        console.log(r);
        toast.success("Empreendimento cadastrado com sucesso");
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmitEvent = async (e: any) => {
    const data = new FormData();
    data.append("idConstrutora", construtoraSelected);
    data.append("nomeEmpreendimento", nomeEmpreendimento);
    data.append("cep", cep);
    uploadedFiles.map((file: any) => data.append("files", file));
    try {
      await handleSubmitRequest(data);
    } catch (error: any) {
      return toast.error(error.message);
    }
  };

  const handleFileEvent = (e: any) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };

  const handleRemoveFileEvent = (file: any) => {
    const indexFile = uploadedFiles.findIndex((f: any) => f.name === file.name);
    console.log(indexFile);
    const newArray = [...uploadedFiles];
    newArray.splice(indexFile, 1);
    setUploadedFiles(newArray);
  };

  const handleUploadFiles = (files: any) => {
    const MAX_COUNT = 5;
    const uploaded: any = [...uploadedFiles];
    let limitExceeded = false;
    files.some((file: any) => {
      if (uploaded.findIndex((f: any) => f.name === file.name) === -1) {
        console.log(file);
        uploaded.push(file);
        if (uploaded.length === MAX_COUNT) setFileLimit(true);
        if (uploaded.length > MAX_COUNT) {
          toast.error("Você só pode incluir " + MAX_COUNT + " arquivos");
          setFileLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) setUploadedFiles(uploaded);
  };

  const getConstrutorasData = async () => {
    await axios
      .get(process.env.REACT_APP_APIURL + "/construtoras/names", {
        headers: {
          authorization: localStorage.getItem("token") as any,
        },
      })
      .then((r: any) => {
        setConstrutorasData(r.data);
      });
  };

  useEffect(() => {
    return () => {
      setIsLoading(true);
      getConstrutorasData();
      setIsLoading(false);
    };
  }, []);

  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      borderBottom: "1px dotted pink",
      color: state.isSelected ? "#fff" : "#0001a6",
      padding: 10,
    }),
    control: (provided: any, state: any) => {
      return {
        ...provided,
        backgroundColor: state.isDisabled ? "#00104e" : "#FFF",
      };
    },
    singleValue: (provided: any, state: any) => {
      return {
        ...provided,
        color: state.isDisabled ? "#FFF" : "#00104e",
        fontWeight: "700",
      };
    },
    // menuPortal: (base: any) => ({ ...base, zIndex: 9999 })
  };

  const mapResponseToValuesAndLabels = (data: any) => ({
    value: data.id,
    label: data.nome,
  });

  const getConstrutoraDataAsync: any = async (searchData: any, callback: any) => {
    const data = await axios.get(process.env.REACT_APP_APIURL + "/construtoras/names", {
      headers: {
        authorization: localStorage.getItem("token") as any,
      }
    })
      .then(result => result.data.map(mapResponseToValuesAndLabels))
      .then(final => final.filter((i: any) => i.label.toLowerCase().includes(searchData.toLowerCase())))
    callback(data);
    return data
  }

  return (
    <div className="contentContainer">
      <h2>Cadastro de Empreendimento:</h2>
      <div className="tableContainer">
        <form action="#" encType="multipart/form-data">
          <FormControl fullWidth sx={{ m: 1 }}>
            <AsyncSelect
              onChange={(opt: any) => setConstrutoraSelected(opt.value)}
              loadOptions={getConstrutoraDataAsync}
              defaultOptions={true}
              placeholder="Escolha a Construtora"
              styles={{
                valueContainer: () => (
                  { height: '55px', 
                  display: 'flex', 
                  alignItems: 'center',
                  paddingLeft: '5px'
                }),
                control: (provided: any, state: any) => {
                  return {
                    ...provided,
                    backgroundColor: '#F0F0F0',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                  }
                },
                menu: (base: any) => {
                  return {
                    ...base,
                    zIndex: 999
                  }
                }
              }}
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }} variant="filled">
            <InputLabel htmlFor="nomeEmpreendimento">
              Nome do Empreendimento
            </InputLabel>
            <FilledInput
              id="nomeEmpreendimento"
              onChange={(e: any) => setNomeEmpreendimento(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }} variant="filled">
            <InputLabel htmlFor="cep">CEP</InputLabel>
            <FilledInput
              id="cep"
              onChange={(e: any) => setCep(e.target.value)}
            />
          </FormControl>
          <FormControl
            fullWidth
            sx={{ m: 1 }}
            variant="filled"
            className="inputFileCustom"
          >
            <label htmlFor="arquivos">ADICIONE ARQUIVOS</label>
            <input
              className="MuiInputBase-input MuiFilledInput-input css-10botns-MuiInputBase-input-MuiFilledInput-input"
              id="arquivos"
              type="file"
              multiple
              onChange={handleFileEvent}
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }}>
            <h3>Arquivos Selecionados:</h3>
            {uploadedFiles.length > 0 ? (
              <div className="filesUploaded">
                {uploadedFiles.map((file: any, index: any) => (
                  <div className="file" key={index}>
                    <FilePresentIcon className="fileIcon" />
                    <p className="fileText">{file.name}</p>
                    <ClearIcon
                      className="fileIconDelete"
                      onClick={() => {
                        handleRemoveFileEvent(file);
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="">Nenhum arquivo selecionado</p>
            )}
          </FormControl>
          <FormControl>
            <Button
              variant="contained"
              sx={{ m: 1 }}
              startIcon={
                isLoading ? <CircularProgress /> : <AddCircleRoundedIcon />
              }
              onClick={handleSubmitEvent}
            >
              Cadastrar
            </Button>
          </FormControl>
        </form>
      </div>
    </div>
  );
};

export default EmpreendimentosCadastro;
