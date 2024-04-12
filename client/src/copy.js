import Web3 from 'web3';
import React, { useState, useEffect } from 'react';
//import Web3 from 'web3';
import AdSpaceToken from './abis/AdSpaceToken.json';
import ERC20Mock from './abis/ERC20Mock.json'; 



//import './App.css';
import {
  Container,
  Title,
  SubTitle,
  Form,
  Label,
  Input,
  Button,
  AdSpaceContainer,
  AdSpaceCard,
  AdSpaceImage,
  AdSpaceText,
  AdSpacePrice,
} from './styles';

const App = () => {
  const [account, setAccount] = useState('');
  const [adSpaceToken, setAdSpaceToken] = useState({});
  const [adSpaces, setAdSpaces] = useState([]);
  const [totalAdSpaces, setTotalAdSpaces] = useState(0);
  const [loading, setLoading] = useState(false);
  const [adSpacesCreatedByUser, setAdSpacesCreatedByUser] = useState(0);
  const [purchasedAdSpaces, setPurchasedAdSpaces] = useState([]);

  const [formValues, setFormValues] = useState({
    uri: '',
    price: '',
    imageUrl: '',
  });

  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545'); 

  useEffect(() => {
    if (account === '') {
      loadBlockchainData();
      getAdSpacesCreatedByUser(adSpaceToken, account);

    }
  }, [account]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { uri, price, imageUrl } = formValues;
    const priceInWei = Web3.utils.toWei(price, 'ether');
    await createAdSpace(uri, priceInWei, imageUrl);
    setFormValues({
      uri: '',
      price: '',
      imageUrl: '',
    });
  };

  const handleAdSpacePurchased = (tokenId) => {
    setPurchasedAdSpaces([...purchasedAdSpaces, tokenId]);
  };

  const loadBlockchainData = async () => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    //setWeb3(web3); 
    const accounts = await web3.eth.getAccounts();
  
    if (!accounts || accounts.length === 0) {
      window.alert('No Ethereum accounts detected. Please connect an account.');
      return;
    }
  
    console.log('Account:', accounts[0]);
  
    const networkId = await web3.eth.net.getId();
    console.log('Network ID:', networkId);
  
    const networkData = AdSpaceToken.networks[networkId];
    console.log('Network data:', networkData);
  
    if (networkData) {
      const adSpaceTokenInstance = new web3.eth.Contract(AdSpaceToken.abi, networkData.address);
  
      setAdSpaceToken(adSpaceTokenInstance);
      const ERC20TokenAddress = '0xd75FBBA592183af19e93B2aCD68c0512C887056e'; // Replace with the actual ERC20 token contract address
      const ERC20TokenInstance = new web3.eth.Contract(ERC20Mock.abi, ERC20TokenAddress);
  
      // Load ad spaces
      const totalAdSpaces = await adSpaceTokenInstance.methods.totalAdSpaces().call();
      setTotalAdSpaces(totalAdSpaces);
      const adSpacePromises = [];
  
      for (let i = 0; i < totalAdSpaces; i++) {
        adSpacePromises.push(adSpaceTokenInstance.methods.adSpaces(i).call());
      }
  
      const adSpaces = await Promise.all(adSpacePromises);
      setAdSpaces(adSpaces);
  
      console.log("Loaded ad spaces:", adSpaces);
  
      adSpaceTokenInstance.methods.adSpacesOf(accounts[0]).call()
        .then(adSpacesCreated => {
          setAdSpacesCreatedByUser(adSpacesCreated.length);
          const adSpacePromises = [];

    for (let i = 0; i < adSpacesCreated.length; i++) {
      adSpacePromises.push(adSpaceTokenInstance.methods.adSpaces(adSpacesCreated[i]).call());
    }

    Promise.all(adSpacePromises)
      .then(adSpaces => {
        setPurchasedAdSpaces(adSpaces);
      });
        });
        const purchasedAdSpaces = await adSpaceTokenInstance.methods.adSpacesOf(accounts[0]).call();
        setPurchasedAdSpaces(purchasedAdSpaces);
      setAccount(accounts[0]);
    } else {
      window.alert('AdSpaceToken contract not deployed to detected network.');
    }
  };

  const getAdSpacesCreatedByUser = async (adSpaceToken, account) => {
    const adSpacesCount = await adSpaceToken.methods.balanceOf(account).call();
    setAdSpacesCreatedByUser(adSpacesCount);
  };
  

  const createAdSpace = async (uri, price, imageUrl) => {
    if (!adSpaceToken || !adSpaceToken.methods) {
      console.error("adSpaceToken is not initialized");
      return;
    }

    setLoading(true);
    await adSpaceToken.methods
    .createAdSpace(uri, price, imageUrl)
    .send({ from: account })
    .on("receipt", (receipt) => {
      setLoading(false);
      loadBlockchainData(adSpaceToken);
    });
};

