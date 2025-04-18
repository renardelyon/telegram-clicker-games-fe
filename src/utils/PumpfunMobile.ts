import { Provider } from '@coral-xyz/anchor';
import { DEFAULT_COMMITMENT, PumpFunCaller } from './pumpfun';
import { PublicKey } from '@metaplex-foundation/js';
import { PriorityFee } from './type';
import { Commitment, ComputeBudgetProgram, Transaction } from '@solana/web3.js';

export class PumpfunMobileCaller extends PumpFunCaller {
  constructor(provider?: Provider) {
    super(provider);
  }

  public async buy(
    buyer: PublicKey,
    mint: PublicKey,
    buyAmountSol: bigint,
    slippageBasisPoints: bigint = 500n,
    priorityFees?: PriorityFee,
    commitment: Commitment = DEFAULT_COMMITMENT,
  ) {
    const buyTx = await super.getBuyInstructionsBySolAmount(
      buyer,
      mint,
      buyAmountSol,
      slippageBasisPoints,
      commitment,
    );

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

    newTx.add(buyTx);
    return newTx;
  }
}
