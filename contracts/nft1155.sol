// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract nft1155 is ERC1155{
    using Strings for uint256;
    
    uint256 private _tokenIds;
    mapping (uint256 => string) private _tokenUris;

    constructor() ERC1155("") {} // Pass the URI to the ERC1155 constructor

    function setURI(uint256 tokenId, string memory newuri) public {
        _tokenUris[tokenId] = newuri;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenUris[tokenId];
    }

    function mint(address account, uint256 amount, string memory tokenURI, bytes memory data) public{
        _mint(account, _tokenIds, amount, data);
        setURI(_tokenIds, tokenURI);
        _tokenIds = _tokenIds + 1;
    }

    function burn(address account, uint256 id, uint256 amount) public {
        require(msg.sender == account || isApprovedForAll(account, msg.sender), "ERC1155: caller is not owner nor approved");
        _burn(account, id, amount);
    }
}