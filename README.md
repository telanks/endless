## 1.Suggestion to update the document content:
Doc link: https://docs.endless.link/endless/devbuild/build/endless-cli/install-the-endless-cli
Details: After installing the CLI of endless, it is recommended to add it to the local environment variables to avoid subsequent execution errors.

Doc link: https://docs.endless.link/endless/devbuild/build/tutorials/your-first-transaction
Details: The path ('cd examples/endless') in step two of the document is incorrect. The correct one should be: cd examples\typescript,

## 2.File 'your_fungible_asset.ts' :
Path: endless-ts-sdk\examples\typescript\your_fungible_asset.ts
Details:
1.Hide the import information in the fourth row
2.Since the command on line 48 needs to be executed locally, I encountered an error when running it here.
I have noted down the specific errors and their solutions in lines 44 to 47.

## 3.Add file 'simple_digital_asset.ts':
Path: examples/typescript/simple_digital_asset.ts
Details: The example provided in the document does not exist in the SDK. I added and implemented this example.
Doc link: https://docs.endless.link/endless/devbuild/build/tutorials/your-first-nft
Document revision suggestions: update 'cd examples/typescript-esm' to 'examples/typescript/'

## 4. Added 'simple_digital_asset.ts' execution script to the file : examples/typescript/package.json
