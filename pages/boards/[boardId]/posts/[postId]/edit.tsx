// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { Card, CardBody, VStack, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../../../../layouts/MainLayout';
import { PostEditor, } from '../../../../../components';
import { InvalidPostAlert, } from '../../../../../components/alerts';
import { useAccountState, useIricomAPI, } from '../../../../../hooks';
// etc
import { AccountAuth, Post, PostState, } from '../../../../../interfaces';

const BoardsPostsEditPage = () => {
  const router = useRouter();
  const [_loginState, accountAuth,] = useAccountState();
  const iricomAPI = useIricomAPI();

  const boardId: string = router.query.boardId as string;
  const postId: string = router.query.postId as string;

  const [post, setPost,] = useState<Post | null>(null);
  const [isOpenInvalidPostAlert, setOpenInvalidPostAlert,] = useState<boolean>(false);

  useEffect(() => {
    if (boardId && postId) {
      void init();
    }
  }, [boardId, postId,]);

  const init = async () => {
    let post: Post;
    try {
      post = await iricomAPI.getPost(boardId, postId, PostState.TEMPORARY);
    } catch (error) {
      try {
        post = await iricomAPI.getPost(boardId, postId, PostState.PUBLISH);
      } catch (error) {
        setOpenInvalidPostAlert(true);
      }
    }

    setPost(post);
  };

  const onCloseInvalidPostAlert = () => {
    setOpenInvalidPostAlert(false);
  };

  const onRequest = (postState: PostState, post: Post) => {
    if (postState === PostState.TEMPORARY) {

    } else { // POST.PUBLISH

    }
  };

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.ACCOUNT}>
      <VStack alignItems='stretch'>
        <Card>
          <CardBody>
            {!post && <PostEditor accountAuth={accountAuth} disabled={true}/>}
            {post && <PostEditor accountAuth={accountAuth} defaultValue={post} boardId={boardId as string} onRequest={onRequest}/>}
          </CardBody>
        </Card>
      </VStack>
      <InvalidPostAlert isOpen={isOpenInvalidPostAlert} onClose={onCloseInvalidPostAlert}/>
    </MainLayout>
  );
};

export default BoardsPostsEditPage;
