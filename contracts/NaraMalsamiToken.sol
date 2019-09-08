pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/access/roles/WhitelistedRole.sol";
//import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./NaraMalsamiTokenTrade.sol";


contract NaraMalsamiToken is ERC20, ERC20Detailed, WhitelistedRole, Ownable{
    uint8 public constant DECIMALS = 18;
    uint256 public constant INITIAL_SUPPLY = 10000000000 * (10 ** uint256(DECIMALS));
    uint16 public constant fee = 1000; // 10000 = 100%

    address public server;

    event tradeMade(address maker, address tradeAddress);

    constructor() public ERC20Detailed("NaraMalsamiToken", "NMT", DECIMALS)
    {
        _mint(msg.sender, INITIAL_SUPPLY);
        addWhitelisted(msg.sender);
    }

    function setServer(address _server) public onlyWhitelisted {
        server = _server;
    }

    function getServer() public view returns(address){return server;}

    function getDecimals() public pure returns (uint8){
        return DECIMALS;
    }

    function newTrade(uint256 cap, uint256 dataNum, uint256 verifierNum) public returns(bool){
        require(balanceOf(msg.sender) >= cap);
        uint256 feeValue = cap.mul(fee).div(10000);
        uint256 leftValue = cap - feeValue;

        NaraMalsamiTokenTrade NMTT = new NaraMalsamiTokenTrade(this, msg.sender, leftValue, dataNum, verifierNum);
        transfer(server, feeValue);
        transfer(address(NMTT), leftValue);


        emit tradeMade(msg.sender, address(NMTT));
        return true;
    }


}