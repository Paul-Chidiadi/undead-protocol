import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { envConfig } from 'src/common/config/env.config';
import {
  CreateBadgeDto,
  CreateProfileDto,
  CreateProfileTreeDto,
  CreateProjectDto,
  CreateResourceDto,
  CreateResourceTreeDto,
  CreateUserDto,
  MintResourceDto,
  OnboardUserDto,
} from './dto/create-resource.dto';
import { client } from 'src/common/config/honeycomb';
import {
  BadgesCondition,
  ResourceStorageEnum,
  TransactionResponse,
} from '@honeycomb-protocol/edge-client';
import * as web3 from '@solana/web3.js';
import { sendTransactions } from '@honeycomb-protocol/edge-client/client/helpers';
import bs58 from 'bs58';

const AUTH_PASSWORD = String(envConfig.AUTH_PASSWORD);
const projectAddress = String(envConfig.PROJECT_ADDRESS);
const resourceAddress = String(envConfig.RESOURCE_ADDRESS);
const adminPublicKey = String(envConfig.ADMIN_PUBLIC_KEY);
const PRIVATE_KEY = envConfig.PRIVATE_KEY;

@Injectable()
export class ResourcesService {
  async getUser(address: string): Promise<any[]> {
    const usersArray = await client
      .findUsers({
        // All filters below are optional
        wallets: [address],
        addresses: [],
        ids: [],
        includeProof: true,
      })
      .then(({ user }) => user);

    return usersArray;
  }

  async getProfile(honeyAccountAddress: string): Promise<any[]> {
    const profilesArray = await client
      .findProfiles({
        userIds: [],
        projects: [],
        addresses: [honeyAccountAddress],
        identities: [],
        includeProof: true,
      })
      .then(({ profile }) => profile);

    return profilesArray;
  }

