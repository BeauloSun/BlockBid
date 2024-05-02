// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract nft1155 is ERC1155{
    using Strings for uint256;
    uint256 private _tokenId;
    
    mapping (uint256 => string) private _tokenUris;

    constructor() ERC1155("") {
        _tokenId = 1;
    }

    function setURI(uint256 tokenId, string memory newuri) internal {
        _tokenUris[tokenId] = newuri;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenUris[tokenId];
    }

    function mint(address account, uint256 amount, string memory tokenURI, bytes memory data) public{
        _mint(account, _tokenId, amount, data);
        setURI(_tokenId, tokenURI);
        _tokenId = _tokenId + 1;
    }

    function burn(address account, uint256 id, uint256 amount) public {
        require(msg.sender == account , "ERC1155: caller is not owner");
        require(balanceOf(account,id) >= amount , "Not enough to burn");
        _burn(account, id, amount);
    }


     function getOwnerNFTs(address owner) public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i < _tokenId; i++) {
            if (balanceOf(owner , i) > 0) {
                    count++;
            }
        }
        uint256[] memory ownerNFTs = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i < _tokenId; i++) {
            if (balanceOf(owner , i) > 0) {
                ownerNFTs[index] = i;
                index++;
            }
        }
        return ownerNFTs;
    }

    function getTokenId() public view returns(uint256){
        return _tokenId;
    }
    
}