import nacl from 'tweetnacl';
import bs58 from 'bs58';
import base64 from 'base64-js';

export const decryptPayload = (
  data: string,
  nonce: string,
  sharedSecret: Uint8Array,
) => {
  const decryptedData = nacl.box.open.after(
    bs58.decode(data),
    bs58.decode(nonce),
    sharedSecret,
  );
  if (!decryptedData) {
    throw new Error('Unable to decrypt data');
  }
  return JSON.parse(Buffer.from(decryptedData).toString('utf8'));
};

export const isBase64 = (str: string) => {
  try {
    base64.toByteArray(str); // Decode test
    return true;
  } catch (e) {
    return false; // If decoding fails, it's not valid Base64
  }
};
