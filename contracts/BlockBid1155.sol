// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

error SenderIsNotTheOwner();
contract BlockBid1155 is ReentrancyGuard{

    uint256 sellingId;

    mapping (uint256 => token1155) nft1155Listing;
    uint256[] nft1155ListedTokens;


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



    function SellNft1155(address _nft , uint256 tokenId , uint256 price , uint256 amount) public  Owner1155(_nft , tokenId , msg.sender , amount)returns(uint256){

        require(amount >0 ,  "Amount of tokens should be greater than O");
        require(IERC1155(_nft).isApprovedForAll(msg.sender , address(this)));

        sellingId += 1;
        address[] memory buyers;

        nft1155Listing[sellingId] = token1155(tokenId , payable(msg.sender) , price, amount ,buyers ,amount ,false,sellingId);
        nft1155ListedTokens.push(sellingId);

        return sellingId;
        }









}