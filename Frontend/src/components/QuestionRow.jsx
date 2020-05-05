import React, { useEffect } from "react";
import { TableRow, Checkbox } from "@material-ui/core";
import ProductDetailsModal from "./ProductDetailsModal";
import PropTypes from "prop-types";
import QuestionTableCell from "./QuestionTableCell";

const QuestionRow = ({ data }) => {
  const { product_id, time, question, id, user } = data;
  const [timer, setTimer] = React.useState(Number(time));
  const [modal, setModal] = React.useState(false);
  const [hover, toggleHover] = React.useState(false);
  const [checked, toggleChecked] = React.useState(false);

  useEffect(() => {
    setTimeout(() => {
      setTimer(time + 1);
    }, 60000);
  });

  const UserSpan = (user) => {
    return <span style={{ fontWeight: "bold" }}>{user}</span>;
  };

  const SkuSpan = (sku) => (
    <span style={{ fontWeight: "bolder" }}>{sku}</span>
  );

  return (
    <>
      <TableRow
        key={id}
        style={{ backgroundColor: hover ? "#f4f4f4" : "white" }}
        onMouseEnter={() => toggleHover(!hover)}
        onMouseLeave={() => toggleHover(!hover)}
      >
        <td>
          <Checkbox
            onChange={(e) => toggleChecked(e.target.checked)}
            checked={checked}
          />
        </td>

        <QuestionTableCell
          width="16vw"
          key={1}
          label={<span>há {timer}</span>}
          value={"minutos"}
        />
        <QuestionTableCell
          width="10vw"
          key={2}
          onClick={() => setModal(true)}
          value={"pergunta"}
          color="blue"
          pointer={"pointer"}
          bold={"bold"}
        />
        <QuestionTableCell
          width="20vw"
          key={3}
          label={"sku"}
          value={SkuSpan(product_id)}
        />
        <QuestionTableCell key={4} label={"por"} value={UserSpan(user)} />
        <QuestionTableCell
          key={5}
          style={{ fontWeight: "bolder" }}
          value={question}
        />
      </TableRow>
      {modal && (
        <ProductDetailsModal
          opened={modal}
          closeModal={() => setModal(false)}
          data={data}
        />
      )}
    </>
  );
};

QuestionRow.propTypes = {
  data: PropTypes.object,
  status: PropTypes.string.isRequired,
};

export default QuestionRow;
