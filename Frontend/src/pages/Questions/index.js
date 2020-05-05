import React, { useEffect } from "react";
import { Box, Tabs, Tab, Badge, TableBody } from "@material-ui/core";
import { QuestionRow } from "../../components";
import { fetchRandomQuestions } from "../../services/api";
import Loader from "../../components/Loader";
import { Container, Row } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import styled from "styled-components";

const Styles = styled.div`
  .header-row {
    margin-top: 30px;
  }
  .table-header {
    text-aling: center;
    justify-content: center;
  }
`;

export default function Questions() {
  const [data, setData] = React.useState(null);
  const [tab, setTab] = React.useState(0);
  const [loadingQuestions, setLoadingQuestions] = React.useState(false);
  let resPerPage = 10;
  useEffect(() => {
    const fakeData = [
      {
        id_question: "3290342",
        date: "2020-08-05",
        user: "BOMCURSO10",
        question: "Qual a garantia do produto?",
        status: "new",
        product_id: "d9i094i3",
        productTitle: "Cera de abelha 500g pura filtrada",
        time: 23242,
        is_good: 1,
        img:
          "https://http2.mlstatic.com/cera-de-abelhas-100-pura-filtrada-500-gramas-D_Q_NP_858082-MLB31838229733_082019-R.webp",
      },
      {
        id_question: "854924",
        date: "2020-08-05",
        user: "PATO57",
        question: "Qual as cores disponíveis?",
        status: 1,
        productTitle: "Fio encerado para macrame",
        product_id: "8d9au98",
        time: 113242,
        answer: "18 meses",
        is_good: 1,
        img:
          "https://http2.mlstatic.com/cera-de-abelhas-100-pura-filtrada-500-gramas-D_Q_NP_858082-MLB31838229733_082019-R.webp",
      },
      {
        id_question: "724923",
        date: "2020-08-05",
        user: "JARDINS&SUBSTRATOS",
        question: "Vem com o manual original?",
        status: 2,
        productTitle: "Prancha de surf 6 pés",
        product_id: "290ds7e",
        is_good: 1,
        time: 2353,
      },
      {
        id_question: "0672832",
        date: "2020-08-05",
        user: "TESTEUSER",
        question: "Qual o numero do modelo?",
        status: 1,
        productTitle: "Tênis Nike para corrida",
        product_id: "02da0s9",
        time: 21242,
        is_good: 1,
        answer: "BRA 40.",
      },
    ];
    /* const fetchData = async () => {
      const res = await api.get('/questions')
      if (res.ok && res.data) {
        setData(res.data)
      }
    }
    //fetchData(); */
    const notAnswered = fakeData.filter(
      (el) => el.status === "waiting" || el.status === "new"
    );
    const sellerAnswered = fakeData.filter((el) => el.status === "manual");
    const botAnswered = fakeData.filter((el) => el.status === "automatic");
    const all = fakeData;
    const deleted = fakeData.filter((el) => el.status === "deleted");
    setData({ notAnswered, sellerAnswered, botAnswered, all, deleted });
  }, []);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  const doUpdate = async () => {
    setLoadingQuestions(true);
    try {
      const response = await fetchRandomQuestions(resPerPage);
      if (response && response.data && response.data.length > 0) {
        const { data } = response;
        const notAnswered = data.filter(
          (el) => el.status === "waiting" || el.status === "new"
        );
        const sellerAnswered = data.filter((el) => el.status === "manual");
        const botAnswered = data.filter((el) => el.status === "automatic");
        const all = data;
        const deleted = data.filter((el) => el.status === "deleted");
        setData({ notAnswered, sellerAnswered, botAnswered, all, deleted });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const TabPanel = ({ children, value, index, data, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Styles>
            <Table bordered hover>
              <thead>
                <tr>
                  <th></th>
                  <th>Tempo desde publicação</th>
                  <th>Responder</th>
                  <th>Produto (ID)</th>
                  <th>Usuário</th>
                  <th>Conteúdo</th>
                </tr>
              </thead>
              <TableBody>
                {data &&
                  data.map((el, key) => (
                    <QuestionRow key={key} data={el} status={el.status} />
                  ))}
              </TableBody>
            </Table>
          </Styles>
        </Box>
      )}
    </div>
  );

  return (
    <Container>
      <Styles>
        <Row className="header-row">
          <h2>Perguntas</h2>
        </Row>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
        >
          <Tab
            icon={
              <Badge
                badgeContent={
                  data && data.notAnswered ? data.notAnswered.length : 0
                }
                color="primary"
              />
            }
            label="esperando resposta"
            {...a11yProps(0)}
          />
          <Tab
            icon={
              <Badge
                badgeContent={
                  data && data.sellerAnswered ? data.sellerAnswered.length : 1
                }
                color="primary"
              />
            }
            label="respondidas pelo vendedor"
            {...a11yProps(1)}
          />
          <Tab
            icon={
              <Badge
                badgeContent={
                  data && data.botAnswered ? data.botAnswered.length : 123
                }
                color="error"
              />
            }
            label="respondidas pelo bot"
            {...a11yProps(2)}
          />
          <Tab
            icon={
              <Badge
                badgeContent={data && data.all ? data.all.length : 0}
                color="primary"
              />
            }
            label="todas"
            {...a11yProps(3)}
          />
          <Tab
            icon={
              <Badge
                badgeContent={data && data.deleted ? data.deleted.length : 0}
                color="error"
              />
            }
            label="excluídas"
            {...a11yProps(4)}
          />
        </Tabs>
        <TabPanel
          key={0}
          value={tab}
          index={0}
          data={data && data.notAnswered ? data.notAnswered : null}
        />
        <TabPanel
          key={1}
          value={tab}
          index={1}
          data={data && data.sellerAnswered ? data.sellerAnswered : null}
        />

        <TabPanel
          key={2}
          value={tab}
          index={2}
          data={data && data.botAnswered ? data.botAnswered : null}
        />

        <TabPanel
          key={3}
          value={tab}
          index={3}
          data={data && data.all ? data.all : null}
        />

        <TabPanel
          key={4}
          value={tab}
          index={4}
          data={data && data.deleted ? data.deleted : null}
        />
        {tab === 0 && (
          <h4
            style={{ cursor: "pointer", textDecoration: "1px underline blue" }}
            onClick={() => doUpdate()}
          >
            {!loadingQuestions
              ? `obter mais ${resPerPage} perguntas`
              : "aguarde..."}
          </h4>
        )}
        {loadingQuestions && <Loader />}
      </Styles>
    </Container>
  );
}
