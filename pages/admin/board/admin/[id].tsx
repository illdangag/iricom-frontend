// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { Text, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { AccountAuth, } from '../../../../interfaces';
import { useIricomAPI, } from '../../../../hooks';
// etc
import { Board, } from '../../../../interfaces';

const AdminBoardAdminEditPage = () => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();

  const id: string = router.query.id as string;

  const [board, setBoard,] = useState<Board | null>(null);

  useEffect(() => {
    if (router.isReady) {
      void init(id);
    }
  }, [router.isReady,]);

  const init = async (boardId: string) => {
    const board: Board = await iricomAPI.getBoard(boardId);
    setBoard(board);
  };

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.SYSTEM_ADMIN}>
      {board && <Text>{board.title}</Text>}
    </MainLayout>
  );
};

export default AdminBoardAdminEditPage;
