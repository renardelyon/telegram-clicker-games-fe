// Your IDL (simplified version with only the 'buy' instruction)
export type TPumpIdl = {
  version: '0.1.0';
  name: 'pumpfun';
  instructions: [
    {
      name: 'buy';
      accounts: [
        { name: 'global'; isMut: false; isSigner: false },
        { name: 'feeRecipient'; isMut: true; isSigner: false },
        { name: 'mint'; isMut: false; isSigner: false },
        { name: 'bondingCurve'; isMut: true; isSigner: false },
        { name: 'associatedBondingCurve'; isMut: true; isSigner: false },
        { name: 'associatedUser'; isMut: true; isSigner: false },
        { name: 'user'; isMut: true; isSigner: true },
        { name: 'systemProgram'; isMut: false; isSigner: false },
        { name: 'tokenProgram'; isMut: false; isSigner: false },
        { name: 'rent'; isMut: false; isSigner: false },
        { name: 'eventAuthority'; isMut: false; isSigner: false },
        { name: 'program'; isMut: false; isSigner: false },
      ];
      args: [
        { name: 'amount'; type: 'u64' },
        { name: 'maxSolCost'; type: 'u64' },
      ];
    },
  ];
};
