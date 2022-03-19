const entropy = [];
let entropyString = "";
let captureStart = false;

let evmData = {};
let subData = {};

const area = document.getElementById("area");
area.addEventListener("mousemove", function (e) {
  const MAX_LEN = 64;
  if (entropy.length >= MAX_LEN) return;
  const now = Date.now();
  if (now >= 1 && now % 10 !== 0) return;
  if (!captureStart) {
    return setTimeout(() => {
      captureStart = true;
    }, 1000);
  }
  const iwPlusIh = parseInt(area.style.width) + parseInt(area.style.height);
  const pxPlusPy = e.pageX + e.pageY;
  const ret = Math.round((pxPlusPy / iwPlusIh) * 255);
  entropy.push(ret);
  //console.log("0-255:", ret);
  if (entropy.length >= MAX_LEN) {
    //console.log("entropy:", entropy);
    console.log(
      "shuffledEntropy:",
      entropy.sort(() => Math.random() - 0.5)
    );

    entropyString = entropy.join().replace(/,/g, "");
    console.log(entropyString);
    document.querySelector("#payloadEntropy").textContent = entropyString;

    // Make buttons visible
    document.querySelector("#area").remove();
    document.querySelector("#hello").remove();
    document.querySelector("#signing").style.display = "block";

    document.querySelector("#evmSign").addEventListener("click", signWithEvm);
    document.querySelector("#subSign").addEventListener("click", signWithSub);
  }
});

async function signWithEvm(e) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const signature = await signer.signMessage(entropyString);
  const address = await signer.getAddress();

  document.querySelector("#evmSign").remove();

  document.querySelector("#evmOutput").style.display = "block";
  document.querySelector("#evmOutput .signature").textContent = signature;
  document.querySelector("#evmOutput .address").textContent = address;

  document.querySelector("#payloadEvmSig").textContent = signature;
  document.querySelector("#payloadEvmAddress").textContent = signature;

  evmData = {
    signature: signature,
    address: address,
  };

  activateSubmission();
}

async function signWithSub(e) {
  const { web3Accounts, web3Enable, web3FromSource } = polkadotExtensionDapp;
  const { stringToHex } = polkadotUtil;

  let addressDropdown = document.querySelector("#subAddress");
  addressDropdown.style.display = "inline-block";
  let options = "<option value='discard'>Pick an account</option>";

  web3Enable("Associator")
    .then(() => {
      return web3Accounts();
    })
    .then(async (accounts) => {
      console.log(accounts);

      // Make user select an account
      for (let i = 0; i < accounts.length; i++) {
        options += `<option value='${i}'>${accounts[i].address}</option>`;
      }

      addressDropdown.innerHTML = options;
      addressDropdown.addEventListener("change", async () => {
        if (addressDropdown.value === "discard") {
          return false;
        }
        const account = accounts[addressDropdown.value];
        const injector = await web3FromSource(account.meta.source);
        const signRaw = injector?.signer?.signRaw;

        if (!!signRaw) {
          const { signature } = await signRaw({
            address: account.address,
            data: stringToHex(entropyString),
            type: "bytes",
          });

          document.querySelector("#subSign").remove();
          addressDropdown.remove();

          document.querySelector("#subOutput").style.display = "block";
          document.querySelector("#subOutput .signature").textContent =
            signature;
          document.querySelector("#subOutput .address").textContent =
            account.address;

          document.querySelector("#payloadSubSig").textContent = signature;
          document.querySelector("#payloadSubAddress").textContent =
            account.address;

          subData = {
            signature: signature,
            address: account.address,
          };

          activateSubmission();
        }
      });
    });
}

async function activateSubmission() {
  if (subData.signature !== undefined && evmData.signature !== undefined) {
    document.querySelector("#submission").style.display = "block";
  }
  const form = document.querySelector("#submitform");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const server_url = document.querySelector("#server_url").value;
    const server_key = document.querySelector("#server_key").value;

    document.querySelector("#payloadServerKey").textContent = server_key;

    const data = {
      evmData: evmData,
      subData: subData,
      entropy: entropyString,
      server_key: server_key,
    };

    fetch(server_url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    return false;
  });
}
