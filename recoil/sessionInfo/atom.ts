import { atom, } from 'recoil';
import { v4, } from 'uuid';
import { SessionInfo, } from '../../interfaces';

const sessionInfoAtom = atom<SessionInfo | null>({
  key: 'sessionInfoAtom/' + v4(),
  default: null,
});

export default sessionInfoAtom;
