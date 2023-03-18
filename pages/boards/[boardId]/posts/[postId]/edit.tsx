// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { Card, CardBody, VStack, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../../../../layouts/MainLayout';
import { PostEditor, } from '../../../../../components';
import { InvalidPostAlert, PostPublishAlert, } from '../../../../../components/alerts';
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
  const [publishPost, setPublishPost,] = useState<Post | null>(null);
  const [isOpenInvalidPostAlert, setOpenInvalidPostAlert,] = useState<boolean>(false);
  const [isOpenPostPublishAlert, setOpenPostPublishAlert,] = useState<boolean>(false);

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

  const onClosePostPublishAlert = () => {
    setOpenPostPublishAlert(false);
  };

  const onRequest = (postState: PostState, post: Post) => {
    if (postState === PostState.TEMPORARY) {
      // TODO 임시 저장에 성공한 메시지를 나타내야 함
    } else { // POST.PUBLISH
      setPublishPost(post);
      setOpenPostPublishAlert(true);
    }
  };

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.ACCOUNT}>
      <VStack alignItems='stretch'>
        <Card>
          <CardBody>
            {!post && <PostEditor
              accountAuth={accountAuth}
              disabled={true}
            />}
            {post && <PostEditor
              accountAuth={accountAuth}
              defaultValue={post}
              boardId={boardId}
              onRequest={onRequest}
            />}
          </CardBody>
        </Card>
      </VStack>
      <InvalidPostAlert isOpen={isOpenInvalidPostAlert} onClose={onCloseInvalidPostAlert}/>
      {publishPost && <PostPublishAlert
        isOpen={isOpenPostPublishAlert}
        post={publishPost}
        onClose={onClosePostPublishAlert}
      />}
    </MainLayout>
  );
};

export default BoardsPostsEditPage;