const buyAdSpace = async (tokenId, price) => {
  setLoading(true);

  const ERC20TokenAddress = '0xd75FBBA592183af19e93B2aCD68c0512C887056e'; // Replace with the actual ERC20 token contract address
  const ERC20TokenInstance = new web3.eth.Contract(ERC20Mock.abi, ERC20TokenAddress);

  await ERC20TokenInstance.methods
    .approve(adSpaceToken._address, price)
    .send({ from: account });

  await adSpaceToken.methods
    .buyAdSpace(tokenId)
    .send({ from: account })
    .on("receipt", (receipt) => {
      setLoading(false);
      handleAdSpacePurchased(tokenId); // add this line
      loadBlockchainData(adSpaceToken);
    });
};


const updateAdSpace = async (tokenId, newUri, newPrice, newImageUrl) => {
  setLoading(true);
  await adSpaceToken.methods
    .updateAdSpace(tokenId, newUri, newPrice, newImageUrl)
    .send({ from: account })
    .on('receipt', (receipt) => {
      setLoading(false);
      loadBlockchainData(adSpaceToken);
    });
};


const deleteAdSpace = async (tokenId) => {
  setLoading(true);
  await adSpaceToken.methods
    .deleteAdSpace(tokenId)
    .send({ from: account })
    .on('receipt', (receipt) => {
      setLoading(false);
      setAdSpaces(adSpaces.filter(adSpace => adSpace.tokenId !== tokenId));
    });
};


