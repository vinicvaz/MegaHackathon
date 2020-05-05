/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";
import { Modal, TextField, Button, InputLabel } from "@material-ui/core";
import { answerQuestion } from "../services/api";

const ModalWrapper = styled.div`
  background-color: white;
  margin: 5% auto;
  max-width: 50%;
  justify-content: center;
  align-content: center;
  align-items: center;
  padding: 2em;
  color: rgb(12, 41, 130);
  font-size: 15px;
`;

const CloseButtonContainer = styled.div`
  width: 100%;
  justify-content: right;
  cursor: pointer;
  color: red;
  text-align: right;
  margin: 0;
  padding: 0;
`;

const SectionLabel = styled.div`
  justify-content: center;
  text-align: center;
  text-decoration: 1px underline #d3d3d3;
`;

const ProductIdContainer = styled.div`
  width: 100%;
  background-color: #add8e6;
  justify-content: right;
  text-align: right;
  font-weight: bolder;
}}
`;

const ProductIdLabel = styled.span`
  background-color: grey;
  color: white;
  padding-left: 0.7em;
}}
`;

const ProductInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 2em;
  text-align: left;
`;

const PriceLabel = styled.div`
  left: 80%;
`;

const StyledImage = styled.img`
  border: 1px solid blue;
  height: 80px;
  width: 80px;
  object-fit: contain;
}}
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-drap: wrap;
  text-align: left;
  padding: 0;
  margin: 0;
}}
`;

const ProductTitleLabel = styled.p`
  font-weight: bold;
  margin: 0;
  padding: 0;
}}
`;

const ProductDetailsContainer = styled.div`
  padding: 0.5em 0.6em 1.5em 0.6em;
`;

const QuestionDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
`;

const QuestionInfo = styled.div`
  width: 100%;
  background-color: #add8e6;
  display: flex;
  justify-content: space-between;
`;

const UserLabel = styled.div`
  width: 100%;
  text-align: left;
`;

const ProductDetailsModal = ({ opened, closeModal, data, status }) => {
  const {
    user,
    price,
    productTitle,
    img,
    question,
    date,
    product_id,
    id,
    questionId,
    answer,
  } = data;
  const [answerInput, setAnswer] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);

  const submitAnswer = async () => {
    const payload = {
      answer: answerInput,
    };
    const res = await answerQuestion(product_id, id, payload);
    if (res && res.data.error) {
      console.log("Error...");
      setError("Ocorreu um erro");
    }
    if (res && res.status === 200 && res.data) {
      setSuccess("Reposta enviada com sucesso");
    }
  };

  return (
    <Modal
      open={opened}
      onClose={closeModal}
      aria-labelledby={productTitle}
      aria-describedby={"Produto"}
    >
      <ModalWrapper>
        <CloseButtonContainer onClick={closeModal}>x</CloseButtonContainer>
        <SectionLabel>detalhes do produto</SectionLabel>
        <ProductDetailsContainer>
          <ProductIdContainer>
            <ProductIdLabel>{product_id}</ProductIdLabel>
          </ProductIdContainer>
          <div>
            <ProductInfoContainer>
              <div>
                <StyledImage alt="Imagem do produto" src={img} />
              </div>
              <ProductInfo>
                <ProductTitleLabel>{productTitle}</ProductTitleLabel>
                <p>
                  EAN {id} | meu código {questionId}
                </p>
              </ProductInfo>
              <PriceLabel>R$ {price || "85,00"}</PriceLabel>
            </ProductInfoContainer>
          </div>
        </ProductDetailsContainer>
        <SectionLabel>mensagem</SectionLabel>
        <QuestionDetailsContainer>
          <UserLabel>{user}</UserLabel>
          <QuestionInfo>
            <span>{question}</span>
            <span>{date}</span>
          </QuestionInfo>
        </QuestionDetailsContainer>
        <div
          style={{
            paddingTop: "0.8em",
          }}
        >
          <InputLabel>Resposta {status === 2 && "BOT"}</InputLabel>
          {status !== 0 && answer ? (
            <span>{answer}</span>
          ) : (
            <>
              {success ? (
                <span>{success}</span>
              ) : error ? (
                <span>{error}</span>
              ) : (
                <>
                  {" "}
                  <TextField
                    style={{ padding: "0.5em 0" }}
                    fullWidth
                    variant="filled"
                    value={answerInput}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => submitAnswer()}
                  >
                    enviar
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </ModalWrapper>
    </Modal>
  );
};

export default ProductDetailsModal;
