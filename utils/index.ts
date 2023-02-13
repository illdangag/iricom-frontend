import { Account, } from '../interfaces';

export class BrowserStorage {
  static clear (): void {
    localStorage.clear();
  }

  static getAccount (): Account | null {
    const accountValue = localStorage.getItem('account');
    if (accountValue === null) {
      return null;
    } else {
      debugger;
      const account: Account = JSON.parse(accountValue) as Account;

      const now: Date = new Date();
      const expiredDate: Date = getTokenExpiredDate(account.token);

      if (now.getTime() > expiredDate.getTime()) {
        localStorage.removeItem('account');
        return null;
      } else {
        return account;
      }
    }
  }

  static setAccount (account: Account): void {
    localStorage.setItem('account', JSON.stringify(account));
  }
}

function getTokenExpiredDate (token: string): Date {
  const encodedPayload: string = token.split('.')[1];
  const decodedPayload: string = Buffer.from(encodedPayload, 'base64').toString('utf8');
  const payload: any = JSON.parse(decodedPayload);
  return new Date(payload.exp * 1000);
}
