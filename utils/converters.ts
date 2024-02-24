export function stringToBase64(value: string) {
  return Buffer.from(value).toString('base64');
}

export function base64ToString(value: string) {
  return Buffer.from(value, 'base64').toString();
}
