// react
import { useEffect, } from 'react';
import { GetServerSideProps, } from 'next/types';
import NextLink from 'next/link';
import { Card, CardBody, Divider, Heading, LinkBox, LinkOverlay, Text, VStack, } from '@chakra-ui/react';

import { MainLayout, PageBody, } from '@root/layouts';
import { PageTitle, } from '@root/components';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, unreadPersonalMessageListAtom, } from '@root/recoil';

// etc
import { BORDER_RADIUS, } from '@root/constants/style';
import iricomAPI from '@root/utils/iricomAPI';
import { Account, AccountAuth, IricomGetServerSideProps, IricomServerInfo, PersonalMessageList, TokenInfo, } from '@root/interfaces';

type Props = {
  account: Account | null,
  unreadPersonalMessageList: PersonalMessageList,
  iricomServerInfo: IricomServerInfo,
}

const AdminPage = (props: Props) => {
  const account: Account = props.account;
  const unreadPersonalMessageList: PersonalMessageList = Object.assign(new PersonalMessageList(), props.unreadPersonalMessageList);

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);
  const setUnreadPersonalMessageList = useSetRecoilState<PersonalMessageList | null>(unreadPersonalMessageListAtom);

  useEffect(() => {
    setAccount(account);
    setUnreadPersonalMessageList(unreadPersonalMessageList);
  }, []);

  return <MainLayout>
    <PageBody>
      <PageTitle title='관리자 페이지'/>
      <VStack spacing='1rem' alignItems='stretch'>
        {props && props.account && props.account.auth === AccountAuth.SYSTEM_ADMIN && <Card
          shadow={{
            base: 'none',
            md: 'sm',
          }}
          borderRadius={{
            base: '0',
            md: BORDER_RADIUS,
          }}
        >
          <CardBody>
            <VStack spacing='1rem'>
              <LinkBox width='100%'>
                <Heading size='sm'>
                  <LinkOverlay as={NextLink} href='/admin/board/create'>게시판 생성</LinkOverlay>
                  <Text fontSize='sm' fontWeight='normal'>새로운 게시판을 생성합니다.</Text>
                </Heading>
              </LinkBox>
              <Divider/>
              <LinkBox width='100%'>
                <Heading size='sm'>
                  <LinkOverlay as={NextLink} href='/admin/board/edit'>게시판 수정</LinkOverlay>
                  <Text fontSize='sm' fontWeight='normal'>게시판 정보를 수정합니다.</Text>
                </Heading>
              </LinkBox>
              <Divider/>
              <LinkBox width='100%'>
                <Heading size='sm'>
                  <LinkOverlay as={NextLink} href='/admin/board/admin'>게시판 관리자 설정</LinkOverlay>
                  <Text fontSize='sm' fontWeight='normal'>게시판에 관리자를 설정합니다.</Text>
                  <Text fontSize='sm' fontWeight='normal'>게시판 관리자는 해당 게시판에 공지사항을 작성 할 수 있으며, 게시물을 차단 할 수 있습니다.</Text>
                </Heading>
              </LinkBox>
            </VStack>
          </CardBody>
        </Card>}
        {props && props.account && (props.account.auth === AccountAuth.SYSTEM_ADMIN || props.account.auth === AccountAuth.BOARD_ADMIN) && <Card
          shadow={{
            base: 'none',
            md: 'sm',
          }}
          borderRadius={{
            base: '0',
            md: BORDER_RADIUS,
          }}
        >
          <CardBody>
            <LinkBox width='100%'>
              <Heading size='sm'>
                <LinkOverlay as={NextLink} href='/admin/reports/boards'>게시물 신고 내역</LinkOverlay>
                <Text fontSize='sm' fontWeight='normal'>신고된 게시물 목록을 조회합니다</Text>
              </Heading>
            </LinkBox>
          </CardBody>
        </Card>}
      </VStack>
    </PageBody>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context: IricomGetServerSideProps) => {
  const tokenInfo: TokenInfo | null = context.req.data.tokenInfo;
  const account: Account = context.req.data.account;

  if (tokenInfo === null || account.auth !== AccountAuth.SYSTEM_ADMIN && account.auth !== AccountAuth.BOARD_ADMIN) {
    return {
      notFound: true,
    };
  }

  const responseList: PromiseSettledResult<any>[] = await Promise.allSettled([
    iricomAPI.getServerInfo(),
  ]);

  const serverInfoResponse = responseList[0] as PromiseFulfilledResult<IricomServerInfo>;
  const serverInfo: IricomServerInfo = serverInfoResponse.value;

  return {
    props: {
      iricomServerInfo: JSON.parse(JSON.stringify(serverInfo)),
    },
  };
};

export default AdminPage;

