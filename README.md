# Associator

Simple tool to sign the same random message with both an EVM and a Substrate address, proving simultaneous ownership of both.

## Todo

- for some reason fetch submits to server twice, find out why and fix
- add progress bar on entropy generation
- add nice error / success popups on server submission
- make prettier with some styling and layouts
- add input for API and API key so that users can plug in a third party server to register and persist this association
  - the POST request should include original message, pubkeys of both addresses, and both signed messages. Server should run a Verify on both before persisting
- deploy on decentralized storage

## Contributing

Please submit PRs to the repo https://github.com/swader/associator, there is only one rule: no build systems. This tool is designed to work as-is, no complications, no extra software, no tool kerfuffles. It is built to be easy to hack on, and easy to deploy and run anywhere.

## License

None, use as you see fit for whatever.