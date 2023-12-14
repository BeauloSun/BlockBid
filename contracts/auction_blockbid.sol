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
error AuctionNotEnded();
error BidNotHighest();

contract BlockBid is ReentrancyGuard{

    struct listing721{
        uint256 tokenId;
        address payable owner;
        uint256 price;
        uint256 auctionEndTime;
        address highestBidder;
        uint256 highestBid;
        bool ended;
        uint256 buyoutPrice;
    }

    mapping (address => mapping(uint256 => listing721)) nftListed721;
    uint256[] ListedTokens721;
    
    modifier Owner721(address nftAddress ,uint256 tokenId, address sender){
        IERC721 nft = IERC721(nftAddress);
        if (nft.ownerOf(tokenId) != sender){
            revert TheTokenDoesNotBelongToTheSender();
        }
        _;
    }

    modifier ForSale721(address nftAddress , uint tokenId){
        listing721 memory displayed = nftListed721[nftAddress][tokenId];
        if(displayed.price <= 0){
            revert NotForSale(nftAddress , tokenId);
        }
        _;
    }

    function getListedNFT721 (address _nftAddress, uint256 _tokenId) public view returns (listing721 memory){
        return nftListed721[_nftAddress][_tokenId];
    }

    function getListedTokens () public view returns (uint256 [] memory){
        return ListedTokens721;
    }

    function sellNft721 (address _nftAddress , uint256 _tokenId , uint256 price, uint256 duration, uint256 buyoutPrice) external Owner721(_nftAddress , _tokenId ,msg.sender){
        if (price <= 0){
            revert PriceShouldBeGreaterThanZero();
        }

        IERC721 nft = IERC721(_nftAddress);
        if (nft.getApproved(_tokenId) != address(this)){
            revert DoNotHaveApprovalToSellNft();
        }
  
        nftListed721[_nftAddress][_tokenId] = listing721(_tokenId, payable(msg.sender) , price, block.timestamp + duration, address(0), 0, false, buyoutPrice);
        ListedTokens721.push(_tokenId);
    }

    function buyNft721 (address _nftAddress , uint256 _tokenId) external payable ForSale721(_nftAddress , _tokenId) nonReentrant{
        listing721 memory item721 = nftListed721[_nftAddress][_tokenId];
        if(msg.value < item721.price){
            revert PriceNotMatched(_nftAddress , _tokenId);
        }
        // transfer the funds to the sellers account
        (bool success, ) = item721.owner.call{value: msg.value}("");
        require(success, "Transfer failed");

        delete (nftListed721[_nftAddress][_tokenId]);
       
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

    function bid(address _nftAddress, uint256 _tokenId) external payable {
        listing721 storage auction = nftListed721[_nftAddress][_tokenId];
        require(block.timestamp <= auction.auctionEndTime, "Auction already ended.");
        require(msg.value > auction.highestBid, "There already is a higher bid.");
        if (msg.value >= auction.buyoutPrice) {
            // End the auction immediately if the bid is greater than or equal to the buyout price
            auction.ended = true;
            auction.owner.transfer(msg.value);
            IERC721(_nftAddress).safeTransferFrom(auction.owner, msg.sender, _tokenId);
        } else {
            if (auction.highestBid != 0) {
                // Refund the previously highest bidder.
                payable(auction.highestBidder).transfer(auction.highestBid);
            }
            auction.highestBid = msg.value;
            auction.highestBidder = msg.sender;
        }
    }

    function auctionEnd(address _nftAddress, uint256 _tokenId) external {
        listing721 storage auction = nftListed721[_nftAddress][_tokenId];
        require(block.timestamp >= auction.auctionEndTime, "Auction not yet ended.");
        require(!auction.ended, "AuctionEnd has already been called.");
        auction.ended = true;
        auction.owner.transfer(auction.highestBid);
        IERC721(_nftAddress).safeTransferFrom(auction.owner, auction.highestBidder, _tokenId);
    }
}
