const { balance, BN, constants, ether, expectEvent, shouldFail } = require('openzeppelin-test-helpers');
const NaraMalsamiToken= artifacts.require("./NaraMalsamiToken.sol");
const NaraMalsamiTokenCrowdsale = artifacts.require('./NaraMalsamiTokenCrowdsale.sol');

module.exports = function(deployer, network, accounts) {
    return liveDeploy(deployer, accounts);
};

function latestTime(){
    return web3.eth.getBlock('latest').timestamp;
}
const duation = {
    seconds: function(val){return val},
    minutes: function(val){return this.seconds(60)},
    hours: function(val){return this.minutes(60)},
    days: function(val){return this.hours(24)},
    weeks: function(val){return this.days(7)},
    years: function(val){return this.days(365)}
};

async function liveDeploy(deployer, accounts){
    const Rate = BN(1);
    const openingTime = latestTime() + duation.weeks(1);
    const closingTime = openingTime + duation.weeks(1);
    console.log(openingTime, closingTime, Rate.toString(), accounts[0]);
    return deployer.delploy(
        NaraMalsamiTokenCrowdsale,
        openingTime,
        closingTime,
        Rate,
        accounts[0],
        1000000,
        NaraMalsamiToken,
        10000000
    ).then(async() => {
        const instance = await NaraMalsamiTokenCrowdsale.deployed();
        const token = await instance.call();
        console.log("Token Address", token);
    })


}