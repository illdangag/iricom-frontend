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

// backend
export type IricomError = {
  code: string,
  message: string,
};

export enum AccountAuth {
  SYSTEM_ADMIN = 'systemAdmin',
  BOARD_ADMIN = 'boardAdmin',
  ACCOUNT = 'account',
}

export type Account = {
  id: string,
  email: string,
  createDate: number,
  lastActivityDate: number,
  nickname: string,
  description: string,
  auth: AccountAuth,
}

export type MyInformation = {
  account: Account,
}

export type Board = {
  id: string,
  title: string,
  description: string,
  enabled: boolean,
}

export type BoardList = {
  total: number,
  skip: number,
  limit: number,
  boards: Board[],
}
