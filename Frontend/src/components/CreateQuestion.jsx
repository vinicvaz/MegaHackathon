import React from "react";
import styled from "styled-components";
import { Button, TextField, Typography } from "@material-ui/core";
import { createQuestion } from "../services/api";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const CreateQuestionContainer = styled.div`
  padding: 0.6em 2em;
`;

const ProductInputContainer = styled.div`
  border: 1px solid #d3d3d3;
  margin: 0.6em;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const MaterialButton = styled(Button)`
  text-align: center;
  justify-content: center;
  margin: 2em;
`;

const CreateQuestion = () => {
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [productId, setProductId] = React.useState(null);
  const [question, setQuestion ] = React.useState('')

  //05bbdfd4-ab32-4b3e-ab63-5acfec36cfcb
  const submitForm = async () => {
    setLoading(true);
    await createQuestion({ product_id: productId,question }).then((res, err) => {
      if (res !== err) {
        setSuccess(true);
      } else {
        setError(true);
      }
      setLoading(false);
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (success) {
    return (
      <>
        <h2>Pergunta criada com sucesso.</h2>
        <Link to="/">
          <Button>Voltar</Button>
        </Link>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h2>Ocorreu um erro ao criar a pergunta.</h2>
        <Link to="/">
          <Button>Voltar</Button>
        </Link>
      </>
    );
  }
  return (
    <CreateQuestionContainer>
      <h2>Criar pergunta</h2>
      <ProductInputContainer>
        <Typography>Digite o ID do produto</Typography>
        <TextField
          style={{ margin: "1em" }}
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          autoFocus
          variant="outlined"
        />
      </ProductInputContainer>
      <TextField
        style={{ textAlign: "center", justifyContent: "center" }}
        value={question}
        label="Digite sua pergunta"
        onChange={(e) => setQuestion(e.target.value)}
        fullWidth
        variant="outlined"
      />

      <MaterialButton
        color="primary"
        variant="outlined"
        onClick={() => submitForm()}
      >
        Ok
      </MaterialButton>
    </CreateQuestionContainer>
  );
};

export default CreateQuestion;
