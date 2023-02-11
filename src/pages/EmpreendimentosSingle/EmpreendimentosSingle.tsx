import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, Modal, FormControl } from "@mui/material";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import QrCodeGenerator from "../../utils/QrCodeGenerator";
import { Add, AddRounded, Delete, ShoppingBasket } from "@mui/icons-material";

import "./styles.scss";
import useFetchData from "../../utils/useFetchData";
import { ApiContext } from "../../context/ApiContext";

const EmpreendimentosSingle = () => {
  const { idEmpreendimento } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalQrCode, setModalQrCode] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState("");
  const [editedValues, setEditedValues]: any = useState({});
  const [trigger, setTrigger] = useState(false);

  const [newFiles, setNewFiles] = useState([]);

  const apiDataContext: any = useContext(ApiContext)
  const empData: any = useFetchData('/empreendimento/' + idEmpreendimento)

  useEffect(() => {
    console.log("🚀 ~ file: EmpreendimentosSingle.tsx ~ line 22 ~ EmpreendimentosSingle ~ loading", loading)

  }, [loading])

  const handleDefault = () => {
    if (!empData.isLoading) {
      let el = apiDataContext.c.apiData.find((e: any) => e.value === empData.apiData.construtora.id)
      return ({ label: el.label, value: el.value })
    }
  }


  const handleInputChange = (e: any) => {
    setEditedValues((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileSelectEvent = (e: any) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleFilesSelected(chosenFiles);
  };

  const handleFilesSelected = (file: any) => {
    if (!editedValues.files) {
      setEditedValues((prev: any) => ({ ...prev, ["files"]: file }));
    } else {
      setEditedValues((prev: any) => {
        console.log(prev);
        return {
          ...prev,
          ["files"]: [...prev.files, file[0]],
        };
      });
    }
  };

  const handleFormCreate = (editedValues: any) => {
    const form = new FormData();
    form.append("id", idEmpreendimento as any);
    for (var key in editedValues) {
      if (key !== "files") {
        form.append(key, editedValues[key]);
      }
    }
    if (editedValues.files) {
      editedValues.files.map((file: any) => {
        form.append("files", file);
      });
    }
    return form;
  };

  const handleSaveEditButton = async () => {
    const values = { ...editedValues };
    const formData: any = handleFormCreate(values);
    await handleEditSubmit(formData);
  };

  const handleEditSubmit = async (form: any) => {
    try {
      setLoading(true);
      await axios
        .post(import.meta.env.VITE_APIURL + "/empreendimento/edit", form, {
          headers: {
            authorization: localStorage.getItem("token") as any,
          },
        })
        .then(() => {
          toast.success("Registro atualizado com sucesso");
          setEditMode(false);
          window.location.reload()
        });
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data);
    }
    setTrigger(!trigger)
  };

  const handleDeleteSingleFile = async (fileId: any) => {
    setLoading(true);
    try {
      const query = await axios
        .delete(import.meta.env.VITE_APIURL + "/arquivo/" + fileId, {
          headers: {
            authorization: localStorage.getItem("token") as any,
          },
        })
        .then(() => {
          toast.success("Arquivo deletado com sucesso.");
          setTrigger(!trigger);
          setEditMode(false);
        });
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data);
    }
  };

  const filterOptions = (
    construtoras: { label: string; value: string },
    input: string
  ) => {
    if (input) {
      return construtoras.label.includes(input);
    }
    return true;
  };

  // const selectedCompanyIndex = () => {
  //   if (empData.apiData) {
  //     let el = empData.construtora.find(
  //       (i: any) => i.id === empreendimentoData.idConstrutora
  //     );
  //     const volta = { label: el.nome, value: el.id };
  //     return volta;
  //   }
  // };

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
  };

  return (
    <div className="empreendimentosContainer">
      <div className="header">
        <h2 style={{ marginBottom: "10px" }}>Detalhes do Empreendimento:</h2>
        <Button
          variant={!editMode ? "contained" : "outlined"}
          startIcon={!editMode ? <EditRoundedIcon /> : <SaveRoundedIcon />}
          onClick={() => {
            if (!editMode) {
              setEditMode(!editMode);
            } else {
              setEditMode(!editMode);
              handleSaveEditButton();
            }
          }}
        >
          {!editMode ? "Editar" : "Salvar"}
        </Button>
      </div>
      {
        loading ? <CircularProgress color="success" /> :
          (!empData.isLoading && !apiDataContext.c.isLoading) &&
          <>
            <div className="topWrapper">
              <div className="inputGroup">
                <p className="inputSpan">Construtora:</p>
                <Select
                  onChange={(e: any) => {
                    setEditedValues((prev: any) => ({
                      ...prev,
                      ["idConstrutora"]: e.value,
                    }));
                  }}
                  styles={customStyles}
                  isDisabled={!editMode ? true : false}
                  defaultValue={handleDefault}
                  // filterOption={filterOptions}
                  options={apiDataContext.c.apiData.map((single: any) => ({ label: single.label, value: single.value }))}
                />
              </div>
              <div className="inputGroup">
                <p className="inputSpan">Nome Do Imóvel:</p>
                <input
                  name="nomeEmpreendimento"
                  type="text"
                  defaultValue={empData.apiData.nomeEmpreendimento}
                  disabled={!editMode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="inputGroup">
                <p className="inputSpan">CEP</p>
                <input
                  type="text"
                  name="cep"
                  defaultValue={empData.apiData.cep}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
            </div>
            <h3>Arquivos Cadastrados:</h3>
            {!editMode ? (
              ""
            ) : (
              <FormControl
                fullWidth
                sx={{ m: 1 }}
                variant="filled"
                className="inputFileCustom"
              >
                <label htmlFor="arquivos">ADICIONE ARQUIVO</label>
                <input
                  className="MuiInputBase-input MuiFilledInput-input css-10botns-MuiInputBase-input-MuiFilledInput-input"
                  id="arquivos"
                  name="files"
                  type="file"
                  onChange={handleFileSelectEvent}
                />
              </FormControl>
            )}
            <div className="empreendimento_fileswrapper">
              {empData.apiData.Arquivos.map((file: any, index: any) => (
                <div className="fileCard" key={index}>
                  <p className="">Arquivo {index + 1}</p>
                  <p className="fileName">{file.nomeArquivo}</p>
                  <div className="filewrapper_bottom">
                    <Button
                      variant="contained"
                      onClick={() => {
                        setModalQrCode(true);
                        setSelectedQrCode(file);
                      }}
                    >
                      Acessar QR Code
                    </Button>
                    {!editMode ? (
                      <FilePresentIcon sx={{ color: "#1976d2" }} />
                    ) : (
                      <Delete
                        className="filewrapper_icon"
                        onClick={() => handleDeleteSingleFile(file.id)}
                      />
                    )}
                  </div>
                </div>
              ))}
              {editedValues.files
                ? editedValues.files.map((file: any, index: any) => (
                  <div className="fileCard">
                    <p className="">Arquivo a salvar</p>
                    <p className="fileName">{file.name}</p>
                    <div className="filewrapper_bottom">
                      <Button
                        disabled
                        variant="contained"
                        onClick={() => {
                          setModalQrCode(true);
                          setSelectedQrCode(file);
                        }}
                      >
                        Acessar QR Code
                      </Button>
                      <Delete
                        sx={{ cursor: "pointer" }}
                        className="filewrapper_icon"
                        onClick={() => {
                          const tempFiles = editedValues.files;
                          tempFiles.splice(index, 1);
                          setEditedValues(() => ({
                            ["files"]: tempFiles,
                          }));
                        }}
                      />
                    </div>
                  </div>
                ))
                : ""}
              <Modal open={modalQrCode} onClose={() => setModalQrCode(false)}>
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
          </>
      }
    </div>
  );
};

export default EmpreendimentosSingle;
