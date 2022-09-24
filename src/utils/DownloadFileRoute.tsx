import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const DownloadFileRoute = () => {
  const params = useParams();
  const [linkUrl, setLinkUrl] = useState("");

  const getUrlLink = async () => {
    axios
      .get(
        process.env.REACT_APP_APIURL +
        `/download?id=${params.id}`
      )
      .then(({ data }) => {
        setLinkUrl(data);
        window.location.assign(data);
      });
  };

  useEffect(() => {
    return () => {
      getUrlLink();
    };
  }, []);

  return (
    <p>seu arquivo está sendo baixado</p>
  );
};

export default DownloadFileRoute;
