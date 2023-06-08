import { atom, } from 'recoil';
import { v4, } from 'uuid';

interface RequireLoginPopup {
  isShow?: boolean;
  message?: string;
  successURL?: string;
}

const requireLoginPopupAtom = atom<RequireLoginPopup>({
  key: 'requireLoginPopupAtom/' + v4(),
  default: {
    isShow: false,
    message: '',
    successURL: '',
  },
});

export type { RequireLoginPopup, };
export default requireLoginPopupAtom;
