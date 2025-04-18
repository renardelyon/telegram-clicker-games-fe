import { Provider } from '@coral-xyz/anchor';
import { DEFAULT_COMMITMENT, DEFAULT_FINALITY, PumpFunCaller } from './pumpfun';
import { PublicKey } from '@metaplex-foundation/js';
import { PriorityFee } from './type';
import { Commitment, Finality, Keypair } from '@solana/web3.js';
import { sendTx } from './utils';

export class PumpfunDesktopCaller extends PumpFunCaller {
  constructor(provider?: Provider) {
    super(provider);
  }

  public async buy(
    buyer: Keypair,
    mint: PublicKey,
    buyAmountSol: bigint,
    slippageBasisPoints: bigint = 500n,
    priorityFees?: PriorityFee,
    commitment: Commitment = DEFAULT_COMMITMENT,
    finality: Finality = DEFAULT_FINALITY,
  ) {
    const buyTx = await super.getBuyInstructionsBySolAmount(
      buyer.publicKey,
      mint,
      buyAmountSol,
      slippageBasisPoints,
      commitment,
    );

    const buyResults = await sendTx(
      super.getConnection,
      buyTx,
      buyer.publicKey,
      [buyer],
      priorityFees,
      commitment,
      finality,
    );
    return buyResults;
  }
}
