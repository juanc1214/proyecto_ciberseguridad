// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract Auction {
    struct AuctionItem {
        string name;
        string description;
        uint256 finalDate;
        uint currentBidAmount;
        string currentWinner;
        address payable issuer;
    }
    
    uint public auctionCount = 0;
    mapping(uint => AuctionItem) public auctions;
    uint[] public activeAuctions;

    modifier ifIssuer(uint auctionId) {
        require(auctions[auctionId].issuer == msg.sender, "Solo el emisor del contrato puede realizar esta accion.");
        _;
    }
    
    function createAuction(string memory name, string memory description, uint256 duration) public {
        auctionCount++;
        auctions[auctionCount] = AuctionItem({
            name: name,
            description: description,
            finalDate: block.timestamp + duration,
            currentBidAmount: 0,
            currentWinner: "",
            issuer: payable(msg.sender)
        });
        activeAuctions.push(auctionCount);
    }

    function bid(uint auctionId, string memory candidate) public payable {
        AuctionItem storage auction = auctions[auctionId];
        require(block.timestamp < auction.finalDate, "La subasta ha finalizado.");
        require(msg.value > auction.currentBidAmount, "La nueva oferta debe ser mayor que la oferta actual.");
        auction.currentBidAmount = msg.value;
        auction.currentWinner = candidate;
    }

    function withdrawBid(uint auctionId) public ifIssuer(auctionId) {
        AuctionItem storage auction = auctions[auctionId];
        auction.issuer.transfer(auction.currentBidAmount);
    }

    function getActiveAuctions() public view returns(uint[] memory) {
        return activeAuctions;
    }

    function getAuctionDetails(uint auctionId) public view returns(string memory, string memory, uint256, uint, string memory, address) {
        AuctionItem storage auction = auctions[auctionId];
        return (auction.name, auction.description, auction.finalDate, auction.currentBidAmount, auction.currentWinner, auction.issuer);
    }
}
