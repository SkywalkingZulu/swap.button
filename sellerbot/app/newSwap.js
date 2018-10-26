import config from '../config';
import configName from '../config.name';
import web3 from '../helpers/web3'
import bitcoin from 'bitcoinjs-lib'
import abi from 'human-standard-token-abi'
import Channel from 'ipfs-pubsub-room'
import IPFS from 'ipfs'
import authdata from '../authdata';
import Storage from '../helpers/storage';

const swap = require('swap.core')

const ethHelper = require('../helpers/eth');
const btcHelper = require('../helpers/btc');
const tokensHelper = require('../helpers/tokens');

const waitWeb3 = require('../helpers/waitWEB3');

const createSwapApp = () => {
  console.log("..Init Swap.Core....");
  /* ------------------------------------ */
  const authData = new swap.auth({
    eth: (config.auth && config.auth.eth) ? config.auth.eth : authdata.eth,
    btc: (config.auth && config.auth.btc) ? config.auth.btc : authdata.btc
  });
  /* ------------------------------------ */
  //const swaps = [];
  /* Initial swaps */
  const swaps = [
    new swap.swaps.EthSwap({
      address: config.eth.contract,
      gasLimit: 1e5,
      abi: [{ 'constant':false, 'inputs':[{ 'name':'val', 'type':'uint256' }], 'name':'testnetWithdrawn', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_secret', 'type':'bytes32' }, { 'name':'_ownerAddress', 'type':'address' }], 'name':'withdraw', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[{ 'name':'_participantAddress', 'type':'address' }], 'name':'getSecret', 'outputs':[{ 'name':'', 'type':'bytes32' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':true, 'inputs':[{ 'name':'', 'type':'address' }, { 'name':'', 'type':'address' }], 'name':'participantSigns', 'outputs':[{ 'name':'', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'owner', 'outputs':[{ 'name':'', 'type':'address' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':true, 'inputs':[{ 'name':'', 'type':'address' }, { 'name':'', 'type':'address' }], 'name':'swaps', 'outputs':[{ 'name':'secret', 'type':'bytes32' }, { 'name':'secretHash', 'type':'bytes20' }, { 'name':'createdAt', 'type':'uint256' }, { 'name':'balance', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_secretHash', 'type':'bytes20' }, { 'name':'_participantAddress', 'type':'address' }], 'name':'createSwap', 'outputs':[], 'payable':true, 'stateMutability':'payable', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'ratingContractAddress', 'outputs':[{ 'name':'', 'type':'address' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':true, 'inputs':[{ 'name':'_ownerAddress', 'type':'address' }], 'name':'getBalance', 'outputs':[{ 'name':'', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_participantAddress', 'type':'address' }], 'name':'refund', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'constructor' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'name':'createdAt', 'type':'uint256' }], 'name':'CreateSwap', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'name':'_secret', 'type':'bytes32' }, { 'indexed':false, 'name':'addr', 'type':'address' }, { 'indexed':false, 'name':'amount', 'type':'uint256' }], 'name':'Withdraw', 'type':'event' }, { 'anonymous':false, 'inputs':[], 'name':'Close', 'type':'event' }, { 'anonymous':false, 'inputs':[], 'name':'Refund', 'type':'event' }],
      fetchBalance: (address) => ethHelper.fetchBalanceAsync(address),
    }),
    new swap.swaps.BtcSwap({
      fetchBalance: (address) => btcHelper.fetchBalance(address),
      fetchUnspents: (scriptAddress) => btcHelper.fetchUnspents(scriptAddress),
      broadcastTx: (txRaw) => btcHelper.broadcastTx(txRaw),
    })
  ];
  const flows = [];
  console.log("....Init token swaps");
  for (let tokenName in config.tokens) {
    if (config.tokens[tokenName].erc20) {
      /* auto add this token to core */
      swap.constants.COINS[tokenName] = tokenName.toUpperCase();
    };
    if (swap.constants.COINS[tokenName]!==undefined) {
      console.log("......",swap.constants.COINS[tokenName]);
      /* swap */
      swaps.push(
        new swap.swaps.EthTokenSwap({
          name: swap.constants.COINS[tokenName],
          address: (config.tokens[tokenName].contract!==undefined) ? config.tokens[tokenName].contract : config.token.contract,
          decimals: config.tokens[tokenName].decimals,
          abi: config.token.abi,
          tokenAddress: config.tokens[tokenName].address,
          tokenAbi: [{ 'constant':true, 'inputs':[], 'name':'name', 'outputs':[{ 'name':'', 'type':'string' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_spender', 'type':'address' }, { 'name':'_amount', 'type':'uint256' }], 'name':'approve', 'outputs':[{ 'name':'success', 'type':'bool' }], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'totalSupply', 'outputs':[{ 'name':'', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_from', 'type':'address' }, { 'name':'_to', 'type':'address' }, { 'name':'_amount', 'type':'uint256' }], 'name':'transferFrom', 'outputs':[{ 'name':'success', 'type':'bool' }], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':false, 'inputs':[], 'name':'getBurnPrice', 'outputs':[{ 'name':'', 'type':'uint256' }], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'decimals', 'outputs':[{ 'name':'', 'type':'uint8' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'manager', 'outputs':[{ 'name':'', 'type':'address' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[], 'name':'unlockEmission', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[{ 'name':'_owner', 'type':'address' }], 'name':'balanceOf', 'outputs':[{ 'name':'balance', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'emissionlocked', 'outputs':[{ 'name':'', 'type':'bool' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[], 'name':'acceptOwnership', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':false, 'inputs':[], 'name':'lockEmission', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'owner', 'outputs':[{ 'name':'', 'type':'address' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'symbol', 'outputs':[{ 'name':'', 'type':'string' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[], 'name':'burnAll', 'outputs':[{ 'name':'', 'type':'bool' }], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_newManager', 'type':'address' }], 'name':'changeManager', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_newOwner', 'type':'address' }], 'name':'changeOwner', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_to', 'type':'address' }, { 'name':'_amount', 'type':'uint256' }], 'name':'transfer', 'outputs':[{ 'name':'success', 'type':'bool' }], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'emissionPrice', 'outputs':[{ 'name':'', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[], 'name':'addToReserve', 'outputs':[{ 'name':'', 'type':'bool' }], 'payable':true, 'stateMutability':'payable', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'burnPrice', 'outputs':[{ 'name':'', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'tokenAddress', 'type':'address' }, { 'name':'amount', 'type':'uint256' }], 'name':'transferAnyERC20Token', 'outputs':[{ 'name':'success', 'type':'bool' }], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[{ 'name':'_owner', 'type':'address' }, { 'name':'_spender', 'type':'address' }], 'name':'allowance', 'outputs':[{ 'name':'remaining', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[], 'name':'NoxonInit', 'outputs':[{ 'name':'', 'type':'bool' }], 'payable':true, 'stateMutability':'payable', 'type':'function' }, { 'constant':false, 'inputs':[], 'name':'acceptManagership', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'constructor' }, { 'payable':true, 'stateMutability':'payable', 'type':'fallback' }, { 'anonymous':false, 'inputs':[{ 'indexed':true, 'name':'buyer', 'type':'address' }, { 'indexed':false, 'name':'ethers', 'type':'uint256' }, { 'indexed':false, 'name':'_emissionedPrice', 'type':'uint256' }, { 'indexed':false, 'name':'amountOfTokens', 'type':'uint256' }], 'name':'TokenBought', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':true, 'name':'buyer', 'type':'address' }, { 'indexed':false, 'name':'ethers', 'type':'uint256' }, { 'indexed':false, 'name':'_burnedPrice', 'type':'uint256' }, { 'indexed':false, 'name':'amountOfTokens', 'type':'uint256' }], 'name':'TokenBurned', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'name':'etherReserved', 'type':'uint256' }], 'name':'EtherReserved', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':true, 'name':'_from', 'type':'address' }, { 'indexed':true, 'name':'_to', 'type':'address' }, { 'indexed':false, 'name':'_value', 'type':'uint256' }], 'name':'Transfer', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':true, 'name':'_owner', 'type':'address' }, { 'indexed':true, 'name':'_spender', 'type':'address' }, { 'indexed':false, 'name':'_value', 'type':'uint256' }], 'name':'Approval', 'type':'event' }],
          fetchBalance: (address) => tokensHelper.fetchBalance(address, config.tokens[tokenName].address, config.tokens[tokenName].decimals),
        }),
      );
      /* flows */
      
      flows.push(swap.flows.ETHTOKEN2BTC(swap.constants.COINS[tokenName]));
      flows.push(swap.flows.BTC2ETHTOKEN(swap.constants.COINS[tokenName]));
      
      config.tokens[tokenName].inited = true;
      /*
      APP.Swap_btcDirections.push ( "BTC2"+window.swap.core.constants.COINS[tokenName] );
      APP.Swap_btcDirections.push ( "USDT2"+window.swap.core.constants.COINS[tokenName] );
      APP.Swap_ethDirections.push ( window.swap.core.constants.COINS[tokenName] + "2BTC" );
      APP.Swap_ethDirections.push ( window.swap.core.constants.COINS[tokenName] + "2USDT" );
      */
    }
  };
  console.log("......Ready");
  /* ------------------------------------ */
  try {
    console.log("....Init core");
    console.log("......Please wait");
    swap.app.setup({
      network: config.network,
      env: {
        web3 : web3,
        bitcoin : bitcoin,
        Ipfs: IPFS,
        IpfsRoom: Channel,
        storage:  Storage,
      },
      services: [
        authData,
        new swap.room({
          repo: 'client/ipfs/data/'+configName,
          EXPERIMENTAL: {
            pubsub: true,
          },
          config: {
            Addresses: {
              Swarm: config.ipfs.swarm
            },
          },
        }),
        new swap.orders(),
      ],
      swaps: swaps,
      flows: flows
    });
    console.log("....Ready");
  } catch (e) {
    console.log("....Fail init swap.core");
    console.log(e.message);
  };
  console.log("..Ready - Swap core inited");
  console.log("----------------------------");
  waitWeb3( async () => {
    console.log("Web3 Ready... check balances");
    let ethBalance = await ethHelper.fetchBalanceAsync(swap.app.services.auth.accounts.eth.address);
    let btcBalance = await btcHelper.fetchBalance(swap.app.services.auth.accounts.btc.getAddress());
    const tokenBalances = {};
    for (let tokenName in config.tokens) {
      if (config.tokens[tokenName].inited) {
        tokenBalances[tokenName] = await tokensHelper.fetchBalance(
          swap.app.services.auth.accounts.eth.address,
          config.tokens[tokenName].address,
          config.tokens[tokenName].decimals
        );
      }
    }
    console.log("Auth data and balance info:");
    console.log("..ETH: ", swap.app.services.auth.accounts.eth.address);
    console.log("....Balance: ", ethBalance);
    console.log("..BTC: ", swap.app.services.auth.accounts.btc.getAddress());
    console.log("....Balance: ", btcBalance);
    console.log("..Tokens:");
    for (let tokenName in tokenBalances) {
      console.log("...."+tokenName.toUpperCase()+":",tokenBalances[tokenName]);
    }
  } );
}

module.exports = createSwapApp
