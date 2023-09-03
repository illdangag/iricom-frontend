// react
import React, { useEffect, } from 'react';
import NextLink from 'next/link';
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, Divider, LinkBox, LinkOverlay, VStack, } from '@chakra-ui/react';

import { MainLayout, PageBody, } from '../../../../layouts';
import { BoardView, NoContent, PageTitle, } from '../../../../components';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '../../../../recoil';

// etc
import { Account, AccountAuth, Board, BoardList, TokenInfo, } from '../../../../interfaces';
import { BORDER_RADIUS, } from '../../../../constants/style';
import { getTokenInfoByCookies, } from '../../../../utils';
import iricomAPI from '../../../../utils/iricomAPI';

type Props = {
  account: Account,
  boardList: BoardList,
}

const AdminBoardAdminPage = (props: Props) => {
  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    setAccount(props.account);
  }, []);

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

  const response: any[] = await Promise.all([
    iricomAPI.getMyAccount(tokenInfo),
    iricomAPI.getBoardList(tokenInfo, 0, 20, null),
  ]);
  const account: Account = response[0] as Account;
  const boardList: BoardList = response[1] as BoardList;

  if (account.auth !== AccountAuth.SYSTEM_ADMIN) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      account,
      boardList: JSON.parse(JSON.stringify(boardList)),
    },
  };
};

export default AdminBoardAdminPage;
