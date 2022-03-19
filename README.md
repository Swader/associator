# Associator

Simple tool to sign the same random message with both an EVM and a Substrate address, proving simultaneous ownership of both.

## Todo

- for some reason fetch submits to server twice, find out why and fix
- add progress bar on entropy generation
- add nice error / success popups on server submission
- make prettier with some styling and layouts
- ✅ ~~add input for API and API key so that users can plug in a third party server to register and persist this association~~
  - ✅ ~~the POST request should include original message, pubkeys of both addresses, and both signed messages. Server should run a Verify on both before persisting~~
- deploy on decentralized storage

## How to Use

### Signing

To test the Signing functionality, just run `index.html`, double click should work or in worst case a simple server like [http-server](https://www.npmjs.com/package/http-server). Nothing else needed.

### Verifying

This is an optional part of the app and serves as just a demo for how to verify the data. You can harvest it for your own use, or use it as is:

- install dependencies with `yarn install`
- run `node verify.js` with some input params. Example:
  ```
  node verify.js \
  entropy:243577494397221248 \  
  subSignature:0x92d558b3ebbe83c1b8ddd9b16ffc8f5135de0c93a0c1f50328210706d766396f5cc16a1eab622aa8ffbbe00cc82c3e12a160333f489db1376c03aca584661a8c \
  evmSignature:0x3cd024f2d900397da971ac55044b35a98ccff29bc81965ce9e6643fd4b3bdcc36557f21685cdc188e6c19126ec0a605b2f5463704f60ca6ba0c9b0632ab90e861c \
  evmAddress:0xB9b8EF61b7851276B0239757A039d54a23804CBb \
  subAddress:5CK8D1sKNwF473wbuBP6NuhQfPaWUetNsWUNAAzVwTfxqjfr
    ```

The output will be a simple `true` or `false`. It is then up to you to decide how to store this association.

## Contributing

Please submit PRs to the repo https://github.com/swader/associator, there is only one rule: no build systems. This tool is designed to work as-is, no complications, no extra software, no tool kerfuffles. It is built to be easy to hack on, and easy to deploy and run anywhere.

## License

None, use as you see fit for whatever.