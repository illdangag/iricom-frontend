import { selector, } from 'recoil';
import { v4, } from 'uuid';
import requireLoginPopupAtom, { RequireLoginPopup, } from './atom';

const setPopupSelector = selector<RequireLoginPopup>({
  key: 'setPopup/' + v4(),
  get: ({ get, }) => {
    return get(requireLoginPopupAtom);
  },
  set: ({ get, set, }, defaultValue: RequireLoginPopup) => {
    const value: RequireLoginPopup = get(requireLoginPopupAtom);
    const newValue = Object.assign({}, value);
    if (Object.hasOwn(defaultValue, 'isShow')) {
      newValue.isShow = defaultValue.isShow;
    }
    if (Object.hasOwn(defaultValue, 'message')) {
      newValue.message = defaultValue.message;
    }
    if (Object.hasOwn(defaultValue, 'successURL')) {
      newValue.successURL = defaultValue.successURL;
    }
    set(requireLoginPopupAtom, newValue);
  },
});

export default setPopupSelector;
