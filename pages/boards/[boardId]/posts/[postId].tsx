// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { useIricomAPI, } from '../../../../hooks';
// etc
import { Post, PostState, } from '../../../../interfaces';

const BoardsPostsPage = () => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();

  const boardId: string = router.query.boardId as string;
  const postId: string = router.query.postId as string;

  const [post, setPost,] = useState<Post | null>(null);

  useEffect(() => {
    if (boardId && postId) {
      void iricomAPI.getPost(boardId, postId, PostState.PUBLISH)
        .then(post => {
          console.log(post);
        });
    }
  }, [boardId, postId,]);

  return (
    <MainLayout loginState={LoginState.ANY}>

    </MainLayout>
  );
};

export default BoardsPostsPage;
