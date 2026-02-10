# Submit Info

## 1.Suggestion to update the document content:

Doc link: https://docs.endless.link/endless/devbuild/build/endless-cli/install-the-endless-cli.  
Details: After installing the CLI of endless, it is recommended to add it to the local environment variables to avoid subsequent execution errors.  
Doc link: https://docs.endless.link/endless/devbuild/build/tutorials/your-first-transaction.  
Details: The path ('cd examples/endless') in step two of the document is incorrect. The correct one should be: cd examples\typescript.

---

## 2.File 'your_fungible_asset.ts' :

Path: endless-ts-sdk\examples\typescript\your_fungible_asset.ts  
Details:  
1.Hide the import information in the fourth row.  
2.Since the command on line 48 needs to be executed locally, I encountered an error when running it here.I have noted down the specific errors and their solutions in lines 44 to 47.

---

## 3.Add file 'simple_digital_asset.ts':

Path: examples/typescript/simple_digital_asset.ts.  
Details: The example provided in the document does not exist in the SDK. I added and implemented this example.  
Doc link: https://docs.endless.link/endless/devbuild/build/tutorials/your-first-nft.  
Document revision suggestions: update 'cd examples/typescript-esm' to 'examples/typescript/'.

---

## 4. Add 'simple_digital_asset.ts' execution script to the file : examples/typescript/package.json.

### Sample execution result :

` === Addresses ===

Alice's address is: 0xb25b18556473411a7d664ed2cba0a11b8515006b541b3342b4156130d674c7f7

=== Creating Collection and Token ===

Alice's collection: {  
 "id": "FimVWjZtfxHtGHpymUc2uVsZwaYs8cs7rC2NhyZ1M4QM",  
 "creator": "D1E8qa8FPWEu9R8jiE2mpnHwjzqmbUou4ugeNWwM7TtJ",  
 "description": "This is Alice's simple collection",  
 "name": "Alice's simple collection",  
 "uri": "https://endless.dev",  
 "current_supply": 0,  
 "total_minted": 0,  
 "max_supply": null,  
 "royalty": {  
 "percent": "0.00",  
 "payee_address": "D1E8qa8FPWEu9R8jiE2mpnHwjzqmbUou4ugeNWwM7TtJ"  
 },
"last_transaction_version": 354098812,  
 "last_transaction_hash": "3ivXQjekmdUmZjxdpvFdSc8xtBiTa5L8fANJ7CmUgE5Y",  
 "holders": "0",  
 "created_at": 1770709254,  
 "transfers": "0"  
}

=== Alice Mints the digital asset ===

Alice's digital assets balance: 1
Alice's digital asset: {
"id": "EW3DhvRMy7svS2qLqnv375foXBm4Xdys3X9A5FdGCYzv",
"name": "Example Asset",
"index": 1,
"collection": {
"id": "FimVWjZtfxHtGHpymUc2uVsZwaYs8cs7rC2NhyZ1M4QM",
"creator": "D1E8qa8FPWEu9R8jiE2mpnHwjzqmbUou4ugeNWwM7TtJ",
"description": "This is Alice's simple collection",
"name": "Alice's simple collection",
"uri": "https://endless.dev",
"current_supply": 1,
"total_minted": 1,
"max_supply": null,
"royalty": {
"percent": "0.00",
"payee_address": "D1E8qa8FPWEu9R8jiE2mpnHwjzqmbUou4ugeNWwM7TtJ"
},
"last_transaction_version": 354098851,
"last_transaction_hash": "CsyekgVMX1o4QkCpCPKLdnurqUSWRPaEbwvjN6x9Fa7t",
"holders": "1",
"created_at": 1770709254,
"transfers": "1"
},
"description": "This is Alice's simple collection",
"uri": "endless.dev/asset",
"owner": "D1E8qa8FPWEu9R8jiE2mpnHwjzqmbUou4ugeNWwM7TtJ",
"properties": {},
"last_transaction_version": 354098851,
"last_transaction_hash": "CsyekgVMX1o4QkCpCPKLdnurqUSWRPaEbwvjN6x9Fa7t"
}

=== Transfer the digital asset to Bob ===

Alice's digital assets balance: 0
Bob's digital assets balance: 1 `
