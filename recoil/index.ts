import { atom, } from 'recoil';
import { v4, } from 'uuid';
import { MyAccountInfo, } from '../interfaces';

const myAccountInfoAtom = atom<MyAccountInfo | null>({
  key: 'myAccountInfoAtom/' + v4(),
  default: null,
});

export { myAccountInfoAtom, };
