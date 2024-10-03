// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auction {
    address public deployer;

    event FundReceived(address sender, uint256 amount);
    event AuctionCreated(uint256 indexed itemId, string name, uint256 startingPrice);
    event NewBid(uint256 indexed itemId, address indexed bidder, uint256 bidAmount);
    event AuctionEnded(uint256 indexed itemId, address indexed winner, uint256 winningBid);

    struct Item {
        string name;
        uint256 startingPrice;
        address payable seller;
        uint256 lastBidTime;
        address highestBidder;
        uint256 highestBid;
        bool ended;
    }

    struct Bid {
        address bidder;
        uint256 amount;
        bytes32 previousHash;
        bytes32 currentHash;
        uint256 blockNumber;
        bool win;
    }

    mapping(uint256 => Item) public items;
    mapping(string => uint256) private itemNameToIndex;
    mapping(uint256 => Bid[]) public bids;
    uint256 public itemCount = 1;

    constructor() payable  {
        deployer = msg.sender;
        emit AuctionCreated(0, 'genesis', 0);
    }

    // Create an auction with the provided parameters
    function createAuction(string memory _name, uint256 _startingPrice) public {
        require(_startingPrice > 0, "Starting price must be greater than zero");

        itemCount++;
        items[itemCount] = Item({
            name: _name,
            startingPrice: _startingPrice,
            seller: payable(msg.sender),
            lastBidTime: 0,
            highestBidder: payable(msg.sender),
            highestBid: _startingPrice,
            ended: false
        });

        itemNameToIndex[_name] = itemCount;

        emit AuctionCreated(itemCount, _name, _startingPrice);
    }

    // Find the index of an item using its name
    function getItemIndex(string memory _name) public view returns (uint256) {
        uint256 index = itemNameToIndex[_name];
        require(index > 1, "Item not found");
        return index;
    }

    // Place a bid on an auction
    function bid(uint256 _itemId) public payable returns (bool) {
        require(_itemId > 1, "Invalid itemId");
        Item storage item = items[_itemId];
        
        require(!item.ended, "Auction has ended");
        require(msg.value > item.highestBid && msg.value >= item.startingPrice, "Bid not high enough");

        if (item.highestBid > 0) {
            (bool success, ) = payable(item.highestBidder).call{value: item.highestBid}("");
            require(success, "Refund to previous bidder failed");
        }

        bids[_itemId].push(Bid({
            bidder: msg.sender,
            amount: msg.value,
            previousHash: blockhash(block.number - 1),
            currentHash: blockhash(block.number),
            blockNumber: block.number,
            win: false
        }));

        if (bids[_itemId].length > 1) {
            bids[_itemId][bids[_itemId].length - 2].currentHash = blockhash(block.number - 1);
        }

        item.highestBidder = msg.sender;
        item.highestBid = msg.value;
        item.lastBidTime = block.timestamp;

        emit NewBid(_itemId, msg.sender, msg.value);

        return true;
    }

    // End an auction and transfer funds to the seller and deployer
    function endAuction(uint256 _itemId) public {
        Item storage item = items[_itemId];

        if (bids[_itemId].length == 0) {
        item.ended = true; 
        return;
        }

        bids[_itemId][bids[_itemId].length - 1].win = true;
        require(_itemId > 1, "Invalid item ID");
        require(block.timestamp >= item.lastBidTime + 5 seconds, "Auction cannot end yet");
        require(!item.ended, "Auction already ended");

        if (bids[_itemId].length > 1) {
            bids[_itemId][bids[_itemId].length - 1].currentHash = blockhash(block.number - 1);
        }

        if (item.highestBid > 0) {
            uint256 sellerAmount = (item.highestBid * 90) / 100;
            uint256 deployerAmount = item.highestBid - sellerAmount;

            (bool successSeller, ) = item.seller.call{value: sellerAmount}("");
            require(successSeller, "Transfer to seller failed");

            (bool successDeployer, ) = deployer.call{value: deployerAmount}("");
            require(successDeployer, "Transfer to deployer failed");

            emit AuctionEnded(_itemId, item.highestBidder, item.highestBid);
        }

        item.ended = true;
    }

    // Function to get all bids for a specific auction item
    function getBids(uint256 _itemId) public view returns (Bid[] memory) {
        return bids[_itemId];
    }

    // Function to get the winner of the auction for a specific item
    function getAuctionWinner(uint256 _itemId) public view returns (address winner, uint256 winningBid) {
        require(_itemId > 1, "Invalid itemId");
        Item storage item = items[_itemId];
        require(item.ended, "Auction has not ended yet");
        
        return (item.highestBidder, item.highestBid);
    }

    // Function to retrieve ongoing auctions
    function getOngoingAuctions() public view returns (Item[] memory) {
        uint256 ongoingCount = 0;
        for (uint256 i = 1; i <= itemCount; i++) {
            if (!items[i].ended) {
                ongoingCount++;
            }
        }

        Item[] memory ongoingItems = new Item[](ongoingCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= itemCount; i++) {
            if (!items[i].ended) {
                ongoingItems[index] = items[i];
                index++;
            }
        }

        return ongoingItems;
    }

    // Function to get the highest bid of an item using its index
    function getHighestBid(uint256 _itemId) public view returns (uint256) {
        Item storage item = items[_itemId];
        require(_itemId > 1 && _itemId <= itemCount, "Invalid item ID");
        return item.highestBid;
    }

    // Function to get the highest bidder of an item using its index
    function getHighestBidder(uint256 _itemId) public view returns (address) {
        Item storage item = items[_itemId];
        require(_itemId > 1 && _itemId <= itemCount, "Invalid item ID");
        return item.highestBidder;
    }
}