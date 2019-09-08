const lib           = require("./lib.js");
const addresses     = require("./addresses");
const contracts     = require("./Contracts");

lib.setWeb3(addresses.serverAddress);
const web3 = lib.web3;
const NMT = lib.NMT;
const NMTT = lib.NMTT;

function tradeInfo(ins){
    ins.methods.transactionStatus().call({},(err,res)=>{
        if(err) throw err;
        else{
            console.log("tokenLeft:  " + res[1]);
        }
    });

    ins.methods.dataStatus().call({},(err, res)=>{
        if(err) throw err;
        else{
            console.log("Cap:        " + res[0]);
            console.log("weiPerData: " + res[1]);
            console.log("dataGoal:   " + res[2]);
            console.log("dataRaised:       " + res[3]);
            console.log("dataBlockCounter: " + res[4]);
        }
    })

}

var NMTT_ins = new web3.eth.Contract(lib.ABI_NMTT, contracts["NMTT-Instance"]);
//tradeInfo(NMTT_ins);

NMT.events.tradeMade({},(err, event)=>{
    console.log("\n==========================================");
    console.log("Maker:         %s", event.returnValues.maker);
    console.log("NMTT address:  %s", event.returnValues.tradeAddress);
    lib.writeJson(event.returnValues.tradeAddress);
    setTimeout(()=>tradeInfo(web3.eth.Contract(lib.ABI_NMTT, contracts["NMTT-Instance"])), 1000);
});
