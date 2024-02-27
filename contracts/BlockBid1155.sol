// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

error SenderIsNotTheOwner();
error AuctionItemNotExists(uint256 auctionId);
error DoNotHaveApprovalToSellNft();
error UserHaveNoFunds();



contract BlockBid1155 is ReentrancyGuard{
    event ListedNft1155(uint256 sellingId);
    event AuctionedNft1155(uint256 sellingId);

    uint256 sellingId;

    mapping (uint256 => token1155) nft1155Listing;
    mapping (uint256 => auction1155) nft1155auction;
    mapping(uint256 => mapping(address => uint256)) auctionBids;
    mapping (uint256 => address[]) auctionBidders;
    mapping (address => uint256) UserFunds;
    uint256[] AuctionedTokens1155;
    uint256[] ListedTokens1155;


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

    struct auction1155{
        uint256 tokenId;
        address payable seller;
        uint256 minPrice;
        uint256 amount;
        uint256 auctionEndTime;
        uint256 highestBid;
        address highestBidder;
        bool end;
        uint256 auctionId;
    }

    modifier Owner1155(address nftAddress ,uint256 tokenId, address sender , uint256 amount){
        IERC1155 nft = IERC1155(nftAddress);
        if (nft.balanceOf(msg.sender , tokenId) < amount){
            revert SenderIsNotTheOwner();
        }
        _;
    }

    modifier AuctionExists (uint256 _auctionId){
        auction1155 memory auctionItem = nft1155auction[_auctionId];
        if(auctionItem.tokenId <= 0){
            revert AuctionItemNotExists(_auctionId);
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

        bool checkAssets = checkTotalAssestsListed(_nft, msg.sender, tokenId, amount);
        require(checkAssets , "you can't sell the assests which are already listed");

        sellingId += 1;
        address[] memory buyers;

        nft1155Listing[sellingId] = token1155(tokenId , payable(msg.sender) , price, amount ,buyers ,amount ,false,sellingId);
        ListedTokens1155.push(sellingId);
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
         
        
        uint i = 0;
        while(ListedTokens1155[i] != listedId){
            i ++;
        } 
        if (i<ListedTokens1155.length){
            for (uint j = i ; j < ListedTokens1155.length-1 ; j++){
               ListedTokens1155[j]= ListedTokens1155[j+1];
            }
           ListedTokens1155.pop();
        }
    }

    function deleteListing(uint256 listedId) public {
        require(nft1155Listing[listedId].tokenId != 0 , "token is not listed");
        require(nft1155Listing[listedId].seller == msg.sender  , "User is not the owner");
        delete(nft1155Listing[listedId]);


        uint i = 0;
        while(ListedTokens1155[i] != listedId){
            i ++;
        } 
        if (i<ListedTokens1155.length){
            for (uint j = i ; j < ListedTokens1155.length-1 ; j++){
               ListedTokens1155[j]= ListedTokens1155[j+1];
            }
           ListedTokens1155.pop();
        }

    }
    

    function getNft1155Listing(uint _listingId) public view returns(token1155 memory){
        return nft1155Listing[_listingId];

    }

    function updateListing(uint256 _listingId , uint256 price) public {

        token1155 memory token = nft1155Listing[_listingId];
        require(token.seller == msg.sender , "user is not the owner");
        require(price > 0 , "Price cannot be lower than 0");

        nft1155Listing[_listingId].price = price;
    }

    function auctionNft1155(address _nftAddress , uint256 _tokenId ,uint256 minPrice,uint256 auctionduration, uint256 amount) external Owner1155(_nftAddress , _tokenId , msg.sender , amount){

        bool TokenAuctioned = false;

        for(uint256 i =1 ; i <= sellingId ; i++ ){
            if (nft1155auction[i].seller == msg.sender && nft1155auction[i].tokenId == _tokenId){
                TokenAuctioned = true;
            }
        }
        require(TokenAuctioned != true , "You already have a auction listing in the market place");

        bool checkAssets = checkTotalAssestsListed(_nftAddress, msg.sender, _tokenId, amount);
        require(checkAssets , "you can't sell the assests which are already listed");

        uint256 starttime = block.timestamp;
        uint256 endtime = starttime + auctionduration;

        require (block.timestamp < endtime , "Not sufficient time for auction");
        require(minPrice >0 , "minPrice should be greater than 0");
        require(amount > 0 , "Amount cannot be less than or equal to 0");

        
        IERC1155 nft = IERC1155(_nftAddress);
        if (nft.isApprovedForAll(msg.sender , address(this)) == false){
            revert DoNotHaveApprovalToSellNft();
        }
        sellingId += 1;


        nft1155auction[sellingId] = auction1155(_tokenId , payable(msg.sender) , minPrice ,amount, endtime,  0, address(0), false, sellingId);
        AuctionedTokens1155.push(sellingId);
        emit AuctionedNft1155(sellingId);
    }

    function bid( uint256 _listingId) external payable AuctionExists(_listingId){

        // check owner should not bid
        auction1155 storage auctionItem =  nft1155auction[_listingId];
        require(auctionItem.seller != msg.sender  , "Owner cannot bid on their own nft");
        require(block.timestamp < auctionItem.auctionEndTime, "The auction has ended");

        // check the new added value is greater than previous value + new value
        uint256 newTotalBid = auctionBids[_listingId][msg.sender] + msg.value;
        require(newTotalBid >= auctionItem.minPrice , "The bid is lower than the minimum price");
        require(newTotalBid > auctionItem.highestBid, "There already is a higher bid.");

        // update the bids
        auctionBids[_listingId][msg.sender] = newTotalBid;

        if(!checkBidderExists(_listingId, msg.sender)){
            auctionBidders[_listingId].push(msg.sender);
        }

        auctionItem.highestBid = newTotalBid;
        auctionItem.highestBidder = msg.sender;
    }

    function auctionEnd(address _nftAddress, uint256 _listingId) external {

        auction1155 memory auction = nft1155auction[_listingId];

        require(block.timestamp >= auction.auctionEndTime, "Auction not yet ended.");

         address[] memory bidders = auctionBidders[_listingId];


        if (auction.highestBidder  == address(0)){
            delete auctionBidders[_listingId];
            delete nft1155auction[_listingId];


        }else{
                    // transfer all the money to the seller's fund
            if(auctionBids[_listingId][auction.highestBidder] == auction.highestBid){
                UserFunds[auction.seller] += auctionBids[_listingId][auction.highestBidder];
                auctionBids[_listingId][auction.highestBidder] = 0;
            }
            // transfer the money to all the bidders fund
            for(uint256 j = 0 ; j < bidders.length; j++){
                UserFunds[bidders[j]] += auctionBids[_listingId][bidders[j]];
                delete auctionBids[_listingId][bidders[j]];
            }

            delete auctionBidders[_listingId];
            IERC1155(_nftAddress).safeTransferFrom( nft1155auction[_listingId].seller, msg.sender, nft1155auction[_listingId].tokenId,nft1155auction[_listingId].amount,"");
            delete nft1155auction[_listingId];

        }
        uint i = 0;
        while(AuctionedTokens1155[i] != _listingId){
            i ++;
        } 
        if (i<AuctionedTokens1155.length){
            for (uint k = i ; k < AuctionedTokens1155.length-1 ; k++){
                AuctionedTokens1155[k]= AuctionedTokens1155[k+1];
            }
           AuctionedTokens1155.pop();
        }

    }

    function getAuctionEndTime(uint256 _listingId) external view AuctionExists(_listingId) returns(uint256) {
        return nft1155auction[_listingId].auctionEndTime;
    }

    function checkBidderExists(uint256 _listingId, address bidder) public view returns (bool) {
        address[] storage bidders = auctionBidders[_listingId];
        for (uint i = 0; i < bidders.length; i++) {
            if (bidders[i] == bidder) {
                return true;
            }
        }
        return false;
    }


    function getListedAuctionItem721(uint256 _listingId) public view returns(auction1155 memory){
        return nft1155auction[_listingId];
    }

    function getListingId() public view returns(uint256 tokenId){
        return sellingId;
    }

    function getUserFunds(address user) public view returns(uint256){
        return UserFunds[user];
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


    function checkTotalAssestsListed(address _nftAddress, address owner , uint256 _tokenId, uint256 amount) public view returns(bool){

        // total balance of user for a tokenId
        uint256 totalBalance = IERC1155(_nftAddress).balanceOf(msg.sender , _tokenId);

        for (uint256 i = 1 ; i <= sellingId ; i++){
            if (nft1155Listing[i].seller == owner){
                totalBalance -= nft1155Listing[i].tokensAvailable;
            }
            if(nft1155auction[i].seller == owner){
                totalBalance -= nft1155auction[i].amount;
            }
        }

        return (totalBalance >= amount);

    }



}