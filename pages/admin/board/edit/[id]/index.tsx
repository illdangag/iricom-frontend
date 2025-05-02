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
import { myAccountAtom, unreadPersonalMessageListAtom, } from '@root/recoil';

// etc
import { Account, AccountAuth, Board, IricomGetServerSideProps, PersonalMessageList, TokenInfo, } from '@root/interfaces';
import { BORDER_RADIUS, } from '@root/constants/style';
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
  unreadPersonalMessageList: PersonalMessageList,
  board: Board,
}

const AdminBoardEditIdPage = (props: Props) => {
  const account: Account = props.account;
  const unreadPersonalMessageList: PersonalMessageList = Object.assign(new PersonalMessageList(), props.unreadPersonalMessageList);

  const router = useRouter();
  const toast = useToast();
  const iriconAPI = useIricom();

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);
  const setUnreadPersonalMessageList = useSetRecoilState<PersonalMessageList | null>(unreadPersonalMessageListAtom);

  const [pageState, setPageState,] = useState<PageState>(PageState.INVALID);
  const [board, setBoard,] = useState<Board | null>(null);
  const [title, setTitle,] = useState<string>('');
  const [description, setDescription,] = useState<string>('');
  const [enabled, setEnabled,] = useState<boolean>(false);
  const [showAlert, setShowAlert,] = useState<boolean>(false);

  useEffect(() => {
    setAccount(account);
    setUnreadPersonalMessageList(unreadPersonalMessageList);

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

export const getServerSideProps: GetServerSideProps = async (context: IricomGetServerSideProps) => {
  const tokenInfo: TokenInfo | null = context.req.data.tokenInfo;
  const account: Account = context.req.data.account;

  if (tokenInfo === null || account.auth !== AccountAuth.SYSTEM_ADMIN) {
    return {
      notFound: true,
    };
  }

  const boardId: string = context.query.id as string;

  const responseList: PromiseSettledResult<any>[] = await Promise.allSettled([
    iricomAPI.getBoard(tokenInfo, boardId),
  ]);

  const boardResponse = responseList[0] as PromiseFulfilledResult<Board>;
  const board: Board = boardResponse.value;

  return {
    props: {
      board: JSON.parse(JSON.stringify(board)),
    },
  };
};


export default AdminBoardEditIdPage;
