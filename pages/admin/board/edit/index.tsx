// react
import { useEffect, useState, } from 'react';
import NextLink from 'next/link';
import { GetServerSideProps, } from 'next/types';
import { VStack, Card, CardBody, Divider, LinkBox, LinkOverlay, } from '@chakra-ui/react';

import { BoardView, NoContent, PageTitle, } from '../../../../components';
import { PageBody, } from '../../../../layouts';
import MainLayout from '../../../../layouts/MainLayout';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '../../../../recoil';

// etc
import { Account, AccountAuth, Board, BoardList, TokenInfo, } from '../../../../interfaces';
import { BORDER_RADIUS, } from '../../../../constants/style';
import { getTokenInfoByCookies, } from '../../../../utils';
import iricomAPI from '../../../../utils/iricomAPI';

type Props = {
  account: Account | null,
  boardList: Board[],
};

const AdminBoardEditPage = (props: Props) => {
  const [boardList, setBoardList,] = useState<Board[] | null>(null);

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    setAccount(props.account);
    setBoardList(props.boardList);
  }, []);

  const getBoardListElement = (boardList: Board[]) => {
    const elementList: JSX.Element[] = [];
    for (let index = 0; index < boardList.length; index++) {
      const board: Board = boardList[index];
      elementList.push(
        <LinkBox key={index}>
          <LinkOverlay as={NextLink} href={`/admin/board/edit/${board.id}`}/>
          <BoardView board={board}/>
        </LinkBox>,
      );
      if (index < boardList.length - 1) {
        elementList.push(<Divider key={`divider-${index}`}/>);
      }
    }
    return elementList;
  };

  return (
    <MainLayout>
      <PageBody>
        <PageTitle
          title='게시판 수정'
          descriptions={['게시판 정보를 수정합니다',]}
        />
        <Card
          shadow={{ base: 'none', md: 'sm', }}
          borderRadius={{ base: '0', md: BORDER_RADIUS, }}
        >
          <CardBody>
            {boardList && boardList.length === 0 && <NoContent message='게시판이 존재하지 않습니다.'/>}
            {boardList && boardList.length > 0 && <VStack align='stretch' spacing='1rem'>
              {getBoardListElement(boardList)}
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
      props: {},
      redirect: {
        statusCode: 307,
        destination: '/login?success=/admin/board/edit',
      },
    };
  } else {
    const account: Account = await iricomAPI.getMyAccount(tokenInfo);
    if (account.auth === AccountAuth.SYSTEM_ADMIN) {
      const boardList: BoardList = await iricomAPI.getBoardList(tokenInfo, 0, 20, null);
      return {
        props: {
          account,
          boardList: boardList.boards,
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  }
};


export default AdminBoardEditPage;
