import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { envConfig } from 'src/common/config/env.config';
import {
  CreateBadgeDto,
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
      project: projectAddress,
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
      project: projectAddress.toString(),
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
        projectAddress: projectAddress,
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
