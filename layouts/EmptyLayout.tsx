// react
import { ReactNode, } from 'react';
import Head from 'next/head';
import { RequireLoginAlert, } from '../components/alerts';

// store
import { useRecoilValue, useSetRecoilState, } from 'recoil';
import requireLoginPopupAtom, { RequireLoginPopup, setPopupSelector as setRequireLoginPopupSelector, } from '../recoil/requireLoginPopup';

type Props = {
  children?: ReactNode,
  title?: string,
};

const EmptyLayout = ({
  children,
  title = 'Welcome | iricom',
}: Props) => {
  const requireLoginPopup = useRecoilValue(requireLoginPopupAtom);
  const setRequireLoginPopup = useSetRecoilState<RequireLoginPopup>(setRequireLoginPopupSelector);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
      <RequireLoginAlert
        text={requireLoginPopup.message}
        successURL={requireLoginPopup.successURL}
        isOpen={requireLoginPopup.isShow}
        onClose={() => setRequireLoginPopup({
          isShow: false,
        })}
      />
    </>
  );
};

export type { Props, };
export default EmptyLayout;
