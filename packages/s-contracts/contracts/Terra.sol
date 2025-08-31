// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TerraCafe (Propiedad Fraccional)
 * @dev Contrato para tokenizar lotes de café permitiendo la propiedad fraccional.
 * Cada token (lote) puede ser comprado por múltiples compradores.
 */
contract TerraCafe is ERC1155, ReentrancyGuard {
    // --- Variables de Estado ---
    string public name = "TerraCafe";
    string public symbol = "TCAFE";
    uint256 public tokenIdCounter;

    // --- Mappings de Datos del Lote ---
    mapping(uint256 => address) public tokenCreator; // Productor del lote
    mapping(uint256 => uint256) public pricesInWei; // Precio por unidad/fracción
    mapping(uint256 => string) private _tokenURIs; // URI de metadatos para cada lote

    // --- NUEVO: Estructura y Mappings para la Compra Fraccional ---
    struct Contribution {
        address buyer;
        uint256 amount; // Cantidad en Wei contribuida
    }

    // Mapping de un tokenId a un array de contribuciones de compradores
    mapping(uint256 => Contribution[]) public contributions;
    
    // Mapping para rastrear cuánto ha contribuido cada comprador a un lote
    mapping(uint256 => mapping(address => uint256)) public contributedAmount;
    
    // Mapping para saber el total recaudado para un lote
    mapping(uint256 => uint256) public totalRaised;


    // --- Eventos ---
    event CoffeeListed(
        uint256 indexed tokenId,
        address indexed producer,
        uint256 supply,
        uint256 price,
        string metadataURI
    );

    // NUEVO: Evento para la contribución
    event ContributionMade(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 amountContributed
    );
    
    // MODIFICADO: Refleja la distribución de tokens
    event CoffeeTokensDistributed(
        uint256 indexed tokenId,
        address indexed producer,
        uint256 totalAmount
    );


    // --- Constructor ---
    constructor() ERC1155("") {}

    // --- Funciones Principales ---

    /**
     * @dev Lista un nuevo lote de café. El productor define el número de fracciones (supply).
     * @param _supply El número de fracciones en las que se divide el lote.
     * @param _fullMetadataURI El URI completo para los metadatos del lote.
     * @param _pricePerFractionInWei El precio en wei por cada fracción del lote.
     */
    function listCoffee(
        uint256 _supply,
        string memory _fullMetadataURI,
        uint256 _pricePerFractionInWei
    ) public {
        require(_pricePerFractionInWei > 0, "El precio debe ser > 0");
        require(_supply > 0, "El suministro debe ser > 0");
        
        uint256 newTokenId = tokenIdCounter;

        tokenCreator[newTokenId] = msg.sender;
        pricesInWei[newTokenId] = _pricePerFractionInWei;
        _tokenURIs[newTokenId] = _fullMetadataURI;

        // El productor se mintea a sí mismo todas las fracciones inicialmente
        _mint(msg.sender, newTokenId, _supply, "");
        emit CoffeeListed(newTokenId, msg.sender, _supply, _pricePerFractionInWei, _fullMetadataURI);

        tokenIdCounter++;
    }

    /**
     * @dev Permite a un comprador contribuir fondos para comprar una o más fracciones de un lote.
     * Los tokens no se transfieren hasta que el productor decide "cerrar" la venta.
     */
    function contributeToBuy(uint256 _tokenId, uint256 _fractionsToBuy) public payable nonReentrant {
        uint256 pricePerFraction = pricesInWei[_tokenId];
        address producer = tokenCreator[_tokenId];
        uint256 totalCost = pricePerFraction * _fractionsToBuy;

        require(producer != address(0), "Este lote de cafe no existe.");
        require(balanceOf(producer, _tokenId) >= _fractionsToBuy, "No hay suficientes fracciones disponibles en el lote.");
        require(msg.value == totalCost, "La cantidad de ETH enviada no coincide con el coste total.");

        // Registra la contribución
        contributions[_tokenId].push(Contribution({
            buyer: msg.sender,
            amount: _fractionsToBuy
        }));
        
        contributedAmount[_tokenId][msg.sender] = contributedAmount[_tokenId][msg.sender] + _fractionsToBuy;
        totalRaised[_tokenId] = totalRaised[_tokenId] + msg.value;

        emit ContributionMade(_tokenId, msg.sender, msg.value);
    }
    
    /**
     * @dev NUEVO: Función para que el productor finalice la recaudación y distribuya los tokens.
     * El productor recibe todo el dinero recaudado y los tokens se transfieren a los compradores.
     */
    function distributeTokens(uint256 _tokenId) public nonReentrant {
        address producer = tokenCreator[_tokenId];
        require(msg.sender == producer, "Solo el productor puede distribuir los tokens.");
        
        uint256 amountToDistribute = contributions[_tokenId].length;
        require(amountToDistribute > 0, "No hay contribuciones para distribuir.");

        uint256 totalPayment = totalRaised[_tokenId];
        
        // 1. Pagar al productor
        (bool success, ) = producer.call{value: totalPayment}("");
        require(success, "El pago al productor fallo.");

        // 2. Distribuir los tokens a cada contribuyente
        for (uint i = 0; i < amountToDistribute; i++) {
            Contribution storage contribution = contributions[_tokenId][i];
            address buyer = contribution.buyer;
            uint256 fractions = contribution.amount;
            
            if (fractions > 0) {
                 _safeTransferFrom(producer, buyer, _tokenId, fractions, "");
            }
        }
        
        // 3. Limpiar los datos para evitar re-distribución
        delete contributions[_tokenId];
        delete totalRaised[_tokenId];
        // Opcional: podrías querer mantener el `contributedAmount` para histórico

        emit CoffeeTokensDistributed(_tokenId, producer, totalPayment);
    }


    /**
     * @dev Retorna el URI único para un token específico.
     */
    function uri(uint256 _tokenId) public view override returns (string memory) {
        require(bytes(_tokenURIs[_tokenId]).length > 0, "URI no establecido para este token.");
        return _tokenURIs[_tokenId];
    }
}