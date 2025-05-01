// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, List, ListItem, Text, VStack, } from '@chakra-ui/react';
import { PersonalMessageEditor, PersonalMessagePageTitle, } from '@root/components';
import { MainLayout, PageBody, } from '@root/layouts';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, unreadPersonalMessageListAtom, } from '@root/recoil';

// etc
import { Account, PersonalMessage, PersonalMessageList, PersonalMessageStatus, TokenInfo, } from '@root/interfaces';
import { getTokenInfoByCookies, } from '@root/utils';
import iricomAPI from '@root/utils/iricomAPI';
import { BORDER_RADIUS, } from '@root/constants/style';
import { useIricom, } from '@root/hooks';

type Props = {
  account: Account,
  unreadPersonalMessageList: PersonalMessageList,
  toAccount: Account,
};

enum PageState {
  IDLE,
  REQUEST,
}

const PersonalMessageCreatePage = (props: Props) => {
  const account: Account | null = props.account;
  const unreadPersonalMessageList: PersonalMessageList = Object.assign(new PersonalMessageList(), props.unreadPersonalMessageList);
  const toAccount: Account = props.toAccount;

  const router = useRouter();
  const iricomAPI = useIricom();

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);
  const setUnreadPersonalMessageList = useSetRecoilState<PersonalMessageList | null>(unreadPersonalMessageListAtom);

  const [ pageState, setPageState, ] = useState<PageState>(PageState.IDLE);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    setAccount(account);
    setUnreadPersonalMessageList(unreadPersonalMessageList);
  }, [router.isReady,]);

  const onChangePersonalMessage = async (personalMessage: PersonalMessage) => {
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
  const to: string = toQuery || '';

  if (!to) {
    return {
      notFound: true,
    };
  }

  const responseList: PromiseSettledResult<any>[] = await Promise.allSettled([
    iricomAPI.getMyAccount(tokenInfo),
    iricomAPI.getReceivePersonalMessageList(tokenInfo, PersonalMessageStatus.UNREAD, 0, 1),
    iricomAPI.getAccount(tokenInfo, to),
  ]);

  if (responseList[0].status === 'rejected') {
    return {
      notFound: true,
    };
  }

  const accountResponse = responseList[0] as PromiseFulfilledResult<Account>;
  const personalMessageListResponse = responseList[1] as PromiseFulfilledResult<PersonalMessageList>;
  const toAccountResponse = responseList[2] as PromiseFulfilledResult<Account>;

  const account = accountResponse.value;
  const personalMessageList = personalMessageListResponse.value;
  const toAccount = toAccountResponse.value;

  return {
    props: {
      account: account,
      unreadPersonalMessageList: JSON.parse(JSON.stringify(personalMessageList)),
      toAccount: toAccount,
    },
  };
};

export default PersonalMessageCreatePage;

