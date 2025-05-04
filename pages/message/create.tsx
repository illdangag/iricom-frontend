// react
import { useEffect, useState, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { Box, Button, Card, CardBody, HStack, Text, VStack, } from '@chakra-ui/react';
import { AccountSearchPopup, PersonalMessageEditor, PersonalMessagePageTitle, } from '@root/components';
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
  toAccount: Account | null,
};

enum PageState {
  IDLE,
  REQUEST,
}

const PersonalMessageCreatePage = (props: Props) => {
  const account: Account | null = props.account;
  const unreadPersonalMessageList: PersonalMessageList = Object.assign(new PersonalMessageList(), props.unreadPersonalMessageList);

  const iricomAPI = useIricom();

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);
  const setUnreadPersonalMessageList = useSetRecoilState<PersonalMessageList | null>(unreadPersonalMessageListAtom);

  const [toAccount, setToAccount,] = useState<Account | null>(props.toAccount);
  const [pageState, setPageState,] = useState<PageState>(PageState.IDLE);
  const [isOpenAccountSearchPopup, setOpenAccountSearchPopup,] = useState<boolean>(false);

  useEffect(() => {
    setAccount(account);
    setUnreadPersonalMessageList(unreadPersonalMessageList);
  }, []);

  const onChangePersonalMessage = async (personalMessage: PersonalMessage) => {
    setPageState(PageState.REQUEST);
    void await iricomAPI.sendPersonalMessage(toAccount.id, personalMessage.title, personalMessage.message);
    window.location.href = '/message';
  };

  const onClickOpenAccountSearchPopup = () => {
    setOpenAccountSearchPopup(true);
  };

  const onCloseAccountSearchPopup = () => {
    setOpenAccountSearchPopup(false);
  };

  const onConfirmAccountSearchPopup = (accounts: Account[]) => {
    setToAccount(accounts[0]);
    setOpenAccountSearchPopup(false);
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
            <HStack>
              {toAccount && <Box>
                <Text as='b' display='inline-block'>{toAccount.nickname || toAccount.email}</Text> <Text display='inline-block'>에게 쪽지보내기</Text>
              </Box>}
              <Button size='xs' variant='outline' onClick={onClickOpenAccountSearchPopup}>멤버 검색</Button>
            </HStack>
          </CardBody>
        </Card>
        <Card
          shadow={{ base: 'none', md: 'sm', }}
          borderRadius={{ base: '0', md: BORDER_RADIUS, }}
        >
          <CardBody>
            <PersonalMessageEditor
              disabled={!toAccount || pageState === PageState.REQUEST}
              onChange={onChangePersonalMessage}
            />
          </CardBody>
        </Card>
      </VStack>
      <AccountSearchPopup
        isOpen={isOpenAccountSearchPopup}
        onClose={onCloseAccountSearchPopup}
        onConfirm={onConfirmAccountSearchPopup}
      />
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

  if (to) {
    try {
      const toAccount: Account = await iricomAPI.getAccount(tokenInfo, to);
      return {
        props: {
          toAccount: toAccount,
        },
      };
    } catch (error) {
      return {
        props: {
          toAccount: null,
        },
      };
    }
  } else {
    return {
      props: {
        toAccount: null,
      },
    };
  }
};

export default PersonalMessageCreatePage;

