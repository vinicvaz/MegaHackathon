import React from "react";
import styled from "styled-components";
//import { useHistory } from "react-router-dom";
import { fetchAwaitingQuestionsCount } from "../../services/api";
import { Grid, Paper } from "@material-ui/core";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import Button from "react-bootstrap/Button";
import { Container, Row, Col } from "react-bootstrap";

const StyledPaper = styled(Paper)`
  color: rgb(12, 41, 100);
  padding: 0.5em;
  text-align: center;
  justify-content: center;
`;

const LabelSpan = styled.div`
  display: flex;
  flexwrap: wrap;
  flexdirection: column;
  padding: 0;
  margin: 0 25%;
  textalign: center;
  aligncontent: center;
`;

const DataLabel = styled.h1`
  letter-spacing: 0.1em;
  text-align: center;
  font-weight: bold;
  margin: 0.6em auto 0 auto;
`;

const StyledP = styled.p`
  cursor: pointer;
  text-decoration: 1px underline blue;
  text-align: center;
  padding-top: 4em;
}}
`;

const Styles = styled.div`
  .header-row {
    margin-left: 30px;
    margin-top: 30px;
    margin-bottom: 40px;
  }
`;

export default function Home() {
  /*const [password, setPassword] = useState("");
  const history = useHistory();

  const handleLogin = async () => {
    const response = await userData.login({
      session: { user: true },
      password,
    });
    console.log(response.data.ok);
    if (!response.data.ok === true) {
      alert("Acesso negado");
    } else {
      history.push("profile");
    }
  };*/
  const [awaitingCount, setAwaitingCount] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const fetchAwaitingCount = async () => {
      const res = await fetchAwaitingQuestionsCount();
      if (res && res.data && res.data.count) {
        setAwaitingCount(res.data.count);
      } else {
        setAwaitingCount(0);
      }
    };
    fetchAwaitingCount();
    setLoading(false);
  }, []);

  const charts = [
    {
      label: "aguardando resposta",
      data: awaitingCount || "nenhuma",
      caption: `pergunta${awaitingCount ? "s" : ""}`,
    },
    { label: "aguardando faturar", data: 7, caption: "pedidos" },
    { label: "aguardando embalar", data: "nenhum", caption: "itens em atraso" },
    { label: "aguardando postagem", data: 7, caption: "itens em atraso" },
    { label: "rastreando envios", data: 13, caption: "itens" },
  ];

  const doUpdate = async () => {
    setLoading(true);
    const res = await fetchAwaitingQuestionsCount();
    if (res && res.data && res.data.count) {
      setAwaitingCount(res.data.count);
    } else {
      setAwaitingCount(0);
    }
    setLoading(false);
  };

  return (
    <Container fluid={true}>
      <Styles>
        <Row className="header-row">
          <h2 className="test">Bem-vindo</h2>
        </Row>

        {/*
      <TextField
        style={{ padding: "0.5em 0" }}
        fullWidth
        variant="filled"
        label="Sua ID:"
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={() => handleLogin()}>
        Entrar
      </Button>*/}
        <Row className="justify-content-center">
          <Col item xs={12} md={2}>
            <Link to="/create-question">
              <Button variant="outline-primary">Criar pergunta</Button>
            </Link>
          </Col>
          <Col item xs={12} md={2}>
            <Link to="/add">
              <Button variant="outline-primary">Adicionar produto</Button>
            </Link>
          </Col>
          <Col className="justify-content-center" xs={12} md={2}>
            <Link to="/answer-question">
              <Button variant="outline-primary">Responder pergunta</Button>
            </Link>
          </Col>
          <Col item xs={12} md={2}>
            <Link to="/questions">
              <Button variant="outline-primary" color="secondary">
                Ver todas as perguntas
              </Button>
            </Link>
          </Col>
          <Col item xs={12} md={2}>
            <Link to="/delete">
              <Button variant="outline-danger">Excluir produto</Button>
            </Link>
          </Col>
        </Row>
      </Styles>
      {loading && <Loader />}
      <Row style={{ paddingTop: "4em" }}>
        <Col justify="center" xs={12} md={12}>
          <Grid container justify="center" spacing={2}>
            {charts.map(({ label, data, caption }, index) => (
              <Grid key={index} item>
                <StyledPaper>
                  <LabelSpan>{label}</LabelSpan>
                  <DataLabel>{data}</DataLabel>
                  {caption}
                </StyledPaper>
              </Grid>
            ))}
          </Grid>
        </Col>
      </Row>
      <StyledP onClick={() => doUpdate()}>(atualizar)</StyledP>
    </Container>
  );
}
