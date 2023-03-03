import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutContext } from "../../context/LayoutContext";
import "./styles.scss";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { toast } from "react-toastify";
import { Button, CircularProgress, Pagination } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

import useFetchData from "../../utils/useFetchData";
import usePagination from "../../utils/usePagination";

const Empreendimentos = () => {
  const layoutContext: any = useContext(LayoutContext);
  const navigate = useNavigate();
  const [trigger, setTrigger] = useState(false);
  const { data, isLoading, refresh } = useFetchData('/empreendimentos')

  const [page, setPage] = React.useState(1);
  const per_page = 15
  const numPages = Math.ceil(data?.length / per_page)
  const _DATA = usePagination(data, per_page)

  const handleDeleteRow = async (id: any) => {
    Swal.fire({
      title: "Confirmação de Exclusão!",
      icon: "question",
      html: "Ao excluir este registo os arquivos <strong> também serão removidos.</strong> <br> Esta ação não poderá ser desfeita! Você tem certeza disto?",
      confirmButtonText: "DELETAR",
      confirmButtonColor: "red",
      showCancelButton: true,
      cancelButtonText: "CANCELAR",
      cancelButtonColor: "green",
    }).then((r: any) => {
      if (r.isConfirmed) {
        axios
          .delete(import.meta.env.VITE_APIURL + "/empreendimento/" + id, {
            headers: {
              authorization: localStorage.getItem("token") as any,
            },
          })
          .then(() => {
            toast.success("Registro excluído com sucesso");
            refresh()
          })
          .catch((err) => {
            toast.error(err.message);
          });
      }
    });
  };

  useEffect(() => {
    layoutContext.setNavbar_title("Lista de Empreendimentos");
  }, [trigger]);

  const handleSingUp = () => {
    navigate("./cadastro");
  };

  const handlePageChange = (e: any, p: any) => {
    e.preventDefault()
    setPage(p)
    _DATA.jump(p)
  }

  return (
    <div className="empreendimentosContainer contentContainer">
      <h2>Empreendimentos Cadastrados</h2>
      <div className="tableContainer">
        <Button
          variant="contained"
          startIcon={<AddCircleRoundedIcon />}
          style={{ marginBottom: "10px" }}
          onClick={handleSingUp}
        >
          Cadastrar
        </Button>
        <div className="filterArea">
        </div>
        <table>
          <thead>
            <tr>
              <th>Construtora</th>
              <th>Empreendimento</th>
              <th>Quantidade de Unidades</th>
              <th>Quantidade de Arquivos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {
              isLoading ?
                <CircularProgress />
                :
                _DATA.currentData().map((row: any) =>
                (
                  <tr key={row.id}>
                    <td><img src={`${import.meta.env.VITE_APIURL}/${row.construtora.logo}`} alt={row.construtora.nome} /></td>
                    <td><p>{row.nomeEmpreendimento}</p></td>
                    <td><p>{row.Unidades.length}</p></td>
                    <td><p>{row.Arquivos.length}</p></td>
                    <td>
                      <Link to={`./cadastro/${row.id}`} state={row}>
                        <VisibilityIcon className="actionIcons green" />
                      </Link>
                      <a
                        onClick={() => {
                          handleDeleteRow(row.id);
                        }}
                      >
                        <DeleteIcon className="actionIcons red" />
                      </a>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
        <div className="footer">
          <Pagination
            onChange={handlePageChange}
            count={numPages}
            page={page}
            shape="rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default Empreendimentos;
