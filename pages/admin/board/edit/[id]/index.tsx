// react
import { ChangeEvent, useEffect, useState, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { useRouter, } from 'next/router';
import { Button, Card, CardBody, CardFooter, Checkbox, FormControl, FormHelperText, FormLabel, Input, Textarea, useToast, VStack, } from '@chakra-ui/react';

import { MainLayout, PageBody, } from '@root/layouts';
import { NotExistBoardAlert, } from '@root/components/alerts';
import { PageTitle, } from '@root/components';
import { useIricom, } from '@root/hooks';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '@root/recoil';

// etc
import { Account, AccountAuth, Board, PersonalMessageList, PersonalMessageStatus, TokenInfo, } from '@root/interfaces';
import { BORDER_RADIUS, } from '@root/constants/style';
import { getAccountAndUnreadPersonalMessageList, getTokenInfoByCookies, } from '@root/utils';
import iricomAPI from '@root/utils/iricomAPI';

enum PageState {
  INVALID,
  VALID,
  REQUEST,
  SUCCESS,
  FAIL,
}

type Props = {
  account: Account,
  board: Board,
}

const AdminBoardEditIdPage = (props: Props) => {
  const router = useRouter();
  const toast = useToast();
  const iriconAPI = useIricom();

  const [pageState, setPageState,] = useState<PageState>(PageState.INVALID);
  const [board, setBoard,] = useState<Board | null>(null);
  const [title, setTitle,] = useState<string>('');
  const [description, setDescription,] = useState<string>('');
  const [enabled, setEnabled,] = useState<boolean>(false);
  const [showAlert, setShowAlert,] = useState<boolean>(false);

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    setAccount(props.account);

    const board: Board = Object.assign(new Board(), props.board);
    setTitle(board.title);
    setDescription(board.description);
    setEnabled(board.enabled);
    setBoard(board);
  }, []);

  useEffect(() => {
    if (board === null || title.length === 0) {
      setPageState(PageState.INVALID);
    } else {
      setPageState(PageState.VALID);
    }
  }, [board, title,]);

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const onChangeEnabled = (event: ChangeEvent<HTMLInputElement>) => {
    setEnabled(event.target.checked);
  };

  const onClickEdit = () => {
    // TODO 수정 버튼 선택시 게시판 정보 수정 확인 과정
    updateBoard();
  };

  const updateBoard = () => {
    setPageState(PageState.REQUEST);

    const updateBoard: Board = {
      id: board.id,
      title: title,
      description: description,
      enabled: enabled,
    };

    void iriconAPI.updateBoard(updateBoard)
      .then(_board => {
        setPageState(PageState.SUCCESS);
        toast({
          title: '게시판을 수정하였습니다.',
          status: 'success',
          duration: 3000,
        });
        void router.push('/admin');
      })
      .catch(_error => {
        setPageState(PageState.FAIL);
      });
  };

  const onCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <MainLayout>
      <PageBody>
        {board && <PageTitle
          title={board.title}
          descriptions={[board.description,]}
        />}
        <Card
          shadow={{ base: 'none', md: 'sm', }}
          borderRadius={{ base: '0', md: BORDER_RADIUS, }}
        >
          <CardBody>
            <VStack spacing='1.8rem'>
              <FormControl isRequired>
                <FormLabel>제목</FormLabel>
                <Input autoFocus value={title} onChange={onChangeTitle} isDisabled={board === null || pageState === PageState.REQUEST}/>
              </FormControl>
              <FormControl>
                <FormLabel>설명</FormLabel>
                <Textarea placeholder='설명을 입력해주세요.' value={description} onChange={onChangeDescription} isDisabled={board === null || pageState === PageState.REQUEST}/>
              </FormControl>
              <FormControl>
                {board === null && <Checkbox isDisabled>활성화</Checkbox>}
                {board !== null && <Checkbox defaultChecked={board.enabled} checked={true} onChange={onChangeEnabled} isDisabled={pageState === PageState.REQUEST}>활성화</Checkbox>}
                <FormHelperText>비활성화 게시판은 사용자에게 나타나지 않으며, 게시물 작성 및 댓글 작성이 불가능합니다.</FormHelperText>
              </FormControl>
            </VStack>
          </CardBody>
          <CardFooter justifyContent='flex-end'>
            <Button isDisabled={pageState !== PageState.VALID} onClick={onClickEdit}>수정</Button>
          </CardFooter>
        </Card>
      </PageBody>
      {<NotExistBoardAlert isOpen={showAlert} onClose={onCloseAlert}/>}
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

  const boardId: string = context.query.id as string;

  const responseList: PromiseSettledResult<any>[] = await Promise.allSettled([
    iricomAPI.getMyAccount(tokenInfo),
    iricomAPI.getReceivePersonalMessageList(tokenInfo, PersonalMessageStatus.UNREAD, 0, 1),
    iricomAPI.getBoard(tokenInfo, boardId),
  ]);

  const accountResponse = responseList[0] as PromiseFulfilledResult<Account>;
  const unreadPersonalMessageListResponse = responseList[1] as PromiseFulfilledResult<PersonalMessageList>;
  const boardResponse = responseList[2] as PromiseFulfilledResult<Board>;

  const account: Account = accountResponse.value;
  const unreadPersonalMessageList = unreadPersonalMessageListResponse.value;
  const board: Board = boardResponse.value;

  if (account.auth !== AccountAuth.SYSTEM_ADMIN) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      account,
      unreadPersonalMessageList: JSON.parse(JSON.stringify(unreadPersonalMessageList)),
      board: JSON.parse(JSON.stringify(board)),
    },
  };
};


export default AdminBoardEditIdPage;
