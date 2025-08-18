import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { envConfig } from 'src/common/config/env.config';
import {
  CreateBadgeDto,
  CreateProjectDto,
  CreateResourceDto,
  CreateResourceTreeDto,
} from './dto/create-resource.dto';
import { client } from 'src/common/config/honeycomb';
import {
  BadgesCondition,
  ResourceStorageEnum,
} from '@honeycomb-protocol/edge-client';
import * as web3 from '@solana/web3.js';
import { sendTransactions } from '@honeycomb-protocol/edge-client/client/helpers';
import bs58 from 'bs58';

const AUTH_PASSWORD = String(envConfig.AUTH_PASSWORD);
const projectAddress = String(envConfig.PROJECT_ADDRESS);
const adminPublicKey = String(envConfig.ADMIN_PUBLIC_KEY);
const PRIVATE_KEY = envConfig.PRIVATE_KEY;

@Injectable()
export class ResourcesService {
  // CREATE USER
  async createUser(body: CreateProjectDto): Promise<{ response: any }> {
    if (!PRIVATE_KEY) {
      throw new HttpException(
        'PRIVATE KEY ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const privateKeyBuffer = bs58.decode(PRIVATE_KEY);
    const signer = web3.Keypair.fromSecretKey(new Uint8Array(privateKeyBuffer));

    if (AUTH_PASSWORD !== body.authPass) {
      throw new HttpException(
        'Your are not authorized to perform this transaction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const { createNewUserTransaction: txResponse } =
      await client.createNewUserTransaction({
        wallet: signer.publicKey.toString(),
        info: {
          name: 'Rust Undead User',
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

    return {
      response: response[0].responses,
    };
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
}
