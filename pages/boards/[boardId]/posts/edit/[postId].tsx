// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { Card, CardBody, VStack, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../../../../layouts/MainLayout';
import { PostEditor, } from '../../../../../components';
import { useIricomAPI, useAccountState, } from '../../../../../hooks';
// etc
import { AccountAuth, PostState, Post, } from '../../../../../interfaces';

const BoardsPostsEditPage = () => {
  const router = useRouter();
  const [_loginState, accountAuth,] = useAccountState();
  const iricomAPI = useIricomAPI();

  const { boardId, postId, } = router.query;

  const [post, setPost,] = useState<Post | null>(null);

  useEffect(() => {
    if (typeof boardId === 'string' && typeof postId === 'string'
      && boardId && postId) {
      void iricomAPI.getPost(boardId, postId, PostState.TEMPORARY)
        .then(post => {
          setPost(post);
        })
        .catch(() => {

        });
    }
  }, [boardId, postId,]);

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.ACCOUNT}>
      <div>{boardId}</div>
      <div>{postId}</div>
      <VStack alignItems='stretch'>
        <Card>
          <CardBody>
            {post && <PostEditor accountAuth={accountAuth} defaultValue={post}/>}
          </CardBody>
        </Card>
      </VStack>
    </MainLayout>
  );
};

export default BoardsPostsEditPage;
