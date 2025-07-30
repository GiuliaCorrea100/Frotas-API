import * as crypto from 'crypto';

export function md5(textoClaro: string): string {
  return crypto.createHash('md5').update(textoClaro).digest('hex');
}
