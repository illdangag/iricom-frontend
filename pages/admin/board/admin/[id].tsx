// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { Text, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { AccountAuth, } from '../../../../interfaces';
import { useIricomAPI, } from '../../../../hooks';
// etc
import { Board, AccountList, } from '../../../../interfaces';

const AdminBoardAdminEditPage = () => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();

  const id: string = router.query.id as string;

  const [board, setBoard,] = useState<Board | null>(null);
  const [accountList, setAccountList,] = useState<AccountList | null>(null);

  useEffect(() => {
    if (router.isReady) {
      void init(id);
    }
  }, [router.isReady,]);

  const init = async (boardId: string) => {
    const board: Board = await iricomAPI.getBoard(boardId);
    const accountList: AccountList = await iricomAPI.getAccountList(0, 20, null);
    setBoard(board);
    setAccountList(accountList);
  };

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.SYSTEM_ADMIN}>
      {board && <Text>{board.title}</Text>}
    </MainLayout>
  );
};

export default AdminBoardAdminEditPage;
