// styles.js
import styled from 'styled-components';

// Add these two new components
export const Navbar = styled.nav`
  display: flex;
  justify-content: space-around;
  padding: 1rem 0;
  background-color: #333;
`;

export const NavLink = styled.a`
  color: white;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

// Keep the rest of the existing components


export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-align: center;
`;

export const SubTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 40px;
`;

export const Label = styled.label`
  font-size: 1.2rem;
`;

export const Input = styled.input`
  padding: 10px;
  font-size: 1.1rem;
`;

export const Button = styled.button`
  padding: 10px 20px;
  font-size: 1.1rem;
  cursor: pointer;
  background-color: #4caf50;
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  transition-duration: 0.4s;
  &:hover {
    background-color: #45a049;
  }
`;

export const AdSpaceContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

export const AdSpaceCard = styled.div`
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const AdSpaceImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
`;

export const AdSpaceText = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

export const AdSpacePrice = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 10px;
`;
