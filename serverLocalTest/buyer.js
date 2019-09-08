const lib           = require("./lib.js");
const addresses     = require("./addresses");
const contracts     = require("./Contracts");

let mode = "create";
process.argv.forEach(function (val, index, array) {
    if(index === 2) mode = val;
});

lib.setWeb3(addresses.buyerAddress);
let web3 = lib.web3;
let NMT = lib.NMT;
let NMTT = lib.NMTT;


(function start(){
    if(mode === "create"){
        NMT.methods.newTrade(100000, 100, 2).send({
            gas: 20000000           // 1578247
        }, (err, res) => {
            if(err) throw err;
            else console.log(res);
        });
    }
    else if(mode === "instance"){
        let NMTTIns = new web3.eth.Contract(lib.ABI_NMTT, contracts["NMTT-Instance"]);

        NMTTIns.methods.getData("s0000000000000000000000000000000").call({},function(err, res){
            if(err) throw err;
            else console.log(res);
        });
    }
})();