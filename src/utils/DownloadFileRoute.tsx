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
          `/download?id=${params.id}&hash=${params.hash}`
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
    <object
      data="http://africau.edu/images/default/sample.pdf"
      type="application/pdf"
      width="100%"
      height="100%"
    >
      <p>
        Alternative text - include a link{" "}
        <a href="http://africau.edu/images/default/sample.pdf">to the PDF!</a>
      </p>
    </object>
  );
};

export default DownloadFileRoute;
