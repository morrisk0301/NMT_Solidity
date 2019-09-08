var exports = module.exports = {};

const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');

const directory_contracts   = "../../../GitHub/NMT-Solidity/";
//const directory_contracts   = "../../NMT-Solidity/";
const directory_compiled    = directory_contracts + "build/contracts/";
const name_NMT              = "NaraMalsamiToken";
const name_NMTT             = "NaraMalsamiTokenTrade";
const name_CROWD            = "NaraMalsamiTokenCrowdsale";

const ABI_NMT       = require(directory_compiled    + name_NMT  ).abi;  exports.ABI_NMT = ABI_NMT;
const ABI_CROWD     = require(directory_compiled    + name_CROWD).abi;  exports.ABI_CROUD = ABI_CROWD;
const ABI_NMTT      = require(directory_compiled    + name_NMTT ).abi;  exports.ABI_NMTT = ABI_NMTT;
const byteCode_NMTT = require(directory_compiled    + name_NMTT ).bytecode;
const address_NMT   = require(directory_compiled    + name_NMT  ).networks["5777"].address;
//const address_NMT   = "0xf520cef36Ed3C8b3bE4675F4d6139D97900e4Ad6";
const address_CROWD = "0xB24d63ADf01B382EfE6e52B5FE7923A03403813D";
const address_kovan = "0xEfA4Dab6014aAfc8B0f04fc1801e970bDd310A40";
const address_kovan_server = "0xd337318F41EF9a613872dD2eD43b9166c5AC822e";

const addresses     = require("./Addresses");
const contracts     = require("./Contracts");

var web3;
let network = "local";
let initcall = true;

function writeJsonAccount(){
    writeJson("0x0000000000000000000000000000000000000000"); // ANY address for preventing non-value error
}
function writeJson(ContractAddress){
    let json = JSON.stringify({
        "NMTT-Instance" : ContractAddress
    }, null, 2);

    let fs = require('fs');
    fs.writeFile('Contracts.json',json,'utf8', function(err,res){
        if(err) throw err;
    });
}

/**
process.argv.forEach(function (val, index, array) {
    if(index === 2) network = val;
});
*/

(function setWeb3(){
    if(network === "local"){
        web3 = new Web3(new Web3.providers.WebsocketProvider("http://127.0.0.1:7545"));
    }
    else if(network === "kovan") {

    }else if(network === "main"){

    }
})();

function setWeb3a(defaultAccount){
    console.log("==========================================================================================");
    console.log("Network                 : " + network);
    console.log("Address of contract(NMT): " + address_NMT);

    if(network === "local") web3.eth.defaultAccount = defaultAccount;
    else if(network === "kovan") web3.eth.defaultAccount = address_kovan;
    else if(network === "main"){}

    console.log("Address of current user : " + web3.eth.defaultAccount);
    exports.NMT = new web3.eth.Contract(ABI_NMT, address_NMT);
    exports.address_NMT = address_NMT;
    exports.NMTT = new web3.eth.Contract(ABI_NMTT);
    exports.NMTC = new web3.eth.Contract(ABI_CROWD, address_CROWD);
    exports.nonce = web3.eth.getTransactionCount(address_NMT);
    exports.web3 = web3;
    console.log("==========================================================================================");
}

function checkBalance(NMT){
    NMT.methods.balanceOf(addresses.defaultAddress)     .call().then(res=>console.log("Minter:        %s",web3.utils.hexToNumberString(res).padStart(30)));
    NMT.methods.balanceOf(addresses.serverAddress)      .call().then(res=>console.log("Server:        %s",web3.utils.hexToNumberString(res).padStart(30)));
    NMT.methods.balanceOf(addresses.verifierAddress1)   .call().then(res=>console.log("Verifier:      %s",web3.utils.hexToNumberString(res).padStart(30)));
    NMT.methods.balanceOf(addresses.sellerAddress)      .call().then(res=>console.log("Seller:        %s",web3.utils.hexToNumberString(res).padStart(30)));
    NMT.methods.balanceOf(addresses.buyerAddress)       .call().then(res=>console.log("Buyer:         %s",web3.utils.hexToNumberString(res).padStart(30)));
    NMT.methods.balanceOf(contracts["NMTT-Instance"])   .call().then(res=>console.log("Trade Contract:%s",web3.utils.hexToNumberString(res).padStart(30)));
}

function transfer(token, to, amount){
    token.methods.transfer(to,amount).send({},(err,res)=>{
        if(err) throw err;
    })
}

exports.writeJsonAccount = writeJsonAccount;
exports.writeJson = writeJson;
exports.setWeb3 = setWeb3a;
exports.checkBalance = checkBalance;
exports.transfer = transfer;
exports.address_NMT = address_NMT;
exports.byteCode_NMTT = byteCode_NMTT;
exports.network = network;