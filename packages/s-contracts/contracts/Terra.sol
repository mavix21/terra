// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TerraCafe (Fractional Ownership)
 * @dev Contract for tokenizing coffee lots allowing fractional ownership.
 * Each token (lot) can be purchased by multiple buyers.
 */
contract TerraFactory is ERC1155, ReentrancyGuard {
    // --- State Variables ---
    string public name = "TerraFactory";
    string public symbol = "TERRA";
    uint256 public tokenIdCounter;

    // --- Lot Data Mappings ---
    mapping(uint256 => address) public tokenCreator; // Lot producer
    mapping(uint256 => uint256) public pricesInWei; // Price per unit/fraction
    mapping(uint256 => string) private _tokenURIs; // Metadata URI for each lot

    // --- NEW: Structure and Mappings for Fractional Purchase ---
    struct Contribution {
        address buyer;
        uint256 amount; // Amount contributed in Wei
    }

    // Mapping from tokenId to array of buyer contributions
    mapping(uint256 => Contribution[]) public contributions;
    
    // Mapping to track how much each buyer has contributed to a lot
    mapping(uint256 => mapping(address => uint256)) public contributedAmount;
    
    // Mapping to know total raised for a lot
    mapping(uint256 => uint256) public totalRaised;


    // --- Events ---
    event CoffeeListed(
        uint256 indexed tokenId,
        address indexed producer,
        uint256 supply,
        uint256 price,
        string metadataURI
    );

    // NEW: Event for contribution
    event ContributionMade(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 amountContributed
    );
    
    // MODIFIED: Reflects token distribution
    event CoffeeTokensDistributed(
        uint256 indexed tokenId,
        address indexed producer,
        uint256 totalAmount
    );


    // --- Constructor ---
    constructor() ERC1155("") {}

    // --- Main Functions ---

    /**
     * @dev Lists a new coffee lot. Producer defines number of fractions (supply).
     * @param _supply The number of fractions the lot is divided into.
     * @param _fullMetadataURI The complete URI for lot metadata.
     * @param _pricePerFractionInWei The price in wei per lot fraction.
     */
    function listCoffee(
        uint256 _supply,
        string memory _fullMetadataURI,
        uint256 _pricePerFractionInWei
    ) public {
        require(_pricePerFractionInWei > 0, "Price must be > 0");
        require(_supply > 0, "Supply must be > 0");
        
        uint256 newTokenId = tokenIdCounter;

        tokenCreator[newTokenId] = msg.sender;
        pricesInWei[newTokenId] = _pricePerFractionInWei;
        _tokenURIs[newTokenId] = _fullMetadataURI;

        // Producer mints all fractions to themselves initially
        _mint(msg.sender, newTokenId, _supply, "");
        emit CoffeeListed(newTokenId, msg.sender, _supply, _pricePerFractionInWei, _fullMetadataURI);

        tokenIdCounter++;
    }

    /**
     * @dev Allows a buyer to contribute funds to purchase one or more lot fractions.
     * Tokens are not transferred until producer decides to "close" the sale.
     */
    function contributeToBuy(uint256 _tokenId, uint256 _fractionsToBuy) public payable nonReentrant {
        uint256 pricePerFraction = pricesInWei[_tokenId];
        address producer = tokenCreator[_tokenId];
        uint256 totalCost = pricePerFraction * _fractionsToBuy;

        require(producer != address(0), "This coffee lot does not exist");
        require(balanceOf(producer, _tokenId) >= _fractionsToBuy, "Not enough fractions available in the lot");
        require(msg.value == totalCost, "ETH amount sent does not match total cost");

        // Record contribution
        contributions[_tokenId].push(Contribution({
            buyer: msg.sender,
            amount: _fractionsToBuy
        }));
        
        contributedAmount[_tokenId][msg.sender] = contributedAmount[_tokenId][msg.sender] + _fractionsToBuy;
        totalRaised[_tokenId] = totalRaised[_tokenId] + msg.value;

        emit ContributionMade(_tokenId, msg.sender, msg.value);
    }
    
    /**
     * @dev NEW: Function for producer to finalize fundraising and distribute tokens.
     * Producer receives all raised money and tokens are transferred to buyers.
     */
    function distributeTokens(uint256 _tokenId) public nonReentrant {
        address producer = tokenCreator[_tokenId];
        require(msg.sender == producer, "Only producer can distribute tokens");
        
        uint256 amountToDistribute = contributions[_tokenId].length;
        require(amountToDistribute > 0, "No contributions to distribute");

        uint256 totalPayment = totalRaised[_tokenId];
        
        // 1. Pay the producer
        (bool success, ) = producer.call{value: totalPayment}("");
        require(success, "Producer payment failed");

        // 2. Distribute tokens to each contributor
        for (uint i = 0; i < amountToDistribute; i++) {
            Contribution storage contribution = contributions[_tokenId][i];
            address buyer = contribution.buyer;
            uint256 fractions = contribution.amount;
            
            if (fractions > 0) {
                 _safeTransferFrom(producer, buyer, _tokenId, fractions, "");
            }
        }
        
        // 3. Clean data to prevent re-distribution
        delete contributions[_tokenId];
        delete totalRaised[_tokenId];
        // Optional: you may want to keep contributedAmount for history

        emit CoffeeTokensDistributed(_tokenId, producer, totalPayment);
    }


    /**
     * @dev Returns unique URI for a specific token.
     */
    function uri(uint256 _tokenId) public view override returns (string memory) {
        require(bytes(_tokenURIs[_tokenId]).length > 0, "URI not set for this token");
        return _tokenURIs[_tokenId];
    }
}