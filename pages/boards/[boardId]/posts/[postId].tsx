// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { Card, CardBody, VStack, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { CommentView, PostView, CommentEditor, } from '../../../../components';
import { useIricomAPI, } from '../../../../hooks';
// etc
import { Post, PostState, Comment, } from '../../../../interfaces';

const BoardsPostsPage = () => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();

  const boardId: string = router.query.boardId as string;
  const postId: string = router.query.postId as string;

  const [post, setPost,] = useState<Post | null>(null);
  const [commentList, setCommentList,] = useState<Comment[] | null>(null);

  useEffect(() => {
    if (boardId && postId) {
      void iricomAPI.getPost(boardId, postId, PostState.PUBLISH)
        .then(post => {
          setPost(post);
        })
        .catch((error) => {
          console.log(error);
        });
      void iricomAPI.getCommentList(boardId, postId)
        .then(commentList => {
          setCommentList(commentList.comments);
        });
    }
  }, [boardId, postId,]);

  return (
    <MainLayout loginState={LoginState.ANY}>
      <VStack alignItems='stretch'>
        {post && <PostView post={post}/>}
        {commentList && commentList.length > 0 && <CommentView commentList={commentList}/>}
        <Card shadow='none'>
          <CardBody>
            <CommentEditor boardId={boardId} postId={postId}/>
          </CardBody>
        </Card>
      </VStack>

    </MainLayout>
  );
};

export default BoardsPostsPage;
