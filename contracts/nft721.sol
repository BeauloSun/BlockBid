// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract nft721 is ERC721URIStorage{
    uint256 private _tokenId;

    event nft721Minted (string tokenURI , uint256 _tokenId);
    constructor () ERC721("BlockBid" , "BBT"){
        _tokenId = 1;
    }

    // mint an nft
    function mintNft(address owner , string memory tokenURI) external returns (uint256){
        _safeMint(owner , _tokenId);
        _setTokenURI(_tokenId , tokenURI);
        _tokenId = _tokenId + 1;
        emit nft721Minted(tokenURI , _tokenId);
        return _tokenId;
    }

    // get the token id
    function getTokenId() public view returns(uint256){
        return _tokenId;
    }

    // get the ownerNFTs
    function getOwnerNFTs(address owner) public view returns (uint256[] memory) {
        uint256[] memory ownerNFTs = new uint256[](balanceOf(owner));
        uint256 count = 0;
        for (uint256 i = 1 ; i < _tokenId ; i ++){
            if(_ownerOf(i) == owner){
                ownerNFTs[count] = i;
                count++;
            }
        }
        return ownerNFTs;
    }
}