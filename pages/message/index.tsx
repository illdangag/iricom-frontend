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
import { getTokenInfoByCookies, } from '@root/utils';
import iricomAPI from '@root/utils/iricomAPI';
import { BORDER_RADIUS, } from '@root/constants/style';

type Props = {
  account: Account,
  receiveMessageList: PersonalMessageList,
  sendMessageList: PersonalMessageList,
};

const PersonalMessagePage = (props: Props) => {
  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);
  const receiveMessageList = Object.assign(new PersonalMessageList(), props.receiveMessageList);
  const sendMessageList = Object.assign(new PersonalMessageList(), props.sendMessageList);

  useEffect(() => {
    setAccount(props.account);
  }, []);

  return <MainLayout>
    <PageBody>
      <PersonalMessagePageTitle/>
      <Card
        shadow={{ base: 'none', md: 'sm', }}
        borderRadius={{ base: '0', md: BORDER_RADIUS, }}
      >
        <CardBody>
          <Tabs variant='line' size='sm'>
            <TabList>
              <Tab>받은 쪽지</Tab>
              <Tab>보낸 쪽지</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <PersonalMessageListTable personalMessageList={receiveMessageList} page={0}/>
              </TabPanel>
              <TabPanel>
                <PersonalMessageListTable personalMessageList={sendMessageList} page={0}/>
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

  const account: Account = await iricomAPI.getMyAccount(tokenInfo);
  const receiveMessageList: PersonalMessageList = await iricomAPI.getReceivePersonalMessageList(tokenInfo, 0, 20);
  const sendMessageList: PersonalMessageList = await iricomAPI.getSendPersonalMessageList(tokenInfo, 0, 20);
  return {
    props: {
      account,
      receiveMessageList: JSON.parse(JSON.stringify(receiveMessageList)),
      sendMessageList: JSON.parse(JSON.stringify(sendMessageList)),
    },
  };
};

export default PersonalMessagePage;
