import { atom, } from 'recoil';
import { v4, } from 'uuid';
import { Account, } from '../../interfaces';

const accountAtom = atom<Account | null>({
  key: 'accountAtom/' + v4(),
  default: null,
});

export default accountAtom;
