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
  UNREGISTERED_ACCOUNT = 'unregisteredAccount',
  NONE = 'none',
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

export type MyAccountInfo = {
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

export enum PostType {
  POST = 'post',
  NOTIFICATION = 'notification',
}

export enum PostState {
  TEMPORARY= 'temporary',
  POST = 'post',
}

export type Post = {
  id: string,
  type: PostType,
  createDate: Date,
  updateDate: Date,
  status: PostState,
  title: string,
  content: string,
  viewCount: number,
  upvote: number,
  downvote: number,
  commentCount: number,
  account: Account,
  isAllowComment: boolean,
}

export type PostList = {
  total: number,
  skip: number,
  limit: number,
  posts: Post[],
}
