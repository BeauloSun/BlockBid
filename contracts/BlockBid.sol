// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error NotForSale(address nftAddress , uint256 tokenId);
error PriceNotMatched(address _nftAddress , uint256 _tokenId);
error PriceShouldBeGreaterThanZero();
error TheTokenDoesNotBelongToTheSender();
error DoNotHaveApprovalToSellNft();

contract BlockBid is ReentrancyGuard{

    // struct for storing the owners address and price of the listed nft
    struct listing721{
        uint256 tokenId;
        address payable owner;
        uint256 price;
    }


    // mapping of nftaddress => (tokenid  => (listing721)) so that we can access the listing price and owner from nftaddress and tokenid
    // mapping (address => mapping (uint256 => listing721)) nftListed721;

    mapping (uint256 => listing721) nftListed721;
    uint256[] ListedTokens721;
    
    
    // to check if an nft is owned by the person looking to do operations on it
    modifier Owner721(address nftAddress ,uint256 tokenId, address sender){
        IERC721 nft = IERC721(nftAddress);
        if (nft.ownerOf(tokenId) != sender){
            revert TheTokenDoesNotBelongToTheSender();
        }
        _;
    }

    // to check if the particular erc721 token is for sale or not
    modifier ForSale721(address nftAddress , uint tokenId){
        // listing721 memory displayed = nftListed721[nftAddress][tokenId];
        listing721 memory displayed = nftListed721[tokenId];
        if(displayed.price <= 0){
            revert NotForSale(nftAddress , tokenId);
        }
        _;
    }

    function getListedNFT721 (uint256 _tokenId) public view returns (listing721 memory){
        return nftListed721[_tokenId];

    }

    function getListedTokens () public view returns (uint256 [] memory){
        return ListedTokens721;
    }

    // to list the nft on the marketplace
    function sellNft721 (address _nftAddress , uint256 _tokenId , uint256 price) external Owner721(_nftAddress , _tokenId ,msg.sender){
        if (price <= 0){
            revert PriceShouldBeGreaterThanZero();
        }

        // check if the contract has the approval to sell the nft
        IERC721 nft = IERC721(_nftAddress);
        if (nft.getApproved(_tokenId) != address(this)){
            revert DoNotHaveApprovalToSellNft();
        }

        //Update the nft listing
        // nftListed721[_nftAddress][_tokenId] = listing721(_tokenId, payable(msg.sender) , price);

        
        nftListed721[_tokenId] = listing721(_tokenId, payable(msg.sender) , price);
        ListedTokens721.push(_tokenId);

    }

    // to buy a NFT from the market place
    function buyNft721 (address _nftAddress , uint256 _tokenId) external payable ForSale721(_nftAddress , _tokenId) nonReentrant{
        // listing721 memory item721 = nftListed721[_nftAddress][_tokenId];
        listing721 memory item721 = nftListed721[_tokenId];
        if(msg.value < item721.price){
            revert PriceNotMatched(_nftAddress , _tokenId);
        }
        // transfer the funds to the sellers account
        (bool success, ) = item721.owner.call{value: msg.value}("");
        require(success, "Transfer failed");

        // delete the nft from the market place
        // delete (nftListed721[_nftAddress][_tokenId]);


        delete (nftListed721[_tokenId]);
        

        // remove the token from the listedtokens
        uint i = 0;
        while(ListedTokens721[i] != _tokenId){
            i ++;
        } 
        if (i<ListedTokens721.length){
            for (uint j = i ; j < ListedTokens721.length-1 ; j++){
                ListedTokens721[j]= ListedTokens721[j+1];
            }
            ListedTokens721.pop();
        }

        IERC721(_nftAddress).safeTransferFrom(item721.owner, msg.sender, _tokenId);

        
    }

}