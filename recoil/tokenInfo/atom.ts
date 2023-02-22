import { atom, } from 'recoil';
import { v4, } from 'uuid';
import { TokenInfo, } from '../../interfaces';

const tokenInfoAtom = atom<TokenInfo | null>({
  key: 'tokenInfoAtom/' + v4(),
  default: null,
});

export default tokenInfoAtom;
