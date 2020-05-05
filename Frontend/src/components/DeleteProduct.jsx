import React from "react";
import {
  Button,
  TextField,
  Typography,
} from "@material-ui/core";
import { removeProduct } from "../services/api";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const DeleteProduct = () => {
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [productId, setProductId] = React.useState(null);

  //05bbdfd4-ab32-4b3e-ab63-5acfec36cfcb
  const submitForm = async () => {
    setLoading(true);
    const res = await removeProduct(productId);
    if (res.ok && res.data) {
      setSuccess(true);
    }
    setLoading(false);
  };


  if (loading) {
    return <Loader />;
  }

  if (success) {
    return (
      <>
        <h2>Produto apagado com sucesso.</h2>
        <Link to="/">
          <Button>Voltar</Button>
        </Link>
      </>
    );
  }
  return (
    <div style={{justifyContent: "center",
    textAlign: "center",
    padding: "0.6em 2em", }}>
      <div
        style={{
          border: "1px solid #d3d3d3",
          margin: '0.6em',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Typography>Digite o ID do produto</Typography>
        <TextField
          style={{ margin: '1em' }}
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          variant="outlined"
        />
        <Button
          style={{ width: '48%', textAlign: 'center', justifyContent: 'center' }}
          color="primary"
          variant="outlined"
          onClick={() => submitForm()}
        >
          Remover
        </Button>
      </div>
    </div>
  );
};

export default DeleteProduct;
