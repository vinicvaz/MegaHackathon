/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";
import { MenuItem } from "@material-ui/core";
const NavbarItem = ({ label, target, type, color, bold, disabled }) => {
  return (
    <>
      {type === "a" ? (
        <a
          style={{
            fontSize: "16px",
            color: "black",
            textDecoration: "none",
          }}
          href={target}
          rel="noopener noreferrer"
        >
          <MenuItem>{label}</MenuItem>
        </a>
      ) : (
        <Link style={{ textDecoration: "none" }} to={target || '/'}>
          <MenuItem
            style={{
              fontSize: "16px",
              color: color || "black",
              fontWeight: bold ? "bolder" : "normal",
              visibility: disabled && "none",
            }}
            disabled={disabled}
          >
            {label}
          </MenuItem>
        </Link>
      )}
    </>
  );
};

export default NavbarItem;
