/* Example json produced by Associator */
/*
const json = {
  evmData: {
    signature:
      "0x3cd024f2d900397da971ac55044b35a98ccff29bc81965ce9e6643fd4b3bdcc36557f21685cdc188e6c19126ec0a605b2f5463704f60ca6ba0c9b0632ab90e861c",
    address: "0xB9b8EF61b7851276B0239757A039d54a23804CBb",
  },
  subData: {
    signature:
      "0x92d558b3ebbe83c1b8ddd9b16ffc8f5135de0c93a0c1f50328210706d766396f5cc16a1eab622aa8ffbbe00cc82c3e12a160333f489db1376c03aca584661a8c",
    address: "5CK8D1sKNwF473wbuBP6NuhQfPaWUetNsWUNAAzVwTfxqjfr",
  },
  entropy: "243577494397221248",
  server_key: "",
};

Run it like so: 

node verify.js \
entropy:243577494397221248 \
subSignature:0x92d558b3ebbe83c1b8ddd9b16ffc8f5135de0c93a0c1f50328210706d766396f5cc16a1eab622aa8ffbbe00cc82c3e12a160333f489db1376c03aca584661a8c \
evmSignature:0x3cd024f2d900397da971ac55044b35a98ccff29bc81965ce9e6643fd4b3bdcc36557f21685cdc188e6c19126ec0a605b2f5463704f60ca6ba0c9b0632ab90e861c \
evmAddress:0xB9b8EF61b7851276B0239757A039d54a23804CBb \
subAddress:5CK8D1sKNwF473wbuBP6NuhQfPaWUetNsWUNAAzVwTfxqjfr
*/

const ethers = require("./js/ethers-5.2.umd.min.js");

const {
  cryptoWaitReady,
  decodeAddress,
  signatureVerify,
} = require("@polkadot/util-crypto");
const { u8aToHex } = require("@polkadot/util");
const { evm } = require("@polkadot/types/interfaces/definitions");

const json = {
  evmData: {},
  subData: {},
};
let args = 0;
const argsNeeded = 5;

process.argv.slice(2).forEach(function (val, index, array) {
  let split = val.split(":");
  switch (split[0]) {
    case "evmSignature":
      json.evmData.signature = split[1];
      args++;
      break;
    case "evmAddress":
      json.evmData.address = split[1];
      args++;
      break;
    case "subSignature":
      json.subData.signature = split[1];
      args++;
      break;
    case "subAddress":
      json.subData.address = split[1];
      args++;
      break;
    case "entropy":
      json.entropy = split[1];
      args++;
      break;
    default:
      break;
  }
});
if (argsNeeded != args) {
  console.error(
    "Not enough valid arguments: pass in evmSignature, subSignature, evmAddress, subAddress, entropy"
  );
  process.exit(1);
}

const main = async () => {
  const evmTrue =
    ethers.utils.verifyMessage(json.entropy, json.evmData.signature) ==
    json.evmData.address;

  await cryptoWaitReady();

  const publicKey = decodeAddress(json.subData.address);
  const hexPublicKey = u8aToHex(publicKey);

  const subTrue = signatureVerify(
    json.entropy,
    json.subData.signature,
    hexPublicKey
  ).isValid;

  console.log(subTrue && evmTrue);
  process.exit(0);
};

main();
