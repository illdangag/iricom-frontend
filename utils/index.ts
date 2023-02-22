import { TokenInfo, } from '../interfaces';

export class BrowserStorage {
  static TOKEN_INFO_KEY: string = 'tokenInfo';

  static clear (): void {
    localStorage.clear();
  }

  static getTokenInfo (): TokenInfo | null {
    const tokenInfoValue: string = localStorage.getItem(BrowserStorage.TOKEN_INFO_KEY);
    if (tokenInfoValue === null) {
      return null;
    } else {
      const tokenInfo: TokenInfo = JSON.parse(tokenInfoValue) as TokenInfo;
      tokenInfo.expiredDate = new Date(tokenInfo.expiredDate);
      return tokenInfo;
    }
  }

  static setTokenInfo (tokenInfo: TokenInfo): void {
    localStorage.setItem(BrowserStorage.TOKEN_INFO_KEY, JSON.stringify(tokenInfo));
  }
}

export function getTokenExpiredDate (token: string): Date {
  const encodedPayload: string = token.split('.')[1];
  const decodedPayload: string = Buffer.from(encodedPayload, 'base64').toString('utf8');
  const payload: any = JSON.parse(decodedPayload);
  return new Date(payload.exp * 1000);
}
