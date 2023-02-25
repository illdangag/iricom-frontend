import { atom, } from 'recoil';
import { v4, } from 'uuid';
import { MyAccountInfo, TokenInfo, } from '../interfaces';

const myAccountInfoAtom = atom<MyAccountInfo | null>({
  key: 'myAccountInfoAtom/' + v4(),
  default: null,
});

const tokenInfoAtom = atom<TokenInfo | null>({
  key: 'tokenInfoAtom/' + v4(),
  default: null,
});

export { myAccountInfoAtom, tokenInfoAtom, };
