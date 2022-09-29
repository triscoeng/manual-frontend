import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const DownloadFileRoute = () => {
  const params = useParams();
  const [linkUrl, setLinkUrl] = useState("");
  const navigate = useNavigate()

  const getUrlLink = async () => {
    const url = await axios
      .get(
        process.env.REACT_APP_APIURL +
        `/download?id=${params.id}`
      )
      .then(({ data }: any) => {
        return data
      })
    window.self.location = url
  };

  useEffect(() => {
    getUrlLink();
  }, []);


  return (
    <>
      <p>seu arquivo está sendo baixado</p>
    </>
  );
};

export default DownloadFileRoute;
