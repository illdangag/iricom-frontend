// react
import { useEffect, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { Button, Card, CardBody, HStack, VStack, } from '@chakra-ui/react';

import { MainLayout, PageBody, } from '@root/layouts';
import { PersonalMessageListTable, PersonalMessagePageTitle, } from '@root/components';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '@root/recoil';

// etc
import { Account, PersonalMessageList, PersonalMessageStatus, TokenInfo, } from '@root/interfaces';
import { getTokenInfoByCookies, parseEnum, parseInt, } from '@root/utils';
import iricomAPI from '@root/utils/iricomAPI';
import { BORDER_RADIUS, } from '@root/constants/style';

const PAGE_LIMIT: number = 10;

enum PAGE_TAB {
  RECEIVE = 'receive',
  SEND = 'send',
}

type Props = {
  account: Account,
  receiveMessageList: PersonalMessageList,
  sendMessageList: PersonalMessageList,
  tab: PAGE_TAB,
};

const PersonalMessagePage = (props: Props) => {
  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);
  const receiveMessageList: PersonalMessageList = Object.assign(new PersonalMessageList(), props.receiveMessageList);
  const sendMessageList: PersonalMessageList = Object.assign(new PersonalMessageList(), props.sendMessageList);
  const tab: PAGE_TAB = props.tab;

  useEffect(() => {
    setAccount(props.account);
  }, []);

  const getGetParameter = (receivePage: string, sendPage: string, tab: PAGE_TAB): string => {
    return `?receive_page=${receivePage}&send_page=${sendPage}&tab=${tab}`;
  };

  const onClickReceiveButton = () => {
    window.location.href = getGetParameter('' + receiveMessageList.currentPage, '' + sendMessageList.currentPage, PAGE_TAB.RECEIVE);
  };

  const onClickSendButton = () => {
    window.location.href = getGetParameter('' + receiveMessageList.currentPage, '' + sendMessageList.currentPage, PAGE_TAB.SEND);
  };

  return <MainLayout>
    <PageBody>
      <PersonalMessagePageTitle/>
      <Card
        shadow={{ base: 'none', md: 'sm', }}
        borderRadius={{ base: '0', md: BORDER_RADIUS, }}
      >
        <CardBody>
          <VStack alignItems='stretch'>
            <HStack justifyContent='flex-start' gap='0.5rem' paddingBottom='0.5rem'>
              <Button
                size='sm' variant='link'
                colorScheme={tab === PAGE_TAB.RECEIVE ? 'blue' : 'gray'}
                onClick={onClickReceiveButton}
              >
                받은 쪽지
              </Button>
              <Button
                size='sm' variant='link'
                colorScheme={tab === PAGE_TAB.SEND ? 'blue' : 'gray'}
                onClick={onClickSendButton}
              >
                보낸 쪽지
              </Button>
            </HStack>
            {tab === PAGE_TAB.RECEIVE && <PersonalMessageListTable
              personalMessageList={receiveMessageList}
              page={receiveMessageList.currentPage}
              pageLinkHref={getGetParameter('{{page}}', '' + sendMessageList.currentPage, tab)}
              isShowNewBadge={true}
              isShowSendAccount={true}
            />}
            {tab === PAGE_TAB.SEND && <PersonalMessageListTable
              personalMessageList={sendMessageList}
              page={sendMessageList.currentPage}
              pageLinkHref={getGetParameter('' + receiveMessageList.currentPage, '{{page}}', tab)}
              isShowReceiveAccount={true}
              isShowReceivedConfirm={true}
            />}
          </VStack>
        </CardBody>
      </Card>
    </PageBody>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo === null) {
    return {
      notFound: true,
    };
  }

  // 탭
  const pageTabQuery: string = context.query.tab as string;
  const pageTab: PAGE_TAB = parseEnum(pageTabQuery, PAGE_TAB, PAGE_TAB.RECEIVE);

  // 받은 쪽지함 페이지네이션
  const receivePageQuery: string = context.query.receive_page as string || '';
  const receivePage: number = parseInt(receivePageQuery, 1);
  const receiveLimit: number = PAGE_LIMIT;
  const receiveSkip: number = receiveLimit * (receivePage - 1);

  // 보낸 쪽지함 페이지네이션
  const sendPageQuery: string = context.query.send_page as string || '';
  const sendPage: number = parseInt(sendPageQuery, 1);
  const sendLimit: number = PAGE_LIMIT;
  const sendSkip: number = sendLimit * (sendPage - 1);

  const apiRequestList: Promise<any>[] = [
    iricomAPI.getMyAccount(tokenInfo),
    iricomAPI.getReceivePersonalMessageList(tokenInfo, PersonalMessageStatus.ALL, receiveSkip, receiveLimit),
    iricomAPI.getSendPersonalMessageList(tokenInfo, sendSkip, sendLimit),
  ];

  const responseList: PromiseSettledResult<any>[] = await Promise.allSettled(apiRequestList);
  const isAllSuccess: boolean = responseList.findIndex((item) => item.status !== 'fulfilled') === -1;
  if (!isAllSuccess) {
    return {
      notFound: true,
    };
  }

  const accountResponse: PromiseFulfilledResult<Account> = responseList[0] as PromiseFulfilledResult<Account>;
  const receiveMessageResponse: PromiseFulfilledResult<PersonalMessageList> = responseList[1] as PromiseFulfilledResult<PersonalMessageList>;
  const sendMessageResponse: PromiseFulfilledResult<PersonalMessageList> = responseList[2] as PromiseFulfilledResult<PersonalMessageList>;

  const account: Account = accountResponse.value;
  const receiveMessageList: PersonalMessageList = receiveMessageResponse.value;
  const sendMessageList: PersonalMessageList = sendMessageResponse.value;

  return {
    props: {
      tab: pageTab,
      account,
      receiveMessageList: JSON.parse(JSON.stringify(receiveMessageList)),
      sendMessageList: JSON.parse(JSON.stringify(sendMessageList)),
    },
  };
};

export default PersonalMessagePage;
