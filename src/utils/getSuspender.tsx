const getSuspender = (promise: any) => {
  let status = "pending";
  let response: any;

  const suspender = promise.then(
    (res: any) => {
      status = "success";
      response = res.data;
    },
    (err: any) => {
      status = "error";
      response = err.data.message;
    }
  );

  const read = () => {
    switch (status) {
      case "pending":
        throw suspender;
      case "error":
        throw response;
      default:
        return response;
    }
  };

  return { read };
};

export default getSuspender;
