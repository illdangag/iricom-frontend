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
import { Account, IricomGetServerSideProps, PersonalMessage, PersonalMessageList, TokenInfo, } from '@root/interfaces';
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

export const getServerSideProps: GetServerSideProps = async (context: IricomGetServerSideProps) => {
  const tokenInfo: TokenInfo | null = context.req.data.tokenInfo;

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
    iricomAPI.getAccount(tokenInfo, to),
  ]);

  if (responseList[0].status === 'rejected') {
    return {
      notFound: true,
    };
  }

  const toAccountResponse = responseList[0] as PromiseFulfilledResult<Account>;
  const toAccount = toAccountResponse.value;

  return {
    props: {
      toAccount: toAccount,
    },
  };
};

export default PersonalMessageCreatePage;

