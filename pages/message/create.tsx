// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, VStack, List, ListItem, Text, } from '@chakra-ui/react';
import { PersonalMessagePageTitle, PersonalMessageEditor, } from '@root/components';
import { MainLayout, PageBody, } from '@root/layouts';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '@root/recoil';

// etc
import { TokenInfo, Account, PersonalMessage, } from '@root/interfaces';
import { getTokenInfoByCookies, } from '@root/utils';
import iricomAPI from '@root/utils/iricomAPI';
import { BORDER_RADIUS, } from '@root/constants/style';
import { useIricom, } from '@root/hooks';

type Props = {
  account: Account,
  toAccount: Account,
};

enum PageState {
  IDLE,
  REQUEST,
}

const PersonalMessageCreatePage = (props: Props) => {
  const router = useRouter();
  const iricomAPI = useIricom();

  const toAccount: Account = props.toAccount;
  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);

  const [ pageState, setPageState, ] = useState<PageState>(PageState.IDLE);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    setAccount(props.account);
  }, [router.isReady,]);

  const onChangePersonalMessage = async (personalMessage: PersonalMessage) => {
    console.log(toAccount, personalMessage);
    setPageState(PageState.REQUEST);
    void await iricomAPI.sendPersonalMessage(toAccount.id, personalMessage.title, personalMessage.message);
    window.location.href = '/message';
  };

  return <MainLayout>
    <PageBody>
      <PersonalMessagePageTitle/>
      <VStack spacing='1rem' align='stretch'>
        <Card
          shadow={{ base: 'none', md: 'sm', }}
          borderRadius={{ base: '0', md: BORDER_RADIUS, }}
        >
          <CardBody>
            <List>
              <ListItem>
                <Text as='b'>{toAccount.nickname}</Text> 에게 쪽지보내기
              </ListItem>
            </List>
          </CardBody>
        </Card>
        <Card
          shadow={{ base: 'none', md: 'sm', }}
          borderRadius={{ base: '0', md: BORDER_RADIUS, }}
        >
          <CardBody>
            <PersonalMessageEditor
              disabled={pageState === PageState.REQUEST}
              onChange={onChangePersonalMessage}
            />
          </CardBody>
        </Card>
      </VStack>
    </PageBody>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (!tokenInfo) {
    return {
      notFound: true,
    };
  }

  const toQuery: string | undefined = context.query.to as string;
  const to: string = toQuery ? toQuery : '';

  if (!to) {
    return {
      notFound: true,
    };
  }

  const account = await iricomAPI.getMyAccount(tokenInfo);
  const toAccount = await iricomAPI.getAccount(tokenInfo, to);

  return {
    props: {
      account: account,
      toAccount: toAccount,
    },
  };
};

export default PersonalMessageCreatePage;

