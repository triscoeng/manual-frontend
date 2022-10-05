import { useParams } from "react-router-dom";

const New = () => {

  const params = useParams()
  console.log(params)

  return <div>New</div>;
};

export default New;
