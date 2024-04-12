import React from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-height: 8vh;
  background-color: #282c34;
  color: white;
  font-size: 1.2rem;
`;

const NavLink = styled.div`
  cursor: pointer;
  padding: 0 1rem;
`;

const Navbar = ({ setActiveSection }) => {
  return (
    <Nav>
      <NavLink onClick={() => setActiveSection('create')}>Create</NavLink>
      <NavLink onClick={() => setActiveSection('buy')}>Buy</NavLink>
      <NavLink onClick={() => setActiveSection('purchased')}>View Purchased AdSpaces</NavLink>
    </Nav>
  );
};

export default Navbar;
