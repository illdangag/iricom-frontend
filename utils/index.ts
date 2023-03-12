import { TokenInfo, } from '../interfaces';

export class BrowserStorage {
  static TOKEN_INFO_KEY: string = 'tokenInfo';

  static clear (): void {
    localStorage.removeItem(this.TOKEN_INFO_KEY);
  }

  static getTokenInfo (): TokenInfo | null {
    const tokenInfoValue: string = localStorage.getItem(this.TOKEN_INFO_KEY);
    if (tokenInfoValue === null) {
      return null;
    } else {
      const tokenInfo: TokenInfo = JSON.parse(tokenInfoValue) as TokenInfo;
      tokenInfo.expiredDate = new Date(tokenInfo.expiredDate);
      return tokenInfo;
    }
  }

  static setTokenInfo (tokenInfo: TokenInfo): void {
    localStorage.setItem(this.TOKEN_INFO_KEY, JSON.stringify(tokenInfo));
  }
}

export function getTokenExpiredDate (token: string): Date {
  const encodedPayload: string = token.split('.')[1];
  const decodedPayload: string = Buffer.from(encodedPayload, 'base64').toString('utf8');
  const payload: any = JSON.parse(decodedPayload);
  return new Date(payload.exp * 1000);
}

export function getFormattedDateTime (time: number): string {
  const targetDate: Date = new Date(time);
  const year: number = targetDate.getFullYear();
  const month: number = targetDate.getMonth() + 1;
  const date: number = targetDate.getDate();
  let hour: number = targetDate.getHours();
  const minute: number = targetDate.getMinutes();

  return `${year}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date} ${hour >= 10 ? hour : '0' + hour}:${minute}`;
}
