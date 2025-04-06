// react
import { useEffect, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Card, CardBody, } from '@chakra-ui/react';

import { MainLayout, PageBody, } from '@root/layouts';
import { PersonalMessageListTable, PersonalMessagePageTitle, } from '@root/components';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '@root/recoil';

// etc
import { Account, PersonalMessageList, TokenInfo, } from '@root/interfaces';
import { getTokenInfoByCookies, parseInt, parseEnum, } from '@root/utils';
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
  console.log(tab);

  useEffect(() => {
    setAccount(props.account);
  }, []);

  const onChangeTab = (index: number) => {
    window.location.href = `?receive_page=${receiveMessageList.currentPage}&send_page=${sendMessageList.currentPage}&tab=${index === 0 ? PAGE_TAB.RECEIVE : PAGE_TAB.SEND}`;
  };

  return <MainLayout>
    <PageBody>
      <PersonalMessagePageTitle/>
      <Card
        shadow={{ base: 'none', md: 'sm', }}
        borderRadius={{ base: '0', md: BORDER_RADIUS, }}
      >
        <CardBody>
          <Tabs
            variant='line'
            size='sm'
            defaultIndex={tab === PAGE_TAB.SEND ? 1 : 0}
            onChange={onChangeTab}
          >
            <TabList>
              <Tab>받은 쪽지</Tab>
              <Tab>보낸 쪽지</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <PersonalMessageListTable
                  personalMessageList={receiveMessageList}
                  page={receiveMessageList.currentPage}
                  pageLinkHref={`?receive_page={{page}}&send_page=${sendMessageList.currentPage}&tab=${tab}`}
                />
              </TabPanel>
              <TabPanel>
                <PersonalMessageListTable
                  personalMessageList={sendMessageList}
                  page={sendMessageList.currentPage}
                  pageLinkHref={`?receive_page=${receiveMessageList.currentPage}&send_page={{page}}&tab=${tab}`}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
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

  const account: Account = await iricomAPI.getMyAccount(tokenInfo);
  const receiveMessageList: PersonalMessageList = await iricomAPI.getReceivePersonalMessageList(tokenInfo, receiveSkip, receiveLimit);
  const sendMessageList: PersonalMessageList = await iricomAPI.getSendPersonalMessageList(tokenInfo, sendSkip, sendLimit);
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
