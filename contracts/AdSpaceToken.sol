
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
// import "hardhat/console.sol";

// contract AdSpaceToken is ERC721Enumerable {
//     using Counters for Counters.Counter;
//     Counters.Counter private _tokenIdCounter;

//     IERC20 private _paymentToken;

//     struct AdSpace {
//         uint256 tokenId;
//         string uri;
//         uint256 price;
//         string imageUrl;
//     }

//     mapping(uint256 => AdSpace) public adSpaces;
//     mapping(address => uint256) public adSpacesCreatedByUser;

//     event AdSpacePurchased(uint256 tokenId, address buyer);

//     constructor(IERC20 paymentToken) ERC721("AdSpaceToken", "AST") {
//         _paymentToken = paymentToken;
//     }

//     modifier onlyOwner(uint256 tokenId) {
//         require(ownerOf(tokenId) == msg.sender, "AdSpaceToken: Caller is not the owner");
//         _;
//     }

//     function createAdSpace(string memory uri, uint256 price, string memory imageUrl) public {
//         uint256 tokenId = _tokenIdCounter.current();
//         _mint(msg.sender, tokenId);
//         adSpaces[tokenId] = AdSpace(tokenId, uri, price, imageUrl);
//         _tokenIdCounter.increment();

//         // Increment the count of ad spaces created by the user
//         adSpacesCreatedByUser[msg.sender]++;
//     }

//     function buyAdSpace(uint256 tokenId) public {
//     console.log("Checking if token exists");
//     require(_exists(tokenId), "AdSpaceToken: Ad space does not exist");
//     AdSpace memory adSpace = adSpaces[tokenId];
//     console.log("Checking if buyer has sufficient balance");
//     require(_paymentToken.balanceOf(msg.sender) >= adSpace.price, "AdSpaceToken: Insufficient payment token balance");

//     console.log("Transferring payment tokens");
//     _paymentToken.transferFrom(msg.sender, ownerOf(tokenId), adSpace.price);
//     console.log("Transferring ad space ownership");
//     _transfer(ownerOf(tokenId), msg.sender, tokenId);
//     emit AdSpacePurchased(tokenId, msg.sender);
// }


//     function updateAdSpace(uint256 tokenId, string memory newUri, uint256 newPrice, string memory newImageUrl) public onlyOwner(tokenId) {
//         require(_exists(tokenId), "AdSpaceToken: Ad space does not exist");

//         adSpaces[tokenId].uri = newUri;
//         adSpaces[tokenId].price = newPrice;
//         adSpaces[tokenId].imageUrl = newImageUrl;
//     }

//     function deleteAdSpace(uint256 tokenId) public onlyOwner(tokenId) {
//     require(_exists(tokenId), "AdSpaceToken: Ad space does not exist");

//     // Decrement the count of ad spaces created by the user
//     adSpacesCreatedByUser[msg.sender]--;
//     console.log("Ad spaces created by user after decrement:", adSpacesCreatedByUser[msg.sender]);

//     delete adSpaces[tokenId];
//     _burn(tokenId);
// }


//     function totalAdSpaces() public view returns (uint256) {
//         return _tokenIdCounter.current();
//     }

//     function adSpacesOf(address owner) public view returns (uint256[] memory) {
//         uint256 tokenCount = balanceOf(owner);

//         uint256[] memory ownedTokenIds = new uint256[](tokenCount);
//         for (uint256 i = 0; i < tokenCount; i++) {
//             ownedTokenIds[i] = tokenOfOwnerByIndex(owner, i);
//         }

//         return ownedTokenIds;
//     }

//     function getAdSpacesCreatedByUser(address user) public view returns (uint256) {
//         return adSpacesCreatedByUser[user];
//     }
// }

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";

contract AdSpaceToken is ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    IERC20 private _paymentToken;
    address private _owner; // Add the contract owner variable

    struct AdSpace {
        uint256 tokenId;
        string uri;
        uint256 price;
        string imageUrl;
    }

    mapping(uint256 => AdSpace) public adSpaces;
    mapping(address => uint256) public adSpacesCreatedByUser;
    mapping(uint256 => bool) public adSpacePurchasedStatus;

    event AdSpacePurchased(uint256 tokenId, address buyer);

    constructor(IERC20 paymentToken) ERC721("AdSpaceToken", "AST") {
        _paymentToken = paymentToken;
        _owner = msg.sender; // Set the contract owner as the deployer
    }

    modifier onlyOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "AdSpaceToken: Caller is not the owner");
        _;
    }

    function createAdSpace(string memory uri, uint256 price, string memory imageUrl) public {
        uint256 tokenId = _tokenIdCounter.current();
        _mint(_owner, tokenId); // Mint the NFT to the contract owner instead of the msg.sender
        adSpaces[tokenId] = AdSpace(tokenId, uri, price, imageUrl);
        _tokenIdCounter.increment();

        // Increment the count of ad spaces created by the user
        adSpacesCreatedByUser[msg.sender]++;
    }

    function buyAdSpace(uint256 tokenId) public {
        require(_exists(tokenId), "AdSpaceToken: Ad space does not exist");
        AdSpace memory adSpace = adSpaces[tokenId];
        require(_paymentToken.balanceOf(msg.sender) >= adSpace.price, "AdSpaceToken: Insufficient payment token balance");

        _paymentToken.transferFrom(msg.sender, ownerOf(tokenId), adSpace.price);
        _transfer(ownerOf(tokenId), msg.sender, tokenId);
        adSpacePurchasedStatus[tokenId] = true; // Set purchased status to true

        emit AdSpacePurchased(tokenId, msg.sender);
    }

    function updateAdSpace(uint256 tokenId, string memory newUri, uint256 newPrice, string memory newImageUrl) public onlyOwner(tokenId) {
        require(_exists(tokenId), "AdSpaceToken: Ad space does not exist");

        adSpaces[tokenId].uri = newUri;
        adSpaces[tokenId].price = newPrice;
        adSpaces[tokenId].imageUrl = newImageUrl;
    }

    function deleteAdSpace(uint256 tokenId) public onlyOwner(tokenId) {
        require(_exists(tokenId), "AdSpaceToken: Ad space does not exist");

        // Decrement the count of ad spaces created by the user
        adSpacesCreatedByUser[msg.sender]--;
        delete adSpaces[tokenId];
        _burn(tokenId);
    }

    function totalAdSpaces() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function adSpacesOf(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);

        uint256[] memory ownedTokenIds = new uint256[](tokenCount);
        for (uint256 i = 0; i <tokenCount; i++) {
ownedTokenIds[i] = tokenOfOwnerByIndex(owner, i);
}
    return ownedTokenIds;
}

function getAdSpacesCreatedByUser(address user) public view returns (uint256) {
    return adSpacesCreatedByUser[user];
}

// Add this function to check if an ad space is purchased
function isAdSpacePurchased(uint256 tokenId) public view returns (bool) {
    return adSpacePurchasedStatus[tokenId];
}
}

