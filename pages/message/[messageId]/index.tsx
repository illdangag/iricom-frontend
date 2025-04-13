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
import { getTokenInfoByCookies, parseEnum, } from '@root/utils';
import iricomAPI from '@root/utils/iricomAPI';
import { BORDER_RADIUS, } from '@root/constants/style';
import PersonalMessageView from '../../../components/PersonalMessageView';

enum GET_TYPE {
  SEND = 'send',
  RECEIVE = 'receive',
}

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
  const getTypeValue: string = context.query.type as string || '';

  const getType: GET_TYPE | null = parseEnum(getTypeValue, GET_TYPE, null);

  if (!getType) {
    return {
      notFound: true,
    };
  }

  const getPersonalMessage = getType === GET_TYPE.RECEIVE && iricomAPI.getReceivePersonalMessage || iricomAPI.getSendPersonalMessage;
  const apiRequestList: any[] = [
    iricomAPI.getMyAccount(tokenInfo),
    getPersonalMessage(tokenInfo, personalMessageId),
  ];

  const responseList: PromiseSettledResult<any>[] = await Promise.allSettled(apiRequestList);
  const isAllSuccess: boolean = responseList.findIndex((item) => item.status !== 'fulfilled') === -1;
  if (!isAllSuccess) {
    return {
      notFound: true,
    };
  }

  const accountResponse: PromiseFulfilledResult<Account> = responseList[0] as PromiseFulfilledResult<Account>;
  const personalMessageResponse: PromiseFulfilledResult<PersonalMessage> = responseList[1] as PromiseFulfilledResult<PersonalMessage>;

  const account: Account = accountResponse.value;
  const personalMessage: PersonalMessage = personalMessageResponse.value;

  return {
    props: {
      account: account,
      personalMessage: personalMessage,
    },
  };
};

export default PersonalMessagePage;
