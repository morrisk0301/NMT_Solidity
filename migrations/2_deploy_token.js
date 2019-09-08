const NaraMalsamiToken= artifacts.require("./NaraMalsamiToken.sol");
const NaraMalsamiTokenTrade= artifacts.require("./NaraMalsamiTokenTrade.sol");
//const NaraMalsamiTokenCrowdsale = artifacts.require('./NaraMalsamiTokenCrowdsale.sol');

const duration = {
    seconds: function(val){return val;},
    minutes: function(val){return val*this.seconds(60);},
    hours: function(val){return val*this.minutes(60);},
    days: function(val){return val*this.hours(24);},
    weeks: function(val){return val*this.days(7);},
    years: function(val){return val*this.days(365);}
};

module.exports = async function(deployer, network, accounts) {

    await deployer.deploy(NaraMalsamiToken);
    //await deployer.deploy(NaraMalsamiTokenTrade);

    /* Crowdsale
    //await deployer.deploy(NaraMalsamiToken);
    //const deployedToken = await NaraMalsamiToken.deployed();
    const block = await web3.eth.getBlock("latest");
    const latestTime = await block.timestamp;
    const openingTime = latestTime + duration.minutes(1);
    const closingTime = openingTime + duration.minutes(1);
    const cap = web3.utils.toWei('1', 'ether');

    //uint256 openingTime, uint256 closingTime, uint256 rate, address payable wallet, uint256 cap, ERC20 token
    await deployer.deploy(NaraMalsamiTokenCrowdsale,
        openingTime,
        closingTime,
        1,
        accounts[0],
        cap,
        deployedToken.address,
        );
    */


    return true;
};