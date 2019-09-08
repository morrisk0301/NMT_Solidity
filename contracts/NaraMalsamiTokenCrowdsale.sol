

pragma solidity ^0.5.0;
/**
import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
import "./NaraMalsamiToken.sol";


contract NaraMalsamiTokenCrowdsale is Crowdsale, CappedCrowdsale, AllowanceCrowdsale, TimedCrowdsale{

    constructor(
        uint256 openingTime,
        uint256 closingTime,
        uint256 rate,
        address payable wallet,
        uint256 cap,
        ERC20 token
    )
        Crowdsale(rate, wallet, token)
        CappedCrowdsale(cap)
        AllowanceCrowdsale(wallet)
        TimedCrowdsale(openingTime, closingTime)
    public {

    }

}

*/