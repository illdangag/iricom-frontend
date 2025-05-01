import { atom, } from 'recoil';
import { v4, } from 'uuid';
import { Account, PersonalMessageList, } from '../interfaces';

const myAccountAtom = atom<Account | null>({
  key: 'myAccountAtom/' + v4(),
  default: null,
});

const unreadPersonalMessageListAtom = atom<PersonalMessageList | null>({
  key: 'unreadPersonalMessageListAtom/' + v4(),
  default: null,
});

export { myAccountAtom, unreadPersonalMessageListAtom, };
