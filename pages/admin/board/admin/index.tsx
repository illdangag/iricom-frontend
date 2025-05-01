// react
import React, { useEffect, } from 'react';
import { useRouter, } from 'next/router';
import NextLink from 'next/link';
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, Divider, LinkBox, LinkOverlay, VStack, } from '@chakra-ui/react';

import { MainLayout, PageBody, } from '@root/layouts';
import { BoardView, NoContent, PageTitle, } from '@root/components';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, unreadPersonalMessageListAtom, } from '@root/recoil';

// etc
import { Account, AccountAuth, Board, BoardList, PersonalMessageList, PersonalMessageStatus, TokenInfo, } from '@root/interfaces';
import { BORDER_RADIUS, } from '@root/constants/style';
import { getAccountAndUnreadPersonalMessageList, getTokenInfoByCookies, } from '@root/utils';
import iricomAPI from '@root/utils/iricomAPI';

type Props = {
  account: Account,
  unreadPersonalMessageList: PersonalMessageList,
  boardList: BoardList,
}

const AdminBoardAdminPage = (props: Props) => {
  const account: Account = props.account;
  const unreadPersonalMessageList: PersonalMessageList = Object.assign(new PersonalMessageList(), props.unreadPersonalMessageList);

  const router = useRouter();

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);
  const setUnreadPersonalMessageList = useSetRecoilState<PersonalMessageList | null>(unreadPersonalMessageListAtom);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    setAccount(account);
    setUnreadPersonalMessageList(unreadPersonalMessageList);
  }, [router.isReady,]);

  const getBoardListElement = (boardList: Board[]) => {
    const elementList: JSX.Element[] = [];
    for (let index = 0; index < boardList.length; index++) {
      const board: Board = boardList[index];
      elementList.push(<LinkBox key={index}>
        <LinkOverlay as={NextLink} href={`/admin/board/admin/${board.id}`}/>
        <BoardView board={board}/>
      </LinkBox>);
      if (index < boardList.length - 1) {
        elementList.push(<Divider key={'divider-' + index}/>);
      }
    }
    return elementList;
  };

  return (
    <MainLayout>
      <PageBody>
        <PageTitle
          title='게시판 관리자 설정'
          descriptions={['게시판에 관리자를 설정합니다.', '게시판 관리자는 해당 게시판에 공지사항을 작성 할 수 있으며, 게시물을 차단 할 수 있습니다.',]}
        />
        <Card
          shadow={{ base: 'none', md: 'sm', }}
          borderRadius={{ base: '0', md: BORDER_RADIUS, }}
        >
          <CardBody>
            {props.boardList.boards && props.boardList.boards.length === 0 && <NoContent message='게시판이 존재하지 않습니다.'/>}
            {props.boardList.boards && props.boardList.boards.length > 0 && <VStack align='stretch' spacing='1rem'>
              {getBoardListElement(props.boardList.boards)}
            </VStack>}
          </CardBody>
        </Card>
      </PageBody>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo === null) {
    return {
      notFound: true,
    };
  }

  const responseList: PromiseSettledResult<any>[] = await Promise.allSettled([
    iricomAPI.getMyAccount(tokenInfo),
    iricomAPI.getReceivePersonalMessageList(tokenInfo, PersonalMessageStatus.UNREAD, 0, 1),
    iricomAPI.getBoardList(tokenInfo, 0, 20, null),
  ]);

  if (responseList[0].status === 'rejected') {
    return {
      notFound: true,
    };
  }

  const accountResponse = responseList[0] as PromiseFulfilledResult<Account>;
  const unreadPersonalMessageListResponse = responseList[1] as PromiseFulfilledResult<PersonalMessageList>;
  const boardListResponse = responseList[2] as PromiseFulfilledResult<BoardList>;

  const account: Account = accountResponse.value;
  const unreadPersonalMessageList = unreadPersonalMessageListResponse.value;
  const boardList: BoardList = boardListResponse.value;

  if (account.auth !== AccountAuth.SYSTEM_ADMIN) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      account,
      unreadPersonalMessageList: JSON.parse(JSON.stringify(unreadPersonalMessageList)),
      boardList: JSON.parse(JSON.stringify(boardList)),
    },
  };
};

export default AdminBoardAdminPage;
