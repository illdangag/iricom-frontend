import { atom, } from 'recoil';
import { v4, } from 'uuid';

interface TestCount {
  count: number;
}

const testCountAtom = atom<TestCount>({
  key: 'testCountAtom/' + v4(),
  default: {
    count: 0,
  },
});

export type { TestCount, };
export default testCountAtom;
