import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./login.scss";
import logo from "../../components/images/secure_login.svg"

const Login = () => {
  const [usuario, setUsuario]: any = useState();
  const [senha, setSenha]: any = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleUserChange = (e: any) => {
    e.preventDefault();
    setUsuario(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setSenha(e.target.value);
  };

  const loginUser = async () => {
    setIsLoading(true)
    await axios
      .post(import.meta.env.VITE_APIURL + "/login", {
        usuario: usuario,
        senha: senha,
      })
      .then(async ({ data: { data, token } }) => {
        toast.success("Login Realizado com Sucesso");
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(data));
        localStorage.setItem("exp", data.exp);
        navigate("/admin");
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setIsLoading(false)
      });
  };

  return (
    <div className="loginContainer">
      <div className="wrapper">
        <div className="illustration">
          <img src={logo} alt="Login" />
        </div>
        <div className="content">
          <p className="title">
            Manual do Proprietário <br /> Login<br />

          </p>
          <div className="inputArea">
            <div className="inputGroup">
              <p className="inputCaption">Nome de Usuário:</p>
              <input
                type="text"
                name="usuario"
                id="usuario"
                onChange={handleUserChange}
              />
            </div>
            <div className="inputGroup">
              <p className="inputCaption">Senha:</p>
              <input
                type="password"
                name="senha"
                id="senha"
                onChange={handlePasswordChange}
              />
            </div>
            {
              isLoading ?
                <CircularProgress />
                :
                <Button
                  type="button"
                  value="Login"
                  variant="contained"
                  onClick={() => {
                    loginUser();
                  }}
                >
                  Entrar
                </Button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
