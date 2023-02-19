// properties
export type FirebaseProperties = {
  projectId: string,
  apiKey: string,
  authDomain: string,
}

export type BackendProperties = {
  host: string,
}

// frontend
export type TokenInfo = {
  token: string,
  refreshToken: string,
  expiredDate: Date,
}

export type SessionInfo = {
  tokenInfo: TokenInfo,
  myInformation: MyInformation,
}

// backend
export type AccountType = 'systemAdmin' | 'boardAdmin' | 'account';

export type Account = {
  id: string,
  email: string,
  createDate: number,
  lastActivityDate: number,
  nickname: string,
  description: string,
  type: AccountType,
}

export type MyInformation = {
  account: Account,
}
