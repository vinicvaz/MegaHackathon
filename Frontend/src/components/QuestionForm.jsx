import React from "react";
import styled from "styled-components";
import {
  MenuItem,
  InputLabel,
  Button,
  TextField,
  Select,
  Typography,
} from "@material-ui/core";
import { fetchAnswers, fetchQuestions } from "../services/api";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const Wrapper = styled.div`
  justify-content: center;
  text-align: center;
  padding: 0.6em 2em;
}}
`;

const ProductInputContainer = styled.div`
  border: 1px solid #d3d3d3;
  border-radius: 2%;
  margin: 0.6em;
  padding-bottom: 1.6em;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}}
`;

const SelectContainer = styled.div`
  justify-content: center;
  text-align: center;
  padding: 0.6em 2em;
  display: flex;
  flex-direction: column;
}}
`;

const StyledTextField = styled(TextField)`
  background-color: #f4f4f4;
  width: 80%;
  padding: 0.3;
`;

const StyledButton = styled(Button)`
  width: 48%;
  text-align: center;
  justify-content: center;
}}
`;

const QuestionForm = ({ data }) => {
  const [answer, setAnswer] = React.useState("");
  const [answerQuality, setAnswerQuality] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [responseData, setResponseData] = React.useState(null);
  const [productId, setProductId] = React.useState(null);
  const [selectedQuestion, setSelectedQuestion] = React.useState(null);

  //05bbdfd4-ab32-4b3e-ab63-5acfec36cfcb
  const submitForm = async () => {
    const payload = {
      product_id: productId,
      answer,
      is_good: answerQuality,
    };

    await fetchAnswers(payload).then((res, err) => {
      if (res !== err) {
        setSuccess(true);
        setResponseData(res.data);
      } else {
        setErrorMsg("Ocorreu um erro.");
      }
    });
  };

  const getQuestions = async () => {
    setLoading(true);
    await fetchQuestions(productId).then((res, error) => {
      if (res !== error) {
        if (res.data && res.data.length > 0) {
          console.dir(res.data);
          setResponseData(res.data);
        } else {
          setErrorMsg("Nenhuma pergunta para este produto.");
        }
      } else {
        setErrorMsg("Erro ao encontrar produto!");
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
        <h2>Resposta enviada com sucesso.</h2>
        <Link to="/">
          <Button>Voltar</Button>
        </Link>
      </>
    );
  }
  return (
    <Wrapper>
      <ProductInputContainer>
        <Typography>
          Digite o ID do produto.. (e.g. 05bbdfd4-ab32-4b3e-ab63-5acfec36cfcb)
        </Typography>
        <TextField
          style={{ margin: "1em" }}
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          variant="outlined"
        />
        <StyledButton
          color="primary"
          variant="outlined"
          onClick={() => getQuestions()}
        >
          Obter perguntas
        </StyledButton>
      </ProductInputContainer>
      <SelectContainer>
        <Typography>Selecione uma pergunta</Typography>
        <Select
          fullWidth
          labelId="demo-simple-select-label"
          id="filled-basic"
          onChange={(e) => setSelectedQuestion(e.target.value)}
          name="selectedQuestion"
          variant="outlined"
          value={selectedQuestion}
          disabled={!responseData}
        >
          {responseData &&
            responseData.map(({ id, question }) => (
              <MenuItem key={id} value={id}>
                {question}
              </MenuItem>
            ))}
        </Select>
      </SelectContainer>
      <Typography variant="h4" color="error">
        {errorMsg}
      </Typography>
      {responseData && selectedQuestion && (
        <>
          <StyledTextField
            id="filled-basic"
            onChange={(e) => setAnswer(e.target.value)}
            label="Sua resposta:"
            variant="filled"
            value={answer}
          />
          <InputLabel
            style={{ padding: "1.5em" }}
            id="demo-simple-select-label"
          >
            Essa pergunta é
          </InputLabel>
          <Select
            style={{ width: "35vw" }}
            labelId="demo-simple-select-label"
            id="filled-basic"
            onChange={(e) => setAnswerQuality(e.target.value)}
            name="answerQuality"
            variant="outlined"
            value={answerQuality}
          >
            <MenuItem value={1}>Útil / interessante</MenuItem>
            <MenuItem value={0}>Sem sentido</MenuItem>
          </Select>

          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => submitForm()}
            >
              Enviar
            </Button>
          </div>
        </>
      )}

      {responseData &&
        responseData.length > 0 &&
        responseData.map((el) => <li>{el}</li>)}
    </Wrapper>
  );
};

export default QuestionForm;
