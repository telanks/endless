import { Account, AccountAddress,NetworkToNetworkName, Endless, EndlessConfig, Ed25519PrivateKey, Network } from "../../dist/common/index";
import axios from 'axios';

 const ENDLESS_NETWORK: Network = NetworkToNetworkName[Network.TESTNET] || Network.DEVNET;
 const config = new EndlessConfig({ 
  network: ENDLESS_NETWORK,
  fullnode: "https://rpc-test.endless.link/v1",
  indexer: "https://idx-test.endless.link/v1",
});

 const endless = new Endless(config);

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function getDigitalAssets(accountAddress: AccountAddress, nftName: string) {
  const digitalAssetsOptions = {
    method: 'GET',
    url: 'https://idx-test.endless.link/api/v1/accounts/'+accountAddress+'/nfts?nft='+nftName
  };
  
  // let aliceDigitalAssetsTotal = 0;
  // let aliceDigitalAssets;

  try {
    const { data } = await axios.request(digitalAssetsOptions);
    return data;
    // aliceDigitalAssetsTotal = data.total;
    // aliceDigitalAssets = data.data[0];
    // console.log("Alice's digital assets balance: ",aliceDigitalAssetsTotal);
    // console.log("Alice's digital asset:",JSON.stringify(aliceDigitalAssets, null, 2));
  } catch (error) {
    console.error(error);
  }
}

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
    
    // Wait for 5 seconds to ensure the transaction is completely on the chain.
    await sleep(5000);

    // Try to get collection data with proper error handling

    const collectionDataOptions = {
      method: 'GET',
      url: 'https://idx-test.endless.link/api/v1/accounts/'+alice.accountAddress+'/collections?name='+collectionName
    };
    
    let aliceCollectionData: any[] = [];

    try {
      const { data } = await axios.request(collectionDataOptions);
      aliceCollectionData = data.data[0];
      console.log("Alice's collection:", JSON.stringify(aliceCollectionData, null, 2));
    } catch (error) {
      console.error(error);
    }


    console.log("\n=== Alice Mints the digital asset ===\n");

    const nftName = 'Example Asset';

    const mintTokenTransaction = await endless.mintDigitalAssetTransaction({
      creator: alice,
      collection: collectionName,
      description: collectionDescription,
      name: nftName,
      uri: 'endless.dev/asset',
    });
    
    const mintTokenCommittedTxn = await endless.signAndSubmitTransaction({
      signer: alice,
      transaction: mintTokenTransaction,
    });

    // Wait for transaction to be confirmed before querying
    await endless.waitForTransaction({ transactionHash: mintTokenCommittedTxn.hash });
    
    // Wait for 5 seconds to ensure the transaction is completely on the chain.
    await sleep(5000);

    
    let aliceDigitalAssetsData = await getDigitalAssets(alice.accountAddress,nftName);

    let aliceDigitalAssetsTotal = aliceDigitalAssetsData.total;
    let aliceDigitalAssets = aliceDigitalAssetsData.data[0];
    console.log("Alice's digital assets balance: ",aliceDigitalAssetsTotal);
    console.log("Alice's digital asset:",JSON.stringify(aliceDigitalAssets, null, 2));

    console.log("\n=== Transfer the digital asset to Bob ===\n");

    //Only transfer if Alice has digital assets
    const transferTransaction = await endless.transferDigitalAssetTransaction({
      sender: alice,
      digitalAssetAddress: aliceDigitalAssets.id,
      recipient: bob.accountAddress,
    });

    const transferResult = await endless.signAndSubmitTransaction({
      signer: alice,
      transaction: transferTransaction,
    });

    await endless.waitForTransaction({ transactionHash: transferResult.hash });

    await sleep(10000);

    aliceDigitalAssetsData = await getDigitalAssets(alice.accountAddress,nftName);

    console.log("Alice's digital assets balance: ",aliceDigitalAssetsData.total);

    let bobDigitalAssetsData =  await getDigitalAssets(bob.accountAddress,nftName);

    console.log("Bob's digital assets balance: ", bobDigitalAssetsData.total);

}

main();