  // CREATE USER
  async createUser(
    body: CreateUserDto,
  ): Promise<{ message: string; userData: any[] }> {
    const existingUser = await this.getUser(body.walletAddress.toString());

    if (existingUser.length > 0) {
      return { message: 'user exists already', userData: existingUser };
    }

    if (!PRIVATE_KEY) {
      throw new HttpException(
        'PRIVATE KEY ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const privateKeyBuffer = bs58.decode(PRIVATE_KEY);
    const signer = web3.Keypair.fromSecretKey(new Uint8Array(privateKeyBuffer));

    const { createNewUserTransaction: txResponse } =
      await client.createNewUserTransaction({
        wallet: body.walletAddress.toString(),
        info: {
          name: body.name,
          pfp: 'https://sapphire-geographical-goat-695.mypinata.cloud/ipfs/bafybeiaacppmhed4zya5uwiv2nailjuqfiky767mlux5jxbjxuyow4mr54',
          bio: 'This is Rust undead user',
        },
        payer: signer.publicKey.toString(),
      });

    // Send the transaction
    const response = await sendTransactions(
      client,
      {
        transactions: [txResponse.transaction],
        blockhash: txResponse.blockhash,
        lastValidBlockHeight: txResponse.lastValidBlockHeight,
      },
      [signer],
    );

    const createdUser = await this.getUser(body.walletAddress.toString());
    return { message: 'user created', userData: createdUser };
  }

  // CREATE PROJECT
  async createProject(
    body: CreateProjectDto,
  ): Promise<{ projectAddress: string }> {
    if (AUTH_PASSWORD !== body.authPass) {
      throw new HttpException(
        'Your are not authorized to perform this transaction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!PRIVATE_KEY) {
      throw new HttpException(
        'PRIVATE KEY ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Create keypair from private key
    const privateKeyBuffer = bs58.decode(PRIVATE_KEY);
    const signer = web3.Keypair.fromSecretKey(new Uint8Array(privateKeyBuffer));

    const {
      createCreateProjectTransaction: {
        project: projectAddress,
        tx: txResponse,
      },
    } = await client.createCreateProjectTransaction({
      name: 'RUST UNDEAD',
      authority: signer.publicKey.toString(),
      payer: signer.publicKey.toString(),
      profileDataConfig: {
        achievements: [
          'First Genesis', // Created first warrior (started the game)
          'Battle Initiate', // Won first battle
          'Warrior Commander', // Created 5 battle rooms
          'Knowledge Seeker', // Completed first study phase
          'Battle Veteran', // Won 10 battles
          'Undead Legend', // Reached leaderboard top 10
          'Eternal Warrior', // Ultimate achievement (100+ battles won)
        ],
        customDataFields: [
          'Commander Rank', // Player progression level
          'Battle Experience', // XP points from battles
          'Victories Earned', // Total battles won
          'Warriors Created', // Number of minted warriors
          'Study Sessions', // Completed concept studies
          'Active Battle Days', // Days with battle activity
          'Current Warrior', // Currently selected warrior
          'Battle Equipment', // Warrior stats/abilities
          'Health Status', // Current warrior condition
          'Last Battle Time', // Most recent battle timestamp
          'Combat Hours', // Total time in battles
          'Warrior Class', // Validator/Oracle/Guardian/Daemon
        ],
      },
    });

    // Send the transaction
    const response = await sendTransactions(
      client,
      {
        transactions: [txResponse.transaction],
        blockhash: txResponse.blockhash,
        lastValidBlockHeight: txResponse.lastValidBlockHeight,
      },
      [signer],
    );

    return {
      projectAddress: projectAddress,
    };
  }

  // CREATE RESOURCE
  async createResource(
    createResource: CreateResourceDto,
  ): Promise<{ resourceAddress: string; signedTransaction: any }> {
    if (AUTH_PASSWORD !== createResource.authPass) {
      throw new HttpException(
        'Your are not authorized to perform this transaction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!PRIVATE_KEY) {
      throw new HttpException(
        'PRIVATE KEY ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Create keypair from private key
    const privateKeyBuffer = bs58.decode(PRIVATE_KEY);
    const signer = web3.Keypair.fromSecretKey(new Uint8Array(privateKeyBuffer));

    const {
      createCreateNewResourceTransaction: {
        resource: resourceAddress,
        tx: txResponse,
      },
    } = await client.createCreateNewResourceTransaction({
      project: createResource.projectAddress,
      authority: signer.publicKey.toString(),
      payer: signer.publicKey.toString(),

      params: {
        name: createResource.resourceName,
        decimals: createResource.resourceDecimal,
        symbol: createResource.resourceSymbol,
        uri: createResource.uri,
        storage: ResourceStorageEnum.LedgerState,
        tags: createResource.tags,
      },
    });

    // Send the transaction
    const responseData = await sendTransactions(
      client,
      {
        transactions: [txResponse.transaction],
        blockhash: txResponse.blockhash,
        lastValidBlockHeight: txResponse.lastValidBlockHeight,
      },
      [signer],
    );

    return {
      resourceAddress: resourceAddress,
      signedTransaction: responseData,
    };
  }

  // CREATE RESOURCE TREE
  async createResourceTree(
    body: CreateResourceTreeDto,
  ): Promise<{ merkleTreeAddress: string; signedTransaction: any }> {
    if (AUTH_PASSWORD !== body.authPass) {
      throw new HttpException(
        'Your are not authorized to perform this transaction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!PRIVATE_KEY) {
      throw new HttpException(
        'PRIVATE KEY ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // Create keypair from private key
    const privateKeyBuffer = bs58.decode(PRIVATE_KEY);
    const signer = web3.Keypair.fromSecretKey(new Uint8Array(privateKeyBuffer));

    const {
      createCreateNewResourceTreeTransaction: {
        treeAddress: merkleTreeAddress,
        tx: txResponse,
      },
    } = await client.createCreateNewResourceTreeTransaction({
      project: body.projectAddress,
      authority: signer.publicKey.toString(),
      payer: signer.publicKey.toString(),

      resource: body.resourceAddress.toString(),
      treeConfig: {
        basic: {
          numAssets: 100000,
        },
        // Uncomment the following config if you want to configure your own profile tree (also comment out the above config)
        // advanced: {
        //   maxDepth: 20,
        //   maxBufferSize: 64,
        //   canopyDepth: 14,
        // }
      },
    });

    // Send the transaction
    const responseData = await sendTransactions(
      client,
      {
        transactions: [txResponse.transaction],
        blockhash: txResponse.blockhash,
        lastValidBlockHeight: txResponse.lastValidBlockHeight,
      },
      [signer],
    );

    return {
      merkleTreeAddress: merkleTreeAddress,
      signedTransaction: responseData,
    };
  }

  // CREATE RESOURCE TREE
  async mintResource(
    body: MintResourceDto,
  ): Promise<{ response: TransactionResponse[] }> {
    if (!PRIVATE_KEY) {
      throw new HttpException(
        'PRIVATE KEY ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Create keypair from private key
    const privateKeyBuffer = bs58.decode(PRIVATE_KEY);
    const signer = web3.Keypair.fromSecretKey(new Uint8Array(privateKeyBuffer));

    const { createMintResourceTransaction: txResponse } =
      await client.createMintResourceTransaction({
        resource: resourceAddress.toString(),
        amount: body.amount.toString(),
        authority: adminPublicKey.toString(),
        owner: body.walletAddress.toString(),
        payer: adminPublicKey.toString(),
      });

    // Send the transaction
    const response = await sendTransactions(
      client,
      {
        transactions: [txResponse.transaction],
        blockhash: txResponse.blockhash,
        lastValidBlockHeight: txResponse.lastValidBlockHeight,
      },
      [signer],
    );

    return {
      response: response[0].responses,
    };
  }

  // CREATE BADGE
  async createBadge(body: CreateBadgeDto): Promise<{
    blockhash: any;
    lastValidBlockHeight: any;
    transaction: any;
  }> {
    if (AUTH_PASSWORD !== body.authPass) {
      throw new HttpException(
        'Your are not authorized to perform this transaction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!PRIVATE_KEY) {
      throw new HttpException(
        'PRIVATE KEY ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Create keypair from private key
    const privateKeyBuffer = bs58.decode(PRIVATE_KEY);
    const signer = web3.Keypair.fromSecretKey(new Uint8Array(privateKeyBuffer));

    const {
      createUpdateBadgeCriteriaTransaction: {
        blockhash,
        lastValidBlockHeight,
        transaction,
      },
    } = await client.createUpdateBadgeCriteriaTransaction({
      args: {
        authority: signer.publicKey.toString(),
        projectAddress: body.projectAddress,
        payer: signer.publicKey.toString(),
        criteriaIndex: 0,
        condition: BadgesCondition.Public,
        startTime: 0,
        endTime: 0,
      },
    });

    return {
      blockhash,
      lastValidBlockHeight,
      transaction,
    };
  }

  // CREATE PROFILE TREE
  async createProfileTree(body: CreateProfileTreeDto): Promise<{
    response: TransactionResponse[];
  }> {
    if (AUTH_PASSWORD !== body.authPass) {
      throw new HttpException(
        'Your are not authorized to perform this transaction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!PRIVATE_KEY) {
      throw new HttpException(
        'PRIVATE KEY ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Create keypair from private key
    const privateKeyBuffer = bs58.decode(PRIVATE_KEY);
    const signer = web3.Keypair.fromSecretKey(new Uint8Array(privateKeyBuffer));

    const { createCreateProfilesTreeTransaction: txResponse } =
      await client.createCreateProfilesTreeTransaction({
        payer: adminPublicKey.toString(),
        project: projectAddress.toString(),
        treeConfig: {
          basic: {
            numAssets: 100000,
          },
          // Uncomment the following config if you want to configure your own profile tree (also comment out the above config)
          // advanced: {
          //   maxDepth: 20,
          //   maxBufferSize: 64,
          //   canopyDepth: 14,
          // }
        },
      });

    // Send the transaction
    const response = await sendTransactions(
      client,
      {
        transactions: [txResponse.tx.transaction],
        blockhash: txResponse.tx.blockhash,
        lastValidBlockHeight: txResponse.tx.lastValidBlockHeight,
      },
      [signer],
    );

    return {
      response: response[0].responses,
    };
  }

  // CREATE PROFILE
  async createProfile(body: CreateProfileDto): Promise<{
    response: TransactionResponse[];
  }> {
    if (!PRIVATE_KEY) {
      throw new HttpException(
        'PRIVATE KEY ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Create keypair from private key
    const privateKeyBuffer = bs58.decode(PRIVATE_KEY);
    const signer = web3.Keypair.fromSecretKey(new Uint8Array(privateKeyBuffer));

    const { createNewProfileTransaction: txResponse } =
      await client.createNewProfileTransaction(
        {
          project: projectAddress.toString(),
          payer: body.walletAddress.toString(),
          identity: 'main',
          // info: {
          //   // Optional, profile information, all values in the object are optional
          //   bio: 'My name is John Doe',
          //   name: 'John Doe',
          //   pfp: 'link-to-pfp',
          // },
        },
        {
          fetchOptions: {
            headers: {
              authorization: `Bearer ${body.accessToken}`,
            },
          },
        },
      );

    // Send the transaction
    const response = await sendTransactions(
      client,
      {
        transactions: [txResponse.transaction],
        blockhash: txResponse.blockhash,
        lastValidBlockHeight: txResponse.lastValidBlockHeight,
      },
      [signer],
    );

    return {
      response: response[0].responses,
    };
  }

  //AUTHENTICATE USER  ------- This functionality has been moved to the CLIENT SIDE
  async authenticateUser(userPublicKey: string) {
    const {
      authRequest: { message: authRequest },
    } = await client.authRequest({
      wallet: userPublicKey.toString(),
    });

    // // Define a signMessage function
    // const signAuthRequest = (authRequest: string, keypair: web3.Keypair) => {
    //   const messageBytes = new TextEncoder().encode(authRequest);
    //   const signatureBytes = nacl.sign.detached(
    //     messageBytes,
    //     keypair.secretKey,
    //   );
    //   return bs58.encode(signatureBytes);
    // };

    // // Sign the message
    // const signature = signAuthRequest(authRequest, userKeypair);
    // // Send the signed message to the server
    // const { authConfirm } = await client.authConfirm({
    //   wallet: userPublicKey.toString(),
    //   signature,
    // });
  }

  async onboardUser(
    body: OnboardUserDto,
  ): Promise<{ userData: any; profileData: any }> {
    const { walletAddress, accessToken, name } = body;
    const userData = await this.createUser({ walletAddress, name });

    //CHECK IF USER HAS PROFILE ALREADY
    const existingProfileData = await this.getProfile(
      userData[0].address.toString(),
    );
    if (existingProfileData) {
      return { userData, profileData: existingProfileData };
    } else {
      const createProfile = await this.createProfile({
        walletAddress,
        accessToken,
      });

      const profileData = await this.getProfile(userData[0].address.toString());
      return { userData, profileData };
    }
  }
}
