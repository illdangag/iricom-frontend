import { SessionInfo, } from '../interfaces';

export class BrowserStorage {
  static SESSION_KEY: string = 'session';

  static clear (): void {
    localStorage.clear();
  }

  static getSessionInfo (): SessionInfo | null {
    const sessionInfoValue: string = localStorage.getItem(BrowserStorage.SESSION_KEY);
    if (sessionInfoValue === null) {
      return null;
    } else {
      const sessionInfo: SessionInfo = JSON.parse(sessionInfoValue) as SessionInfo;
      return sessionInfo;
    }
  }

  static setSessionInfo (sessionInfo: SessionInfo): void {
    localStorage.setItem(BrowserStorage.SESSION_KEY, JSON.stringify(sessionInfo));
  }
}

export function getTokenExpiredDate (token: string): Date {
  const encodedPayload: string = token.split('.')[1];
  const decodedPayload: string = Buffer.from(encodedPayload, 'base64').toString('utf8');
  const payload: any = JSON.parse(decodedPayload);
  return new Date(payload.exp * 1000);
}
