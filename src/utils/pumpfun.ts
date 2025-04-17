import { BN, Program, Provider } from '@coral-xyz/anchor';
import { PumpFun, IDL } from '../idl/index';
import {
  Commitment,
  ComputeBudgetProgram,
  Connection,
  Finality,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import { BondingCurveAccount } from './bondingCurveAccount';
import { calculateWithSlippageBuy } from './utils';
import {
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { GlobalAccount } from './globalAccount';
import { PriorityFee } from './type';

export const DEFAULT_COMMITMENT: Commitment = 'finalized';
export const DEFAULT_FINALITY: Finality = 'finalized';

const PROGRAM_ID = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';

export const GLOBAL_ACCOUNT_SEED = 'global';
export const MINT_AUTHORITY_SEED = 'mint-authority';
export const BONDING_CURVE_SEED = 'bonding-curve';
export const METADATA_SEED = 'metadata';

export class PumpFunCaller {
  public program: Program<PumpFun>;
  public connection: Connection;
  constructor(provider?: Provider) {
    this.program = new Program<PumpFun>(IDL as PumpFun, provider);
    this.connection = this.program.provider.connection;
  }

  getBondingCurvePDA(mint: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(BONDING_CURVE_SEED), mint.toBuffer()],
      this.program.programId,
    )[0];
  }

  async getBondingCurveAccount(
    mint: PublicKey,
    commitment: Commitment = DEFAULT_COMMITMENT,
  ) {
    const tokenAccount = await this.connection.getAccountInfo(
      this.getBondingCurvePDA(mint),
      commitment,
    );
    if (!tokenAccount) {
      return null;
    }
    return BondingCurveAccount.fromBuffer(tokenAccount!.data);
  }

  async getGlobalAccount(commitment: Commitment = DEFAULT_COMMITMENT) {
    const [globalAccountPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from(GLOBAL_ACCOUNT_SEED)],
      new PublicKey(PROGRAM_ID),
    );

    const tokenAccount = await this.connection.getAccountInfo(
      globalAccountPDA,
      commitment,
    );

    return GlobalAccount.fromBuffer(tokenAccount!.data);
  }

  //buy
  async getBuyInstructions(
    buyer: PublicKey,
    mint: PublicKey,
    feeRecipient: PublicKey,
    amount: bigint,
    solAmount: bigint,
    commitment: Commitment = DEFAULT_COMMITMENT,
  ) {
    const associatedBondingCurve = await getAssociatedTokenAddress(
      mint,
      this.getBondingCurvePDA(mint),
      true,
    );

    const associatedUser = await getAssociatedTokenAddress(mint, buyer, false);

    const transaction = new Transaction();

    try {
      await getAccount(this.connection, associatedUser, commitment);
    } catch (e) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          buyer,
          associatedUser,
          buyer,
          mint,
        ),
      );
    }

    transaction.add(
      await this.program.methods
        .buy(new BN(amount.toString()), new BN(solAmount.toString()))
        .accounts({
          feeRecipient: feeRecipient,
          mint: mint,
          associatedBondingCurve: associatedBondingCurve,
          associatedUser: associatedUser,
          user: buyer,
        })
        .transaction(),
    );

    return transaction;
  }

  async getBuyInstructionsBySolAmount(
    buyer: PublicKey,
    mint: PublicKey,
    buyAmountSol: bigint,
    slippageBasisPoints: bigint = 500n,
    commitment: Commitment = DEFAULT_COMMITMENT,
  ) {
    const bondingCurveAccount = await this.getBondingCurveAccount(
      mint,
      commitment,
    );
    if (!bondingCurveAccount) {
      throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
    }

    const buyAmount = bondingCurveAccount.getBuyPrice(buyAmountSol);
    const buyAmountWithSlippage = calculateWithSlippageBuy(
      buyAmountSol,
      slippageBasisPoints,
    );

    const globalAccount = await this.getGlobalAccount(commitment);

    return await this.getBuyInstructions(
      buyer,
      mint,
      globalAccount.feeRecipient,
      buyAmount,
      buyAmountWithSlippage,
    );
  }

  async buy(
    buyer: PublicKey,
    mint: PublicKey,
    buyAmountSol: bigint,
    slippageBasisPoints: bigint = 500n,
    priorityFees?: PriorityFee,
    commitment: Commitment = DEFAULT_COMMITMENT,
  ) {
    const buyTx = await this.getBuyInstructionsBySolAmount(
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

    const blockHash = (await this.connection.getLatestBlockhash(commitment))
      .blockhash;
    newTx.recentBlockhash = blockHash;
    newTx.feePayer = buyer;

    return newTx;
  }
}
