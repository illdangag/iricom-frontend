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
      init(boardId, postId);
    }
  }, [boardId, postId,]);

  const init = (boardId: string, postId: string) => {
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
  };

  const onChangePostView = (post: Post) => {
    setPost(post);
  };

  const onChangeCommentView = (comment: Comment) => {
    const newCommentList: Comment[] = updateComment([...commentList,], comment);
    setCommentList(newCommentList);
    init(boardId, postId);
  };

  const updateComment = (commentList: Comment[], newComment: Comment) => {
    const length: number = commentList.length;
    for (let index = 0; index < length; index++) {
      const comment: Comment = commentList[index];
      if (comment.id === newComment.id) {
        commentList[index] = newComment;
        return [...commentList];
      }
      if (comment.nestedComments && comment.nestedComments.length > 0) {
        comment.nestedComments = updateComment(comment.nestedComments, newComment);
      }
    }
    return commentList;
  };

  return (
    <MainLayout loginState={LoginState.ANY}>
      <VStack alignItems='stretch'>
        {post && <PostView post={post} onChange={onChangePostView}/>}
        {commentList && commentList.map((comment, index) =>
          <Card shadow='none' key={index}>
            <CardBody>
              <CommentView boardId={boardId} postId={postId} comment={comment} allowNestedComment={true} onChange={onChangeCommentView}/>
            </CardBody>
          </Card>)}
        <Card shadow='none'>
          <CardBody>
            <CommentEditor boardId={boardId} postId={postId} onChange={onChangeCommentView}/>
          </CardBody>
        </Card>
      </VStack>
    </MainLayout>
  );
};

export default BoardsPostsPage;
