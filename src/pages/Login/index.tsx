import axios from "axios";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./login.scss";
const logo = require("../../components/images/secure_login.svg");

const Login = () => {
  const [usuario, setUsuario] = useState();
  const [senha, setSenha] = useState();
  const navigate = useNavigate();

  const handleUserChange = (e: any) => {
    e.preventDefault();
    setUsuario(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setSenha(e.target.value);
  };

  const loginUser = async () => {
    await axios
      .post(process.env.REACT_APP_APIURL + "/login", {
        usuario: usuario,
        senha: senha,
      })
      .then(async (r) => {
        toast.success("Login Realizado com Sucesso");
        localStorage.setItem("token", r.data.token);
        localStorage.setItem("usuario", JSON.stringify(r.data.data.data));
        localStorage.setItem("exp", r.data.data.exp);
        navigate("/manual");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className="loginContainer">
      <div className="wrapper">
        <p className="title">
          Sistema de Manual do Proprietário <br />
          <strong>Trisco Engenharia</strong>
        </p>
        <div className="innerWrapper">
          <div className="illustration">
            <img src={logo.default} />
          </div>
          <div className="content">
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
            </div>
            <input
              type="button"
              value="ACESSAR"
              onClick={() => {
                loginUser();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
