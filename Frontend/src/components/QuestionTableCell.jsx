import React from "react";
import { TableCell } from "@material-ui/core";
import styled from "styled-components";

const StyledTableCell = styled(TableCell)`
  border: 1px solid black;
  color: ${({color}) => color ? color : ''} ;
  font-weight: ${({ bold }) => bold ? 'bold' : ''};
  cursor: ${({pointer}) => pointer ? 'pointer' : ''};
  text-align: center;
  padding: 0.5em 1.2em;
  width: ${({ width }) => width};
`; 

const QuestionTableCell = ({ label, value, onClick, color, bold, pointer, width }) => {
  return (
    <StyledTableCell
     pointer={pointer}
     width={width}
     bold={bold}
     color={color}
    >
      <span onClick={onClick}>
        {label} {value}
      </span>
    </StyledTableCell>
  );
};
export default QuestionTableCell;