// return (
//   <div className="App">
//     <h1>AdSpace Marketplace</h1>
//     <h2>Total Ad Spaces Created by User: {adSpacesCreatedByUser}</h2>
//     <form onSubmit={handleSubmit}>
//       <label htmlFor="uri">Ad Space URI:</label>
//       <input
//         type="text"
//         id="uri"
//         name="uri"
//         value={formValues.uri}
//         onChange={handleInputChange}
//       />
//       <label htmlFor="price">Price (in ETH):</label>
//       <input
//         type="number"
//         step="0.0001"
//         id="price"
//         name="price"
//         value={formValues.price}
//         onChange={handleInputChange}
//       />
//       <label htmlFor="imageUrl">Image URL:</label>
//       <input
//         type="text"
//         id="imageUrl"
//         name="imageUrl"
//         value={formValues.imageUrl}
//         onChange={handleInputChange}
//       />
//       <button type="submit">Create Ad Space</button>
//     </form>
//     {loading ? (
//       <div>Loading...</div>
//     ) : (
//       <>
//         <div className="ad-space-container">
//           {adSpaces.map((adSpace, index) => (
//             <div key={index} className="ad-space-card">
//               <img src={adSpace.imageUrl} alt="Ad Space" />
//               <h3>{adSpace.uri}</h3>
//               <h4>Price: {Web3.utils.fromWei(adSpace.price, 'ether')} ETH</h4>
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   const newPrice = document.getElementById(
//                     `newPrice-${adSpace.tokenId}`
//                   ).value;
//                   updateAdSpace(
//                     adSpace.tokenId,
//                     adSpace.uri,
//                     Web3.utils.toWei(newPrice, 'ether'),
//                     adSpace.imageUrl
//                   );
//                 }}
//               >
//                 <label htmlFor={`newPrice-${adSpace.tokenId}`}>
//                   New Price (in ETH):
//                 </label>
//                 <input
//                   type="number"
//                   step="0.0001"
//                   id={`newPrice-${adSpace.tokenId}`}
//                   name={`newPrice-${adSpace.tokenId}`}
//                 />
//                 <button type="submit">Update</button>
//               </form>
//               <button onClick={() => deleteAdSpace(adSpace.tokenId)}>
//                 Delete
//               </button>
//               <button onClick={() => buyAdSpace(adSpace.tokenId, adSpace.price)}>
//                 Buy
//               </button>
//             </div>
//           ))}
//         </div>
//         <h2>Purchased Ad Spaces:</h2>
// <div className="ad-space-container">
//   {purchasedAdSpaces.map((adSpace, index) => (
//     <div key={index} className="ad-space-card">
//       <img src={adSpace.imageUrl} alt="Ad Space" />
//       <h3>{adSpace.uri}</h3>
//       <h4>Price: {adSpace.price && Web3.utils.fromWei(adSpace.price.toString(), 'ether')} ETH</h4>

//     </div>
//   ))}
// </div>

//       </>
//     )}
//   </div>
// );

// };

// export default App;
return (
  <Container>
    <Title>AdSpace Marketplace</Title>
    <SubTitle>Total Ad Spaces Created by User: {adSpacesCreatedByUser}</SubTitle>
    <Form onSubmit={handleSubmit}>
      <Label htmlFor="uri">Ad Space URI:</Label>
      <Input
        type="text"
        id="uri"
        name="uri"
        value={formValues.uri}
        onChange={handleInputChange}
      />
      <Label htmlFor="price">Price (in ETH):</Label>
      <Input
        type="number"
        step="0.0001"
        id="price"
        name="price"
        value={formValues.price}
        onChange={handleInputChange}
      />
      <Label htmlFor="imageUrl">Image URL:</Label>
      <Input
        type="text"
        id="imageUrl"
        name="imageUrl"
        value={formValues.imageUrl}
        onChange={handleInputChange}
      />
      <Button type="submit">Create Ad Space</Button>
    </Form>
    {loading ? (
      <div>Loading...</div>
    ) : (
      <>
        <AdSpaceContainer>
          {adSpaces.map((adSpace, index) => (
            <AdSpaceCard key={index}>
              <AdSpaceImage src={adSpace.imageUrl} alt="Ad Space" />
              <AdSpaceText>{adSpace.uri}</AdSpaceText>
              <AdSpacePrice>
                Price: {Web3.utils.fromWei(adSpace.price, 'ether')} ETH
              </AdSpacePrice>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  const newPrice = document.getElementById(
                    `newPrice-${adSpace.tokenId}`
                  ).value;
                  updateAdSpace(
                    adSpace.tokenId,
                    adSpace.uri,
                    Web3.utils.toWei(newPrice, 'ether'),
                    adSpace.imageUrl
                  );
                }}
              >
                <Label htmlFor={`newPrice-${adSpace.tokenId}`}>
                  New Price (in ETH):
                </Label>
                <Input
                  type="number"
                  step="0.0001"
                  id={`newPrice-${adSpace.tokenId}`}
                  name={`newPrice-${adSpace.tokenId}`}
                />
                <Button type="submit">Update</Button>
              </Form>
              <Button onClick={() => deleteAdSpace(adSpace.tokenId)}>
                Delete
              </Button>
              <Button onClick={() => buyAdSpace(adSpace.tokenId, adSpace.price)}>
                Buy
              </Button>
            </AdSpaceCard>
          ))}
        </AdSpaceContainer>
        <SubTitle>Purchased Ad Spaces:</SubTitle>
        <AdSpaceContainer>
          {purchasedAdSpaces.map((adSpace, index) => (
            <AdSpaceCard key={index}>
              <AdSpaceImage src={adSpace.imageUrl} alt="Ad Space" />
              <AdSpaceText>{adSpace.uri}</AdSpaceText>
              <AdSpacePrice>
                Price: {adSpace.price && Web3.utils.fromWei(adSpace.price.toString(), 'ether')} ETH
              </AdSpacePrice>
            </AdSpaceCard>
          ))}
        </AdSpaceContainer>
      </>
    )}
  </Container>
);

};

export default App;



