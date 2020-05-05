import React from 'react'
import { CircularProgress } from '@material-ui/core'
import styled from "styled-components";

const Wrapper = styled.div`
  text-align: center;
  justify-content: center;
`;
const Loader = () => (
  <Wrapper>
    <h3>Aguarde...</h3>
    <CircularProgress style={{ color: '#d3d3d3' }} />
  </Wrapper>
)

export default Loader
