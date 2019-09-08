const lib           = require("./lib.js");
const addresses     = require("./addresses");
const contracts     = require("./Contracts");

lib.setWeb3(addresses.serverAddress);
const NMT = lib.NMT;
const NMTT = lib.NMTT;
const web3 = lib.web3;


var NMTTIns = new web3.eth.Contract(lib.ABI_NMTT, contracts["NMTT-Instance"]);//Existing Contract

function emitData(ins, serverhash, datanum, accuracy, seller, filehash){
    ins.methods.emitSeller(serverhash, datanum, accuracy, seller, filehash).send({gas:3000000},function(err, txHash){
        if(err)
            throw err;
        else
            console.log(txHash);
    });
    console.log("Filehash   : %s",filehash);
    console.log("Serverhash : %s",serverhash);
}

function emitVerifier(ins, serverhash, datanum, accuracy, verifier){
    ins.methods.emitVerifier(serverhash, datanum, accuracy, verifier).send({gas:1000000},function(err, txHash){
        if(err) throw err;
        else console.log(txHash);
    })
}

let datanum = {'verifier':1, 'seller' : 1};
let accuracy = {'verifier':100, 'seller':100};
let serverhash = {'verifier': "v0000000000000000000000000000000", 'seller': "s0000000000000000000000000000000"};

//emitData(NMTTIns, "filehash_"+Math.floor(Math.random()*10000000000000),"serverhash_"+Math.floor(Math.random()*10000000000000), 1, accuracy, addresses.sellerAddress);
emitData    (NMTTIns, serverhash.seller,    datanum.seller,     accuracy.seller,    addresses.sellerAddress, "f1234567890123456789012345678903");
emitVerifier(NMTTIns, serverhash.verifier,  datanum.verifier,   accuracy.verifier,  addresses.verifierAddress1);

setTimeout(()=>{
    NMTTIns.methods.giveTokens(serverhash.seller).send({gas:8000000}, function(err, txHash){
        if(err) throw err;
        else console.log(txHash);
    });
    NMTTIns.methods.giveTokens(serverhash.verifier).send({gas:8000000}, function(err, txHash){
        if(err) throw err;
        else console.log(txHash);
    });
}, 1000);


setTimeout(()=>lib.checkBalance(NMT), 1500);