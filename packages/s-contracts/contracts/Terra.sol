// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title FreeCafePlatform (Flexible URI)
 * @dev A permissionless contract where each coffee token has its own unique metadata URI,
 * making it truly decentralized.
 */
contract TerraCafe is ERC1155, ReentrancyGuard {

    string public name = "TerraFactory";
    string public symbol ="TERRA";
    // --- State Variables ---
    uint256 public tokenIdCounter;
    mapping(uint256 => address) public tokenCreator;
    mapping(uint256 => uint256) public pricesInWei;

    // NEW: We will store the unique URI for each token ID.
    mapping(uint256 => string) private _tokenURIs;

    // --- Events ---
    event CoffeeListed(
        uint256 indexed tokenId,
        address indexed producer,
        uint256 supply,
        uint256 price,
        string metadataURI
    );

    event CoffeePurchased(
        uint256 indexed tokenId,
        address indexed buyer,
        address indexed producer,
        uint256 amount,
        uint256 totalCost
    );

    // --- Constructor ---
    /**
     * BETTER: The constructor is now empty. We don't need a base URL
     * because each token will have its own full URI.
     */
    constructor() ERC1155("") {}

    // --- Core Functions ---

    /**
     * @dev Anyone can list their coffee for sale.
     * @param _supply The number of tokens to create.
     * @param _fullMetadataURI The COMPLETE URI for the metadata (e.g., "ipfs://Qm...").
     * @param _priceInWei The price per token in wei.
     */
    function listCoffee(
        uint256 _supply,
        string memory _fullMetadataURI,
        uint256 _priceInWei
    ) public {
        require(_priceInWei > 0, "Price must be > 0");
        require(_supply > 0, "Supply must be > 0");
        
        uint256 newTokenId = tokenIdCounter;

        tokenCreator[newTokenId] = msg.sender;
        pricesInWei[newTokenId] = _priceInWei;

        // NEW: Store the specific URI for this new token ID.
        _tokenURIs[newTokenId] = _fullMetadataURI;

        _mint(msg.sender, newTokenId, _supply, "");
        emit CoffeeListed(newTokenId, msg.sender, _supply, _priceInWei, _fullMetadataURI);

        tokenIdCounter++;
    }

    /**
     * @dev Allows anyone to buy coffee.
     */
    function buyCoffee(uint256 _tokenId, uint256 _amount) public payable nonReentrant {
        uint256 unitPrice = pricesInWei[_tokenId];
        address producer = tokenCreator[_tokenId];
        uint256 totalCost = unitPrice * _amount;

        require(producer != address(0), "This coffee does not exist");
        require(balanceOf(producer, _tokenId) >= _amount, "Not enough stock available");
        require(msg.value >= totalCost, "Not enough funds sent");

        (bool success, ) = producer.call{value: totalCost}("");
        require(success, "Payment to producer failed");

        _safeTransferFrom(producer, msg.sender, _tokenId, _amount, "");
        
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }

        emit CoffeePurchased(_tokenId, msg.sender, producer, _amount, totalCost);
    }
    
    /**
     * @dev NEW: This function overrides the default behavior.
     * It returns the unique URI for a specific token.
     * Wallets and marketplaces call this function to get the token's metadata.
     */
    function uri(uint256 _tokenId) public view override returns (string memory) {
        return _tokenURIs[_tokenId];
    }
}