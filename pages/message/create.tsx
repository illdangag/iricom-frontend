// react
import { useEffect, } from 'react';
import { useRouter, } from 'next/router';
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, } from '@chakra-ui/react';
import { PersonalMessagePageTitle, } from '@root/components';
import { MainLayout, PageBody, } from '@root/layouts';

// store
import { useRecoilState, useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '@root/recoil';

// etc
import { TokenInfo, Account, } from '@root/interfaces';
import { getTokenInfoByCookies, } from '@root/utils';
import iricomAPI from '@root/utils/iricomAPI';
import { BORDER_RADIUS, } from '@root/constants/style';

type Props = {
  account: Account,
};

const PersonalMessageCreatePage = (props: Props) => {
  const router = useRouter();
  const [account, setAccount,] = useRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    setAccount(props.account);
  }, [router.isReady,]);

  return <MainLayout>
    <PageBody>
      <PersonalMessagePageTitle isShowCreate={false}/>
      <Card
        shadow={{ base: 'none', md: 'sm', }}
        borderRadius={{ base: '0', md: BORDER_RADIUS, }}
      >
        <CardBody>

        </CardBody>
      </Card>
    </PageBody>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await  getTokenInfoByCookies(context);

  if (!tokenInfo) {
    return {
      notFound: true,
    };
  }

  const account = await iricomAPI.getMyAccount(tokenInfo);
  return {
    props: {
      account: account,
    },
  };
};

export default PersonalMessageCreatePage;

