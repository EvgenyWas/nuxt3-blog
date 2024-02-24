import { stringToBase64 } from '~/utils/converters';

export async function fileToDataURI(file: File) {
  const buffer = await file.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = stringToBase64(binary);

  return 'data:' + file.type + ';base64,' + base64;
}
