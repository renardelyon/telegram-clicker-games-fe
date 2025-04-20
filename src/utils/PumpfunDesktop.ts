import { Provider } from '@coral-xyz/anchor';
import { DEFAULT_COMMITMENT, DEFAULT_FINALITY, PumpFunCaller } from './pumpfun';
import { PublicKey } from '@metaplex-foundation/js';
import { PriorityFee, TransactionResult } from './type';
import {
  Commitment,
  ComputeBudgetProgram,
  Connection,
  Finality,
  SendTransactionError,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js';
import { buildVersionedTx, getTxDetails } from './utils';

export class PumpfunDesktopCaller extends PumpFunCaller {
  constructor(provider?: Provider) {
    super(provider);
  }

  public async buy(
    buyer: PublicKey,
    mint: PublicKey,
    buyAmountSol: bigint,
    slippageBasisPoints: bigint = 500n,
    signTransaction: <T extends Transaction | VersionedTransaction>(
      transaction: T,
    ) => Promise<T>,
    priorityFees?: PriorityFee,
    commitment: Commitment = DEFAULT_COMMITMENT,
    finality: Finality = DEFAULT_FINALITY,
  ) {
    const buyTx = await super.getBuyInstructionsBySolAmount(
      buyer,
      mint,
      buyAmountSol,
      slippageBasisPoints,
      commitment,
    );

    const buyResults = await this.sendTx(
      super.getConnection,
      buyTx,
      buyer,
      signTransaction,
      priorityFees,
      commitment,
      finality,
    );
    return buyResults;
  }

  private async sendTx(
    connection: Connection,
    tx: Transaction,
    payer: PublicKey,
    signTransaction: <T extends Transaction | VersionedTransaction>(
      transaction: T,
    ) => Promise<T>,
    priorityFees?: PriorityFee,
    commitment: Commitment = DEFAULT_COMMITMENT,
    finality: Finality = DEFAULT_FINALITY,
  ): Promise<TransactionResult> {
    const newTx = new Transaction();

    if (priorityFees) {
      const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: priorityFees.unitLimit,
      });

      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: priorityFees.unitPrice,
      });
      newTx.add(modifyComputeUnits);
      newTx.add(addPriorityFee);
    }

    newTx.add(tx);

    const versionedTx = await buildVersionedTx(
      connection,
      payer,
      newTx,
      commitment,
    );
    const signedVersionedTx = await signTransaction(versionedTx);

    try {
      const sig = await connection.sendTransaction(signedVersionedTx, {
        skipPreflight: false,
      });
      console.log('sig:', `https://solscan.io/tx/${sig}`);

      const txResult = await getTxDetails(
        connection,
        sig,
        commitment,
        finality,
      );
      if (!txResult) {
        return {
          success: false,
          error: 'Transaction failed',
        };
      }
      return {
        success: true,
        signature: sig,
        results: txResult,
      };
    } catch (e) {
      if (e instanceof SendTransactionError) {
        const ste = e as SendTransactionError;
        console.log('SendTransactionError' + (await ste.getLogs(connection)));
      } else {
        console.error(e);
      }
      return {
        error: e,
        success: false,
      };
    }
  }
}
