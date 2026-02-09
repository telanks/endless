import { Account, AccountAddress,NetworkToNetworkName, Endless, EndlessConfig, Ed25519PrivateKey, Network } from "../../dist/common/index";
import axios from 'axios';

//  const ENDLESS_NETWORK: Network = NetworkToNetworkName[Network.TESTNET] || Network.DEVNET;
//  const config = new EndlessConfig({ network: ENDLESS_NETWORK });

const config = new EndlessConfig({ 
  network: Network.LOCAL, 
  fullnode: "http://127.0.0.1:8080", 
  indexer: " http://127.0.0.1:50051" 
});
 const endless = new Endless(config);

console.log("Endless network:",config );



async function main() { 

    // Create two accounts
    const alice = Account.generate();
    const bob = Account.generate();

    console.log("=== Addresses ===\n");
    console.log(`Alice's address is: ${alice.accountAddress}`);
    //console.log(`Bob's address is: ${bob.accountAddress}`);

      // Fund alice account
    const fund_alice_tx = await endless.fundAccount({ signer: alice });
    await endless.waitForTransaction({ transactionHash: fund_alice_tx.hash });

      // Fund bob account
    const fund_bob_tx = await endless.fundAccount({ signer: bob });
    await endless.waitForTransaction({ transactionHash: fund_bob_tx.hash });

    // console.log("\n=== Initial Balances ===\n");
    // const ALICE_INITIAL_BALANCE = await endless.viewEDSBalance(alice.accountAddress);
    // const BOB_INITIAL_BALANCE = await endless.viewEDSBalance(bob.accountAddress);
    // console.log(`Alice: ${ALICE_INITIAL_BALANCE}`);
    // console.log(`Bob: ${BOB_INITIAL_BALANCE}`);

    console.log("\n=== Creating Collection and Token ===\n");

    const collectionName = "Alice's simple collection";

    const collectionDescription = "This is Alice's simple collection";

    const tokenURI = "https://endless.dev";

    const createCollectionTransaction = await endless.createCollectionTransaction({
      creator: alice,
      description: collectionDescription,
      name: collectionName,
      uri: tokenURI,
    });

    const committedTxn = await endless.signAndSubmitTransaction({
      signer: alice,
      transaction: createCollectionTransaction,
    });

    // Wait for transaction to be confirmed before querying
    await endless.waitForTransaction({ transactionHash: committedTxn.hash });

    // Try to get collection data with proper error handling

    // const collectionDataOptions = {
    //   method: 'GET',
    //   url: 'https://idx-test.endless.link/api/v1/accounts/'+alice.accountAddress+'/collections?name='+collectionName
    // };
    
    // try {
    //   const { data } = await axios.request(collectionDataOptions);
    //   console.log("Collection data:", data);
    // } catch (error) {
    //   console.error(error);
    // }

    try {
      const collectionId = await endless.getCollectionId({creatorAddress:alice.accountAddress, collectionName:collectionName})

      //const collectionData = await endless.getCollectionData({creatorAddress:alice.accountAddress, collectionName:collectionName});
      const collectionData = await endless.getCollectionDataByCollectionId({collectionId:collectionId});
      console.log("Collection data:", collectionData);
    } catch (error) {
      console.error("Could not fetch collection data:", error);
    }

    console.log("\n=== Alice Mints the digital asset ===\n");

    const mintTokenTransaction = await endless.mintDigitalAssetTransaction({
      creator: alice,
      collection: collectionName,
      description: collectionDescription,
      name: "Example Asset",
      uri: tokenURI,
    });
    
    const mintTokenCommittedTxn = await endless.signAndSubmitTransaction({
      signer: alice,
      transaction: mintTokenTransaction,
    });

    // Wait for transaction to be confirmed before querying
    await endless.waitForTransaction({ transactionHash: mintTokenCommittedTxn.hash });

    let aliceDigitalAssets = await endless.getOwnedDigitalAssets({ownerAddress:alice.accountAddress})
    

    // const aliceDigitalAssetsOptions = {method: 'GET', url: 'https://idx-test.endless.link/api/v1/nfts/'+alice.accountAddress};

    // try {
    //   const { data } = await axios.request(aliceDigitalAssetsOptions);
    //   //aliceDigitalAssets = data.total;
    //   //console.log("Alice's digital assets balance: ",data.total);

    //   console.log("Alice's digital asset: ",data);

    // } catch (error) {
    //   console.error(error);
    // }

    console.log("Alice's digital assets balance: ",aliceDigitalAssets.length);

    //Only attempt to get digital asset data if Alice has digital assets
    if (aliceDigitalAssets.length > 0) {
      try {
        // Get the first digital asset from Alice's collection
        const firstDigitalAsset = aliceDigitalAssets[0];
        const digitalAssetData = await endless.getDigitalAssetData({digitalAssetAddress:firstDigitalAsset.current_token_data?.token_data_id || firstDigitalAsset.token_data_id})
        console.log("Alice's digital asset: ",digitalAssetData);
      } catch (error) {
        console.error("Could not fetch digital asset data:", error);
      }
    }

    console.log("\nTransfer the digital asset to Bob\n");

    // Only transfer if Alice has digital assets
    if (aliceDigitalAssets.length > 0) {
      const firstDigitalAsset = aliceDigitalAssets[0];
      const transferTransaction = await endless.transferDigitalAssetTransaction({
        sender: alice,
        digitalAssetAddress: firstDigitalAsset.token_data_id || firstDigitalAsset.current_token_data?.token_data_id,
        recipient: bob.accountAddress,
      });

      const transferResult = await endless.signAndSubmitTransaction({
        signer: alice,
        transaction: transferTransaction,
      });

      await endless.waitForTransaction({ transactionHash: transferResult.hash });

      aliceDigitalAssets = await endless.getOwnedDigitalAssets({ownerAddress:alice.accountAddress})
      
      console.log("Alice's digital assets balance: ",aliceDigitalAssets.length);

      const bobDigitalAssets = await endless.getOwnedDigitalAssets({ownerAddress:bob.accountAddress})

      console.log("Bob's digital assets balance: ", bobDigitalAssets.length);
    } else {
      console.log("Alice has no digital assets to transfer");
    }


}

main();