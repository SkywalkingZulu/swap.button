import config from '../config';
import Web3 from 'web3'

const web3 = new Web3(new Web3.providers.HttpProvider(config.services.web3.provider))


module.exports = web3;
