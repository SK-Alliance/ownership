// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract OwnershipCertificate is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    // Events
    event CertificateMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event BatchCertificatesMinted(address[] to, uint256[] tokenIds);
    event MintingPaused();
    event MintingUnpaused();
    
    // State variables
    bool public mintingPaused = false;
    uint256 public mintingFee = 0; // Free minting initially
    uint256 public maxBatchSize = 50; // Limit batch size for gas optimization
    
    constructor() ERC721("Camp Ownership Certificate", "COC") Ownable(msg.sender) {}
    
    /**
     * @dev Mints a new ownership certificate NFT
     * @param to Address to mint the NFT to
     * @param tokenURI Metadata URI for the NFT
     * @return tokenId The ID of the newly minted token
     */
    function mintTo(address to, string memory tokenURI) public payable returns (uint256) {
        require(!mintingPaused, "Minting is currently paused");
        require(msg.value >= mintingFee, "Insufficient payment");
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");
        require(to != address(0), "Cannot mint to zero address");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit CertificateMinted(to, tokenId, tokenURI);

        return tokenId;
    }
    
    /**
     * @dev Mints multiple new ownership certificate NFTs
     * @param to Addresses to mint the NFTs to
     * @param tokenURIs Metadata URIs for the NFTs
     * @return tokenIds The IDs of the newly minted tokens
     */
    function batchMintTo(address[] memory to, string[] memory tokenURIs) 
        public 
        payable 
        returns (uint256[] memory) 
    {
        require(!mintingPaused, "Minting is currently paused");
        require(msg.value >= mintingFee * to.length, "Insufficient payment");
        require(to.length == tokenURIs.length, "Arrays length mismatch");
        require(to.length > 0, "No recipients");
        require(to.length <= maxBatchSize, "Batch size exceeds limit");

        uint256[] memory tokenIds = new uint256[](to.length);

        for (uint256 i = 0; i < to.length; i++) {
            require(bytes(tokenURIs[i]).length > 0, "Token URI cannot be empty");
            require(to[i] != address(0), "Cannot mint to zero address");

            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();

            _mint(to[i], tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);

            emit CertificateMinted(to[i], tokenId, tokenURIs[i]);

            tokenIds[i] = tokenId;
        }

        emit BatchCertificatesMinted(to, tokenIds);

        return tokenIds;
    }
    
    /**
     * @dev Get the current token counter
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    /**
     * @dev Get total number of minted tokens
     */
    function getTotalMinted() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    /**
     * @dev Set maximum batch size (owner only)
     */
    function setMaxBatchSize(uint256 _maxBatchSize) public onlyOwner {
        require(_maxBatchSize > 0, "Batch size must be greater than 0");
        maxBatchSize = _maxBatchSize;
    }
    
    /**
     * @dev Pause minting (owner only)
     */
    function pauseMinting() public onlyOwner {
        mintingPaused = true;
        emit MintingPaused();
    }
    
    /**
     * @dev Unpause minting (owner only)
     */
    function unpauseMinting() public onlyOwner {
        mintingPaused = false;
        emit MintingUnpaused();
    }
    
    /**
     * @dev Set minting fee (owner only)
     */
    function setMintingFee(uint256 _fee) public onlyOwner {
        mintingFee = _fee;
    }
    
    /**
     * @dev Withdraw contract balance (owner only)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Override to support interface detection
     */
    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        override(ERC721URIStorage) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
}