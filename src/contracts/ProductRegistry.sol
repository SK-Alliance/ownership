// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProductRegistry is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    
    struct Product {
        string serialNumber;
        string category;
        string brand;
        string model;
        uint256 registrationDate;
        bool isActive;
        // Removed owner field - use ownerOf(tokenId) instead
    }
    
    // Mappings
    mapping(uint256 => Product) public products;
    mapping(string => uint256) public serialToTokenId;
    mapping(address => uint256[]) public userProducts;
    
    // Events
    event ProductRegistered(
        uint256 indexed tokenId, 
        string serialNumber, 
        address indexed owner,
        string category,
        string brand,
        uint256 timestamp
    );
    
    event ProductTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );
    
    // Constructor compatible with both v4 and v5
    constructor() ERC721("ProductRegistry", "PREG") Ownable(_msgSender()) {}
    
    /**
     * @dev Register a new product with ownership proof
     */
    function registerProduct(
        string memory serialNumber,
        string memory category,
        string memory brand,
        string memory model,
        string memory tokenURI
    ) public returns (uint256) {
        require(bytes(serialNumber).length > 0, "Serial number required");
        require(serialToTokenId[serialNumber] == 0, "Product already registered");
        
        _tokenIds++;
        uint256 tokenId = _tokenIds;
        
        // Mint the NFT
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Store product information (without owner field)
        products[tokenId] = Product({
            serialNumber: serialNumber,
            category: category,
            brand: brand,
            model: model,
            registrationDate: block.timestamp,
            isActive: true
        });
        
        // Update mappings
        serialToTokenId[serialNumber] = tokenId;
        userProducts[msg.sender].push(tokenId);
        
        emit ProductRegistered(
            tokenId, 
            serialNumber, 
            msg.sender, 
            category, 
            brand, 
            block.timestamp
        );
        
        return tokenId;
    }
    
    /**
     * @dev Override _update to handle transfers properly
     */
    function _update(address to, uint256 tokenId, address auth) 
        internal 
        override 
        returns (address) 
    {
        address from = _ownerOf(tokenId);
        
        // Handle userProducts mapping updates on transfer
        if (from != address(0) && from != to) {
            _removeFromUserProducts(from, tokenId);
            emit ProductTransferred(tokenId, from, to);
        }
        if (to != address(0) && from != to) {
            userProducts[to].push(tokenId);
        }
        
        return super._update(to, tokenId, auth);
    }
    
    /**
     * @dev Remove token from user's product list
     */
    function _removeFromUserProducts(address user, uint256 tokenId) private {
        uint256[] storage userTokens = userProducts[user];
        for (uint256 i = 0; i < userTokens.length; i++) {
            if (userTokens[i] == tokenId) {
                userTokens[i] = userTokens[userTokens.length - 1];
                userTokens.pop();
                break;
            }
        }
    }
    
    /**
     * @dev Verify product registration and get details
     */
    function verifyProduct(string memory serialNumber) public view returns (
        uint256 tokenId,
        address owner,
        string memory category,
        string memory brand,
        string memory model,
        uint256 registrationDate,
        bool isActive
    ) {
        tokenId = serialToTokenId[serialNumber];
        require(tokenId != 0, "Product not found");
        
        Product memory product = products[tokenId];
        return (
            tokenId,
            ownerOf(tokenId), // Use ERC721's ownerOf instead of stored owner
            product.category,
            product.brand,
            product.model,
            product.registrationDate,
            product.isActive
        );
    }
    
    /**
     * @dev Get all products owned by a user
     */
    function getUserProducts(address user) public view returns (uint256[] memory) {
        return userProducts[user];
    }
    
    /**
     * @dev Get product details by token ID
     */
    function getProductDetails(uint256 tokenId) public view returns (
        Product memory product,
        address currentOwner
    ) {
        require(tokenId > 0 && tokenId <= _tokenIds, "Product does not exist");
        return (products[tokenId], ownerOf(tokenId));
    }
    
    /**
     * @dev Check if a serial number is already registered
     */
    function isProductRegistered(string memory serialNumber) public view returns (bool) {
        return serialToTokenId[serialNumber] != 0;
    }
    
    /**
     * @dev Get total number of registered products
     */
    function totalRegisteredProducts() public view returns (uint256) {
        return _tokenIds;
    }
    
    /**
     * @dev Get product token ID by serial number
     */
    function getTokenIdBySerial(string memory serialNumber) public view returns (uint256) {
        require(serialToTokenId[serialNumber] != 0, "Product not found");
        return serialToTokenId[serialNumber];
    }
    
    /**
     * @dev Deactivate a product (only owner)
     */
    function deactivateProduct(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        products[tokenId].isActive = false;
    }
    
    /**
     * @dev Reactivate a product (only owner)
     */
    function reactivateProduct(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        products[tokenId].isActive = true;
    }
}