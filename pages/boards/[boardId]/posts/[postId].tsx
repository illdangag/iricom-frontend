// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { PostPreview, } from '../../../../components';
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
          setPost(post);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [boardId, postId,]);

  return (
    <MainLayout loginState={LoginState.ANY}>
      {post && post.id}
      {post && post.title}
      {post && post.content}
      {post && <PostPreview post={post}/>}
    </MainLayout>
  );
};

export default BoardsPostsPage;
