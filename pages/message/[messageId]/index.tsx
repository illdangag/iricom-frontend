// react
import { useEffect, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, } from '@chakra-ui/react';
import { MainLayout, PageBody, } from '@root/layouts';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '@root/recoil';

// etc
import { TokenInfo, Account, PersonalMessage, } from '@root/interfaces';
import { getTokenInfoByCookies, } from '@root/utils';
import iricomAPI from '@root/utils/iricomAPI';
import { BORDER_RADIUS, } from '@root/constants/style';
import PersonalMessageView from '../../../components/PersonalMessageView';

type Props = {
  account: Account | null,
  personalMessage: PersonalMessage,
}

const PersonalMessagePage = (props: Props) => {
  const account: Account | null = props.account;
  const personalMessage: PersonalMessage = props.personalMessage;

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    setAccount(account);
  }, []);

  return <MainLayout>
    <PageBody>
      <Card
        shadow={{ base: 'none', md: 'sm', }}
        borderRadius={{ base: '0', md: BORDER_RADIUS, }}
      >
        <CardBody>
          <PersonalMessageView
            personalMessage={personalMessage}
          />
        </CardBody>
      </Card>
    </PageBody>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  const personalMessageId: string = context.query.messageId as string;

  const apiRequestList: any[] = [
    iricomAPI.getMyAccount(tokenInfo),
    iricomAPI.getReceivePersonalMessage(tokenInfo, personalMessageId),
  ];

  const responseList: any[] = await Promise.allSettled(apiRequestList);

  const account: Account | null = responseList[0].status === 'fulfilled' ? responseList[0].value as Account : null;
  const personalMessage: PersonalMessage = responseList[1].value as PersonalMessage;

  return {
    props: {
      account: account,
      personalMessage: personalMessage,
    },
  };
};

export default PersonalMessagePage;
