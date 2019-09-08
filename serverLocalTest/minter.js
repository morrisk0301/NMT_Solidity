const lib           = require("./lib.js");
const addresses     = require("./Addresses");
const contracts     = require("./Contracts");

//let defaultAccount = addresses.defaultAddress;
lib.setWeb3(addresses.defaultAddress);

const NMT = lib.NMT;
const address_NMT = lib.address_NMT;
const web3 = lib.web3;

function addWhitelist(account){
    NMT.methods.isWhitelisted(addresses.serverAddress).call({},(err, res) => {
        if(err) throw err;
        else{
            if(res){ // true; same
                console.log("Adding whitelist failed : Already in whitelist " + account);
            }
            else{   // false; not same
                NMT.methods.addWhitelisted(addresses.serverAddress).send({}, (err, res)=>{if(err) throw err;});
                console.log("Added to whitelist: " + account)
            }
        }
    });
}


addWhitelist(addresses.serverAddress);
NMT.methods.setServer(addresses.serverAddress).send({},(err, res)=>{});

lib.transfer(NMT, addresses.serverAddress, web3.utils.toWei('0.001', 'ether'));
lib.transfer(NMT, addresses.buyerAddress, web3.utils.toWei('0.001', 'ether'));



setTimeout(()=>lib.checkBalance(NMT), 500);