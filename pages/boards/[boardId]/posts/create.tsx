// react
import { ChangeEvent, useEffect, useRef, useState, } from 'react';
import { useRouter, } from 'next/router';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, ButtonGroup, Card, CardBody, Checkbox, FormControl, FormHelperText, FormLabel, HStack, Input, Radio, RadioGroup, Textarea, VStack, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { useAccountState, useIricomAPI, } from '../../../../hooks';
// etc
import { AccountAuth, PostType, } from '../../../../interfaces';

enum PageState {
  INVALID,
  VALID,
  INVALID_BOARD,
}

const PostCreatePage = () => {
  const router = useRouter();
  const [loginState, accountAuth,] = useAccountState();
  const iricomAPI = useIricomAPI();
  const notExistBoardCancelRef = useRef();

  const { boardId, } = router.query;
  const [pageState, setPageState,] = useState<PageState>(PageState.INVALID);
  const [title, setTitle,] = useState<string>('');
  const [content, setContent,] = useState<string>('');
  const defaultPostType: PostType = PostType.POST;
  const [type, setType,] = useState<PostType>(defaultPostType);
  const defaultDisabledComment: boolean = false;
  const [disabledComment, setDisabledComment,] = useState<boolean>(defaultDisabledComment);
  const [isShowNotExistBoardAlert, setShowNotExistBoardAlert,] = useState<boolean>(false);

  useEffect(() => {
    if (typeof boardId === 'string') {
      void iricomAPI.getBoard(boardId)
        .catch(() => {
          setPageState(PageState.INVALID_BOARD);
          setShowNotExistBoardAlert(true);
        });
    }
  }, [boardId,]);

  useEffect(() => {
    if (title.length === 0) {
      setPageState(PageState.INVALID);
    } else {
      setPageState(PageState.VALID);
    }
  }, [title,]);

  useEffect(() => {
    console.log(accountAuth);
  }, [accountAuth,]);

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const onChangePostType = (value: PostType) => {
    setType(value);
  };

  const onChangeDisabledComment = (event: ChangeEvent<HTMLInputElement>) => {
    setDisabledComment(event.target.checked);
  };

  const onCloseNotExistBoardAlert = () => {
    setShowNotExistBoardAlert(false);
  };

  const onClickTemporary = () => {
    console.log('onClickTemporary');
    void iricomAPI.createPost(boardId as string, title, content, type, !disabledComment)
      .then(post => {
        console.log(post);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const notExistBoardAlert = <AlertDialog
    motionPreset='slideInBottom'
    size='xs'
    leastDestructiveRef={notExistBoardCancelRef}
    onClose={onCloseNotExistBoardAlert}
    isOpen={isShowNotExistBoardAlert}
    isCentered
  >
    <AlertDialogOverlay/>
    <AlertDialogContent>
      <AlertDialogHeader>저런!</AlertDialogHeader>
      <AlertDialogBody>
        존재하지 않는 게시판입니다.
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button ref={notExistBoardCancelRef} onClick={onCloseNotExistBoardAlert}>
          닫기
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.ACCOUNT}>
      board id: {boardId}
      <VStack alignItems='stretch'>
        <Card shadow='none'>
          <CardBody padding='0.8rem'>
            <VStack alignItems='stretch'>
              <FormControl isRequired>
                <FormLabel>제목</FormLabel>
                <Input autoFocus value={title} onChange={onChangeTitle} isDisabled={pageState === PageState.INVALID_BOARD}></Input>
              </FormControl>
              <FormControl>
                <FormLabel>내용</FormLabel>
                <Textarea placeholder='' height='20rem' value={content} onChange={onChangeContent} isDisabled={pageState === PageState.INVALID_BOARD}/>
              </FormControl>
              {accountAuth === AccountAuth.SYSTEM_ADMIN && <>
                <FormControl>
                  <FormLabel>관리자 설정</FormLabel>
                  <RadioGroup onChange={onChangePostType} defaultValue={defaultPostType} isDisabled={pageState === PageState.INVALID_BOARD}>
                    <HStack>
                      <Radio value={PostType.POST} size='sm'>일반 게시물</Radio>
                      <Radio value={PostType.NOTIFICATION} size='sm'>공지사항 게시물</Radio>
                    </HStack>
                  </RadioGroup>
                  <FormHelperText>공지사항 게시물은 게시판 상단에 고정으로 나타납니다.</FormHelperText>
                </FormControl>
                <FormControl>
                  <Checkbox defaultChecked={defaultDisabledComment} size='sm' onChange={onChangeDisabledComment} isDisabled={pageState === PageState.INVALID_BOARD}>댓글 비활성화</Checkbox>
                  <FormHelperText>댓글을 비활성화 하면 게시물에 댓글을 추가 할 수 없습니다.</FormHelperText>
                </FormControl>
              </>}
              <HStack justifyContent='flex-end'>
                <ButtonGroup size='sm'>
                  <Button
                    variant='outline'
                    isDisabled={pageState === PageState.INVALID || pageState === PageState.INVALID_BOARD}
                    onClick={onClickTemporary}
                  >
                    임시 저장
                  </Button>
                  <Button
                    isDisabled={pageState === PageState.INVALID || pageState === PageState.INVALID_BOARD}
                  >
                    작성
                  </Button>
                </ButtonGroup>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
      {notExistBoardAlert}
    </MainLayout>
  );
};

export default PostCreatePage;
