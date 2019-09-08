# NMT-Solidity v.0.8a


Server fee : 10.00 %\
Distribution ratio ( seller : verifier) = 3 : 7

If you want information about functions of NMT and NMTT, please read the API document at link below.
https://docs.google.com/spreadsheets/d/1XWeqrEmtZKDN_0nu5KsmwYrZlxNPH1NSabP1kux0P-8/edit?usp=sharing

Local testing code updated at NMT-Solidity/serverLocalTest
*****

Requires:
  - Minter
  - Server (includes listener)
  
  - Buyer
  - Seller
  - Verifier
  
*****
Run sequences:


# Web3 version 1.0x
>
>>- Calling a method
>>
>>        token.method.constMethodName(params).call({},(err,res)=>{res[index]});  //res is return value(s)
>>        token.method.MethodName(params).send({},callback)  // res is tx hash
>>        // bracket is optional, but necessary if there is callback after it(even if it's empty bracket).
>>        // {from:<address>, gas:<gasAmount>, gasPrice:<gasPrice>} all are optional
>>    For more information, check https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods
>
>1. Minter
>
>        NMT.methods.addWhitelisted(<ServerAddress>).send();
>        NMT.methods.setServer(<ServerAddress>).send();
>        NMT.methods.transfer(<BuyerAddress>, <tokenAmount>).send();   // So that buyer can make a trade
>        
>        // Troubleshooting of current web3 version: digit number bigger than 1e16 cause error. Use hex instead
>        // https://github.com/ethereum/web3.js/issues/2077
>  
>2. Listener
>
>        NMT.events.tradeMade({},(err, event)=>{
>          // Save and pass <event.returnValues.tradeAddress> to server
>        });
>        
>  
>3. Buyer
>
>        NMT.methods.newTrade(<cap>,<numOfData>,<numOfVerifier>).send();  // with enough gas
>  
>4. Server
>
>        // Accuracy: 0 ~ 10000 int16, 0=0.00%, 10000=100.00%
>        let NMTTIns = new web3.eth.Contract(<NMTT ABI>, <NMTT address>);
>        NMTTIns.methods.emitSeller   (<serverHash1>, <numOfData>, <accuracy>, <SellerAddress>, <fileHash>).send();// Emit seller
>        NMTTIns.methods.emitVerifier (<serverHash2>, <numOfData>, <accuracy>, <VerifierAddress>);    // Emit verifier   
>  
>        NMTTIns.methods.giveTokens   (<serverHash1 or serverHash2>);    // request giving tokens to seller or verifier
>     
>     
>5. Buyer
>
>        <NMTT instance>.getData(<serverHash1>).call();
>



# Web3 version 0.2x
>
>1. Minter
>
>        NMT.addWhitelisted(<ServerAddress>);
>        NMT.setServer(<ServerAddress>);
>        NMT.transfer(<BuyerAddress>);   // So that buyer can make a trade
>  
>2. Listener
>
>        event = NMT.tradeMade();
>        event.watch(function(err,res){}); // Save and pass res.args.tradeAddress to Server        
>  
>3. Buyer
>
>        NMT.newTrade(<cap>,<numOfData>,<numOfVerifier>);  // with enough gas
>  
>4. Server
>
>        // Accuracy: 0 ~ 10000 int16, 0=0.00%, 10000=100.00%
>        <NMTT instance>.emitSeller   (<serverHash1>, <numOfData>, <accuracy>, <SellerAddress>, <fileHash>);   // Emit seller
>        <NMTT instance>.emitVerifier (<serverHash2>, <numOfData>, <accuracy>, <VerifierAddress>);    // Emit verifier
>        
>        <NMTT instance>.giveTokens   (<serverHash1 or serverHash2>);    // request giving tokens to seller or verifier
>     
>     
>5. Buyer
>
>        <NMTT instance>.getData(<serverHash1>);
>
