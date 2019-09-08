pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
//import "openzeppelin-solidity/contracts/access/roles/WhitelistAdminRole.sol";
import "./NaraMalsamiToken.sol";

contract NaraMalsamiTokenTrade is Ownable{

    using SafeMath for uint256;
    using SafeMath for uint16;

    NaraMalsamiToken private _token;    // Address of NMT
    address private _wallet;            // Address of a buyer

    uint16 private _maxAccuracy = 10000;  // 100% = 10000
    uint16 private _sellerRatio = 3000;
    uint16 private _verifierRatio = 7000;

    uint256 private _cap;
    uint256 private _sellerNum=10;      // Not used yet
    uint256 private _verifierNum = 0;

    uint256 private _dataGoal;
    uint256 private _dataRaised;

    uint256 private _weiPerData;        // Tokens per 1 data
    uint256 private _weiPerVerifier;    // Tokens per 1-data-verified-by-1-verifier

    uint256 private _dataBlockCounter = 0;      // Not used yet
    uint256 private _verifierBlockCounter = 0;  // Not used yet

    uint256 private _refundTokenAmount = 0;     // Sum of divided integer leftovers and accuracy based token deduction
    bool private _refundClaimed = false;

    struct Claim {
        uint256 _tokenAmount;
        bool    _exist;
    }
    struct DataBlock{
        string  _fileHash;
        uint256 _numOfData;
        address _seller;
        uint16   _accuracy;
    }
    struct UserBlock{
        address _beneficiary;
        uint256 _tokenAmount;
    }
    mapping (string => UserBlock) private _userData;    // serverHash => UserBlock
    mapping (string => DataBlock) private _fileData;    // serverHash => DataBlock : Seller(_userdata) and _filedata shares same serverHash!
    mapping (string => Claim) private _claimed;         // serverHash => Claim

    event tokensReceived    (address indexed beneficiary, uint256 tokenAmount);
    event fileEmitted       (uint256 numOfData, uint256 dataRaised, uint256 dataGoal, address seller);

    constructor(
        NaraMalsamiToken token,
        address wallet,
        uint256 cap,
        uint256 dataGoal,
        uint256 verifierNum
    )
    public {
        _wallet = wallet;
        transferOwnership(wallet);

        _token = token;
        _cap = cap;
        _dataGoal = dataGoal;
        _verifierNum = verifierNum;
        _dataRaised = 0;

        // Sum of tokens that sellers can get
        uint256 sellerSum = cap
        .mul(_sellerRatio)
        .div(_verifierRatio.add(_sellerRatio));

        // Sum of tokens that verifiers can get
        uint256 verifierSum = cap.sub(sellerSum);

        _weiPerData = sellerSum.div(dataGoal);
        _weiPerVerifier = verifierSum.div(dataGoal.mul(verifierNum));

        // Freeze integer leftovers
        freeze(sellerSum.mod(dataGoal));
        freeze(verifierSum.mod(dataGoal.mul(verifierNum)));
    }

    modifier onlyServer(){
        require(token().isWhitelisted(msg.sender));
        _;
    }

    //fallback
    function () external {

    }

    //getters
    function token()                public view returns (NaraMalsamiToken) {
        return _token;
    }
    function cap()                  public view returns (uint256) {
        return _cap;
    }
    function weiPerData()           public view returns (uint256) {
        return _weiPerData;
    }
    function dataGoal()             public view returns (uint256) {
        return _dataGoal;
    }
    function dataRaised()           public view returns (uint256) {
        return _dataRaised;
    }
    function dataBlockCounter()     public view returns (uint256) {
        return _dataBlockCounter;
    }
    function tokenLeft()            public view returns (uint256) {
        return _token.balanceOf(address(this)) - _refundTokenAmount;
    }
    function refundClaimed()        internal view returns (bool) {
        return _refundClaimed;
    }
    function refundTokenAmount()    public view onlyOwner returns(uint256) {
        require(msg.sender == _wallet);
        return _refundTokenAmount;
    }




    function dataStatus() public view
    returns(uint256, uint256, uint256, uint256, uint256){
        return(_cap, _weiPerData, _dataGoal, _dataRaised, _refundTokenAmount);
    }

    function transactionStatus() public view
    returns(address, uint256){
        return(_wallet, tokenLeft());
    }

    function getData(string memory serverHash) public view onlyOwner
    returns(string memory, uint256, uint256, address){
        require(bytes(_fileData[serverHash]._fileHash).length > 0);

        return (_fileData[serverHash]._fileHash, _fileData[serverHash]._numOfData,
        _fileData[serverHash]._accuracy, _fileData[serverHash]._seller);
    }

    function giveTokens(string calldata serverHash) external onlyServer{
        _preValidatePurchase(serverHash, _userData[serverHash]._beneficiary, _userData[serverHash]._tokenAmount);
        _deliverTokens(serverHash, _userData[serverHash]._beneficiary, _userData[serverHash]._tokenAmount);

        emit tokensReceived(_userData[serverHash]._beneficiary, _userData[serverHash]._tokenAmount);
    }

    function emitSeller     (string calldata serverHash, uint256 numOfData, uint16 accuracy, address beneficiary, string calldata fileHash) external onlyServer {
        uint256 tokenAmount = _weiPerData.mul(numOfData);

        _preValidateData(fileHash, numOfData, accuracy);            // will be removed later
        _preValidateUser(serverHash, beneficiary, tokenAmount);

        _setFile(serverHash, numOfData, accuracy, beneficiary, fileHash);
        _setUser(serverHash, accuracy, beneficiary, tokenAmount);
    }

    function emitVerifier   (string calldata serverHash, uint256 numOfData, uint16 accuracy, address beneficiary) external onlyServer {
        uint256 tokenAmount = _weiPerVerifier.mul(numOfData);
        require(accuracy <= _maxAccuracy);                        // will be removed later

        _preValidateUser(serverHash, beneficiary, tokenAmount);
        _setUser(serverHash, accuracy, beneficiary, tokenAmount);
    }


    function _setFile(string memory serverHash, uint256 numOfData, uint16 accuracy, address beneficiary, string memory fileHash) internal{
        _fileData[serverHash]._numOfData    = numOfData;
        _fileData[serverHash]._accuracy     = accuracy;
        _fileData[serverHash]._seller       = beneficiary;
        _fileData[serverHash]._fileHash     = fileHash;

        _dataRaised = _dataRaised.add(numOfData);

        emit fileEmitted(numOfData, dataRaised(), dataGoal(), beneficiary);
    }

    function _setUser(string memory serverHash, uint16 accuracy, address beneficiary, uint256 tokenAmount) internal{
        uint256 tokenGet = tokenAmount.mul(accuracy).div(_maxAccuracy);
        _userData[serverHash]._beneficiary = beneficiary;
        _userData[serverHash]._tokenAmount = tokenGet;
        freeze(tokenAmount.sub(tokenGet));
    }


    function _deliverTokens(string memory serverHash, address beneficiary, uint256 tokenAmount) internal{
        _claimed[serverHash]._tokenAmount = tokenAmount;
        _claimed[serverHash]._exist = true;

        //_token.transferFrom(address(this), beneficiary, tokenAmount);
        _token.transfer(beneficiary, tokenAmount);
        emit tokensReceived(beneficiary, tokenAmount);
    }


    function _preValidateData(string memory fileHash, uint256 numOfData, uint16 accuracy) internal view {
        require(accuracy <= _maxAccuracy);
        require(bytes(fileHash).length > 0);
        require(numOfData != 0);
        require(dataRaised().add(numOfData) <= dataGoal());
    }

    function _preValidateUser(string memory serverHash, address beneficiary, uint256 tokenAmount) internal view{
        require(beneficiary != address(0));
        require(bytes(serverHash).length > 0);
        require(tokenLeft() >= tokenAmount);
        require(!refundClaimed());
    }

    function _preValidatePurchase(string memory serverHash, address beneficiary, uint256 tokenAmount) internal view {
        require(beneficiary != address(0));
        require(tokenAmount != 0);
        require(bytes(serverHash).length > 0);
        require(_claimed[serverHash]._exist != true);
        require(_userData[serverHash]._beneficiary == beneficiary);
        require(tokenLeft() >= tokenAmount);
    }

    function freeze(uint256 amount) internal {
        _refundTokenAmount.add(amount);
    }

}