// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

error SenderIsNotTheOwner();

contract BlockBid1155 is ReentrancyGuard{
    event ListedNft1155(uint256 sellingId);

    uint256 sellingId;

    mapping (uint256 => token1155) nft1155Listing;


    struct token1155{
        uint256 tokenId;
        address payable seller;
        uint256 price;
        uint256 tokensAvailable;
        address[] buyers;
        uint256 amount;
        bool complete;
        uint256 sellingId;
    }

    modifier Owner1155(address nftAddress ,uint256 tokenId, address sender , uint256 amount){
        IERC1155 nft = IERC1155(nftAddress);
        if (nft.balanceOf(msg.sender , tokenId) < amount){
            revert SenderIsNotTheOwner();
        }
        _;
    }

    function SellNft1155(address _nft , uint256 tokenId , uint256 price , uint256 amount) public  Owner1155(_nft , tokenId , msg.sender , amount){

        require(amount >0 ,  "Amount of tokens should be greater than O");
        require(IERC1155(_nft).isApprovedForAll(msg.sender , address(this)));
        require(amount <= IERC1155(_nft).balanceOf(msg.sender , tokenId) , "Cannot sell more than you own");

        bool TokenListed = false;

        for(uint256 i =1 ; i <= sellingId ; i++ ){
            if (nft1155Listing[i].seller == msg.sender && nft1155Listing[i].tokenId == tokenId){
                TokenListed = true;
            }
        }
        require(TokenListed != true , "You already have a listing in the market place");

        sellingId += 1;
        address[] memory buyers;

        nft1155Listing[sellingId] = token1155(tokenId , payable(msg.sender) , price, amount ,buyers ,amount ,false,sellingId);
        emit ListedNft1155(sellingId);
    }


    function BuyNft1155(address _nft ,uint256 amount , uint256 listedId) public payable nonReentrant{

        token1155 memory listing = nft1155Listing[listedId];

        require(msg.sender != listing.seller, "Owner can not be a buyer");
        require(amount >0 , "Buyer can not buy 0 tokens");
        require(amount <= listing.tokensAvailable , "The number of tokens available are less than the amount specified");
        uint256 endPrice = amount*listing.price;
        require(msg.value >= endPrice, "unsufficient funds to buy tokens");

        nft1155Listing[listedId].tokensAvailable -= amount;

        if (nft1155Listing[listedId].tokensAvailable == 0){
            nft1155Listing[listedId].complete = true;
        }
        nft1155Listing[listedId].buyers.push(msg.sender);

        (bool success, ) = nft1155Listing[listedId].seller.call{value: msg.value}("");
        require(success, "Transfer failed");

        IERC1155(_nft).safeTransferFrom( nft1155Listing[listedId].seller, msg.sender, nft1155Listing[listedId].tokenId,amount,"");

        if(nft1155Listing[listedId].complete == true){
            deleteListingFromBuying(listedId);
        }
    }

    function deleteListingFromBuying(uint256 listedId) public {
        require(nft1155Listing[listedId].tokenId != 0 , "token is not listed");
        delete(nft1155Listing[listedId]);
        }

    function deleteListing(uint256 listedId) public {
        require(nft1155Listing[listedId].tokenId != 0 , "token is not listed");
        require(nft1155Listing[listedId].seller == msg.sender  , "User is not the owner");
        delete(nft1155Listing[listedId]);

    }




}