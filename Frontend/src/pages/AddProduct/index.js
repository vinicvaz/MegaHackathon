import React from "react";
import styled from "styled-components";
import { TextField, Button, Container } from "@material-ui/core";
import { MoneyMask } from "../../components";
import { createProduct } from "../../services/api";
import { Link } from "react-router-dom";

const StyledTextField = styled(TextField)`
  padding: 0.5em 0;
`;

const ButtonsContainer = styled(Button)`
  height: 3em;
  margin-bottom: 1em;
`;

const AddProduct = () => {
  const [name, setName] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [size, setSize] = React.useState({ width: 0, height: 0, length: 0 });
  const [color, setColor] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [weight, setWeight] = React.useState(1);
  const [description, setDescription] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [newProductId, setNewProductId] = React.useState(
    "05bbdfd4-ab32-4b3e-ab63-5acfec36cfcb"
  );
  const [copySuccess, setCopySuccess] = React.useState("Copiar ID");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newProductId);
    setCopySuccess("Copiado!");
  };
  const handleSubmit = async () => {
    const payload = {
      name,
      description,
      quantity: Number(amount),
      size,
      color,
      price: Number(price),
      weight: Number(weight),
    };

    createProduct(payload).then((response, error) => {
      if (response !== error) {
        setSuccess("Produto registrado com sucesso.");
        setNewProductId(response.data.id);
      } else {
        setSuccess("Não ocorreu bem. :/");
      }
    });
  };

  return (
    <Container>
      <h2>Adicionar produto</h2>
      <StyledTextField
        fullWidth
        label="Nome"
        variant="filled"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <StyledTextField
        fullWidth
        label="Descrição"
        variant="filled"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <StyledTextField
        fullWidth
        label="Cor"
        variant="filled"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <StyledTextField
        fullWidth
        label="Peso (kg)"
        variant="filled"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <StyledTextField
        label="comprimento (cm)"
        variant="outlined"
        value={size.length}
        onChange={(e) => setSize({ ...size, length: Number(e.target.value) })}
      />
      <StyledTextField
        label="largura (cm)"
        variant="outlined"
        value={size.width}
        onChange={(e) => setSize({ ...size, width: Number(e.target.value) })}
      />
      <StyledTextField
        label="altura (cm)"
        variant="outlined"
        value={size.height}
        onChange={(e) => setSize({ ...size, height: Number(e.target.value) })}
      />
      <StyledTextField
        fullWidth
        label="Preço"
        variant="standard"
        value={price}
        InputProps={{
          inputComponent: MoneyMask,
        }}
        name="numberformat"
        id="formatted-numberformat-input"
        onChange={(e) => setPrice(e.target.value)}
      />
      <StyledTextField
        fullWidth
        label="Quantidade"
        variant="standard"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <ButtonsContainer>
        <Button
          disabled={success.length > 0}
          onClick={() => handleSubmit()}
          variant="outlined"
          color="primary"
        >
          {success && success.length > 0 ? success : "Enviar"}
        </Button>

        {success && success.length > 0 && (
          <>
            <Button
              style={{ marginLeft: "1.2em" }}
              variant="text"
              color="primary"
              onClick={(e) => copyToClipboard(e)}
            >
              {copySuccess}
            </Button>
            <Link to="/create-question">
              <Button
                onClick={() => handleSubmit()}
                variant="outlined"
                color="secondary"
              >
                Criar pergunta
              </Button>
            </Link>
          </>
        )}
      </ButtonsContainer>
    </Container>
  );
};

export default AddProduct;
