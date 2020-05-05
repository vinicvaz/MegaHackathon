import React from "react";
import styled from "styled-components";
import { MenuItem } from "@material-ui/core";
import NavbarItem from "./NavbarItem";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  margin: 0.4em 1em;
`;

const StyledMenuItem = styled(MenuItem)`
  font-size: 18px;
  color: black;
  font-weight: bold;
  text-decoration: none;
`;

const StyledA = styled.a`
  text-decoration: none;
`;

const Navbar = () => (
  <Wrapper>
    <StyledA
      href="https://www.olist.com"
      rel="noopener noreferrer"
      target="_blank"
    >
      <StyledMenuItem>olist</StyledMenuItem>
    </StyledA>
    <NavbarItem target="/" label="início" />
    <NavbarItem target="/" disabled={true} label="pedidos" />
    <NavbarItem
      target="/questions"
      label="perguntas"
      color="blue"
      bold={true}
    />
    <NavbarItem label="financeiro" disabled={true} />
  </Wrapper>
);

export default Navbar;
