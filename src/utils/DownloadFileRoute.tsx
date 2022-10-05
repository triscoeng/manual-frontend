import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const DownloadFileRoute = () => {
  const params = useParams();

  // const getUrlLink = async () => {
  //   const url = await axios
  //     .get(
  //       process.env.REACT_APP_APIURL +
  //       `/download?id=${params.id}`
  //     )
  //     .then(({ data }: any) => {
  //       return data
  //     })
  //   window.self.location = url
  // };

  useEffect(() => {
    console.log(params)
  }, []);


  return (
    <>
      <p>seu arquivo está sendo baixado</p>
    </>
  );
};

export default DownloadFileRoute;
