// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

error NotForSale(address nftAddress , uint256 tokenId);
error PriceNotMatched(address _nftAddress , uint256 _tokenId);
error PriceShouldBeGreaterThanZero();
error TheTokenDoesNotBelongToTheSender();
error DoNotHaveApprovalToSellNft();
error AuctionNotEnded();
error BidNotHighest();
error AuctionItemNotExists(uint256 _tokenId);
error UserHaveNoFunds();

contract BlockBid is ReentrancyGuard{

    struct listing721{
        uint256 tokenId;
        address payable owner;
        uint256 price;
    }

    struct auctionListing721{
        uint256 tokenId;
        address payable owner;
        uint256 minPrice;
        uint256 auctionEndTime;
        address highestBidder;
        uint256 highestBid;
        bool ended;
    }

    mapping(uint256 => listing721) nftListed721;
    mapping (uint256 => auctionListing721) auctionNftListed721;
    mapping(uint256 => mapping(address => uint256)) auctionBids;
    mapping (uint256 => address[]) auctionBidders;
    mapping (address => uint256) UserFunds;
    uint256[] ListedTokens721;



    modifier Owner721(address nftAddress ,uint256 tokenId, address sender){
        IERC721 nft = IERC721(nftAddress);
        if (nft.ownerOf(tokenId) != sender){
            revert TheTokenDoesNotBelongToTheSender();
        }
        _;
    }

    modifier ForSale721(address nftAddress , uint tokenId){
        listing721 memory displayed = nftListed721[tokenId];
        if(displayed.price <= 0){
            revert NotForSale(nftAddress , tokenId);
        }
        _;
    }

    modifier AuctionExists (uint256 _tokenId){
        auctionListing721 memory auctionItem = auctionNftListed721[_tokenId];
        if(auctionItem.tokenId <= 0){
            revert AuctionItemNotExists(_tokenId);
        }
        _;
    }

    function getListedNFT721 ( uint256 _tokenId) public view returns (listing721 memory){
        return nftListed721[_tokenId];
    }

    function getListedTokens () public view returns (uint256 [] memory){
        return ListedTokens721;
    }

    function sellNft721 (address _nftAddress , uint256 _tokenId , uint256 price) external Owner721(_nftAddress , _tokenId ,msg.sender){
        if (price <= 0){
            revert PriceShouldBeGreaterThanZero();
        }

        IERC721 nft = IERC721(_nftAddress);
        if (nft.getApproved(_tokenId) != address(this)){
            revert DoNotHaveApprovalToSellNft();
        }
  
        nftListed721[_tokenId] = listing721(_tokenId, payable(msg.sender) , price);
        ListedTokens721.push(_tokenId);
    }

    function buyNft721 (address _nftAddress , uint256 _tokenId) external payable ForSale721(_nftAddress , _tokenId) nonReentrant{
        listing721 memory item721 = nftListed721[_tokenId];
        if(msg.value < item721.price){
            revert PriceNotMatched(_nftAddress , _tokenId);
        }

        // transfer the funds to the sellers account
        (bool success, ) = item721.owner.call{value: msg.value}("");
        require(success, "Transfer failed");

        delete (nftListed721[_tokenId]);
       
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

    function auctionNft721(address _nftAddress , uint256 _tokenId ,uint256 minPrice,uint256 auctionduration) external Owner721(_nftAddress , _tokenId , msg.sender){

        uint256 starttime = block.timestamp;
        uint256 endtime = starttime + auctionduration;

        require (block.timestamp < endtime , "Not sufficient time for auction");
        require(minPrice >0 , "minPrice should be greater than 0");

            
        IERC721 nft = IERC721(_nftAddress);
        if (nft.getApproved(_tokenId) != address(this)){
            revert DoNotHaveApprovalToSellNft();
        }

        auctionNftListed721[_tokenId] = auctionListing721(_tokenId , payable(msg.sender) , minPrice , endtime, address(0), 0 , false);
    }
    
    function bid( uint256 _tokenId) external payable AuctionExists(_tokenId){

        // check owner should not bid
        auctionListing721 storage auctionItem = auctionNftListed721[_tokenId];
        require(auctionItem.owner != msg.sender  , "Owner cannot bid on their own nft");

        // check the new added value is greater than previous value + new value
        uint256 newTotalBid = auctionBids[_tokenId][msg.sender] + msg.value;
        require(newTotalBid > auctionItem.highestBid, "There already is a higher bid.");

        // update the bids
        auctionBids[_tokenId][msg.sender] = newTotalBid;

        // update the bidders array if the new bidder does nto exits
        if(!checkBidderExists(_tokenId, msg.sender)){
            auctionBidders[_tokenId].push(msg.sender);
        }

        auctionItem.highestBid = newTotalBid;
        auctionItem.highestBidder = msg.sender;
    }

    function auctionEnd(address _nftAddress, uint256 _tokenId) external Owner721(_nftAddress , _tokenId , msg.sender){
        auctionListing721 memory auction = auctionNftListed721[_tokenId];

        require(block.timestamp >= auction.auctionEndTime, "Auction not yet ended.");
        require(!auction.ended, "AuctionEnd has already been called.");

        auction.ended = true;

        // transfer all the money to the seller's fund
        if(auctionBids[_tokenId][auction.highestBidder] == auction.highestBid){
            UserFunds[msg.sender] += auctionBids[_tokenId][auction.highestBidder];
            auctionBids[_tokenId][auction.highestBidder] = 0;
        }

        // transfer the money to all the bidders fund
        address[] memory bidders = auctionBidders[_tokenId];
        for(uint256 i = 0 ; i < bidders.length; i++){
            UserFunds[bidders[i]] += auctionBids[_tokenId][bidders[i]];
            delete auctionBids[_tokenId][bidders[i]];
        }

        
        delete auctionBidders[_tokenId];
        IERC721(_nftAddress).safeTransferFrom(auction.owner, auction.highestBidder, _tokenId);
        delete auctionNftListed721[_tokenId];
    }

    function getTheBidDifference(uint256 _tokenId, address currUser) external view returns (uint256){
         auctionListing721 storage auctionItem = auctionNftListed721[_tokenId];

         if(!checkBidderExists(_tokenId, currUser)){
            return auctionItem.highestBid;
         }
         return auctionItem.highestBid - auctionBids[_tokenId][currUser];
    }

    function getBiddersLastBid(uint256 _tokenId, address bidder) public view returns(uint256){
        return auctionBids[_tokenId][bidder];
    }

    function getListedAuctionItem721(uint256 _tokenId) public view returns(auctionListing721 memory){
        return auctionNftListed721[_tokenId];

    }

    function getUserFunds(address user) public view returns(uint256){
        return UserFunds[user];
    }

    function getBiddersForNft721(uint256 _tokenId) public view returns (address[] memory ){
        return auctionBidders[_tokenId];
    }

    function getFundBack(address user) external {
        uint256 userfunds = UserFunds[user];
        if(userfunds <= 0){
            revert UserHaveNoFunds();
        }
        UserFunds[user] = 0;
        (bool success , ) = payable(user).call{value:userfunds}("");
        require(success , "There was an error in transferring funds");
    }

    function checkBidderExists(uint256 _tokenId, address bidder) public view returns (bool) {
        address[] storage bidders = auctionBidders[_tokenId];
        for (uint i = 0; i < bidders.length; i++) {
            if (bidders[i] == bidder) {
                return true;
            }
        }
        return false;
}





}
