// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { Card, CardBody, VStack, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { PostEditor, } from '../../../../components';
import { NotExistBoardAlert, } from '../../../../components/alerts';
import { useAccountState, useIricomAPI, } from '../../../../hooks';
// etc
import { AccountAuth, PostState, PostType, } from '../../../../interfaces';

enum PageState {
  INVALID,
  VALID,
  INVALID_BOARD,
}

const PostCreatePage = () => {
  const router = useRouter();
  const [_loginState, accountAuth,] = useAccountState();
  const iricomAPI = useIricomAPI();

  const { boardId, } = router.query;
  const [pageState, setPageState,] = useState<PageState>(PageState.INVALID);
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

  const onCloseNotExistBoardAlert = () => {
    setShowNotExistBoardAlert(false);
  };

  // const onClickTemporary = () => {
  //   void iricomAPI.createPost(boardId as string, title, content, type, !disabledComment)
  //     .then(post => {
  //       console.log(post);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };

  const onChangePostEditor = (title: string, content: string, postType: PostType, isDisabledComment: boolean, status: PostState) => {
    console.log(title, content, postType, isDisabledComment, status);
  };

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.ACCOUNT}>
      <VStack alignItems='stretch'>
        <Card>
          <CardBody>
            <PostEditor accountAuth={accountAuth} disabled={pageState === PageState.INVALID_BOARD} onChange={onChangePostEditor}/>
          </CardBody>
        </Card>
      </VStack>
      <NotExistBoardAlert isOpen={isShowNotExistBoardAlert} onClose={onCloseNotExistBoardAlert}/>
    </MainLayout>
  );
};

export default PostCreatePage;
