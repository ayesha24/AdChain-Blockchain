// import React from 'react';
// import { Link } from 'react-router-dom';
// import './FrontPage.css';

// const FrontPage = () => {
//   return (
//     <div className="front-page">
//       <h1>Welcome to AdSpace Marketplace</h1>
//       <p>
//         AdSpace Marketplace is a decentralized application built on Ethereum,
//         where users can create, buy, and sell digital ad spaces.
//       </p>
//       <p>
//         The platform is powered by smart contracts, ensuring security and
//         transparency in each transaction.
//       </p>
//       <Link to="/marketplace">
//         <button>Enter Marketplace</button>
//       </Link>
//     </div>
//   );
// };

// export default FrontPage;

import React from 'react';
import styled from 'styled-components';

const FrontPageContainer = styled.div`
  background-image: url('/images/social_icons.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Heading = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Description = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  text-align: center;
  max-width: 800px;
`;

const MarketplaceButton = styled.button`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  background-color: #4CAF50;
  border: none;
  padding: 15px 30px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 4px 2px;
  border-radius: 8px;
  transition-duration: 0.4s;

  &:hover {
    background-color: #45a049;
    color: white;
  }
`;

const FrontPage = () => {
  return (
    <FrontPageContainer>
      <Heading>Welcome to the Decentralized Ad Marketplace</Heading>
      <Description>
        Here you can buy and sell ad spaces in a decentralized manner using blockchain technology.
      </Description>
      <Description>
        To get started, navigate to the marketplace by clicking the button below.
      </Description>
      <MarketplaceButton onClick={() => (window.location.href = '/marketplace')}>
        Go to Marketplace
      </MarketplaceButton>
    </FrontPageContainer>
  );
};

export default FrontPage;
