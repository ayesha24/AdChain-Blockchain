import Web3 from 'web3';
import React, { useState, useEffect, useMemo } from 'react';
import AdSpaceToken from './abis/AdSpaceToken.json';
import ERC20Mock from './abis/ERC20Mock.json';

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

  const isAdSpacePurchased = (tokenId) => {
    return purchasedAdSpaces.some((adSpace) => adSpace.tokenId === tokenId);
  };
  

  const loadBlockchainData = async () => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
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
      const ERC20TokenAddress = '0x43e11Fd44C2EfC9cad5B884030e96E0d26e0c4e4';
      const ERC20TokenInstance = new web3.eth.Contract(ERC20Mock.abi, ERC20TokenAddress);
  
      const totalAdSpaces = await adSpaceTokenInstance.methods.totalAdSpaces().call();
      setTotalAdSpaces(totalAdSpaces);
      const adSpacePromises = [];
  
      for (let i = 0; i < totalAdSpaces; i++) {
        adSpacePromises.push(adSpaceTokenInstance.methods.adSpaces(i).call());
      }
  
      const adSpaces = await Promise.all(adSpacePromises);
      setAdSpaces(adSpaces);
  
      console.log("Loaded ad spaces:", adSpaces);
      setAccount(accounts[0]);
      const adSpacesOfUser = await adSpaceTokenInstance.methods.adSpacesOf(accounts[0]).call();
      console.log("Ad spaces of user:", adSpacesOfUser); // Add this console log

      setAdSpacesCreatedByUser(adSpacesOfUser.length);
  
      const adSpacesNotCreatedByUser = adSpaces.filter(
        (adSpace) => !adSpacesOfUser.includes(adSpace.tokenId.toString()) // Change made here
      );
      console.log("Ad spaces not created by user:", adSpacesNotCreatedByUser); // Add this console log

      const purchasedAdSpaces = adSpacesNotCreatedByUser.filter((adSpace) =>
        adSpace.buyer && adSpace.buyer.toLowerCase() === accounts[0].toLowerCase()
      );
      console.log("Purchased ad spaces:", purchasedAdSpaces); // Add this console log

      setPurchasedAdSpaces(purchasedAdSpaces);
  
    } else {
      window.alert('AdSpaceToken contract not deployed to detected network.');
    }
  };
  

const availableAdSpaces = useMemo(() => {
  return adSpaces.filter(
    (adSpace) => !purchasedAdSpaces.some((purchased) => purchased.tokenId === adSpace.tokenId)
  );
}, [adSpaces, purchasedAdSpaces]);


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
    loadBlockchainData();
  });
};

const buyAdSpace = async (tokenId, price) => {
  setLoading(true);
  const ERC20TokenAddress = '0x43e11Fd44C2EfC9cad5B884030e96E0d26e0c4e4';
  const ERC20TokenInstance = new web3.eth.Contract(ERC20Mock.abi, ERC20TokenAddress);

  await ERC20TokenInstance.methods
    .approve(adSpaceToken._address, price)
    .send({ from: account });

  await adSpaceToken.methods
    .buyAdSpace(tokenId)
    .send({ from: account })
    .on("receipt", (receipt) => {
      setLoading(false);
      loadBlockchainData();
    });
};




const updateAdSpace = async (tokenId, newUri, newPrice, newImageUrl) => {
setLoading(true);
await adSpaceToken.methods
.updateAdSpace(tokenId, newUri, newPrice, newImageUrl)
.send({ from: account })
.on('receipt', (receipt) => {
setLoading(false);
loadBlockchainData();
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
          {availableAdSpaces.map((adSpace, index) => (
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
      {console.log('Purchased ad spaces:', purchasedAdSpaces)}


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
