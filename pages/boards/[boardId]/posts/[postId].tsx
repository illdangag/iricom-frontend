// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { Card, CardBody, VStack, Alert, AlertIcon, AlertTitle, } from '@chakra-ui/react';
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
      initPost(boardId, postId);
    }
  }, [boardId, postId,]);

  const initPost = (boardId: string, postId: string) => {
    void iricomAPI.getPost(boardId, postId, PostState.PUBLISH)
      .then(post => {
        setPost(post);
        if (post.isAllowComment) {
          initCommentList(boardId, postId);
        }
      })
      .catch(() => {
        // TODO
      });
  };

  const initCommentList = (boardId: string, postId: string) => {
    void iricomAPI.getCommentList(boardId, postId)
      .then(commentList => {
        setCommentList(commentList.comments);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const onChangePostView = (post: Post) => {
    setPost(post);
  };

  const onChangeCommentView = (comment: Comment) => {
    const newCommentList: Comment[] = updateComment([...commentList,], comment);
    setCommentList(newCommentList);
    initCommentList(boardId, postId);
  };

  const updateComment = (commentList: Comment[], newComment: Comment) => {
    const length: number = commentList.length;
    for (let index = 0; index < length; index++) {
      const comment: Comment = commentList[index];
      if (comment.id === newComment.id) {
        commentList[index] = newComment;
        return [...commentList,];
      }
      if (comment.nestedComments && comment.nestedComments.length > 0) {
        comment.nestedComments = updateComment(comment.nestedComments, newComment);
      }
    }
    return commentList;
  };

  return (
    <MainLayout loginState={LoginState.ANY}>
      <VStack alignItems='stretch' spacing='1rem'>
        {post && <PostView post={post} onChange={onChangePostView}/>}
        {commentList && commentList.map((comment, index) =>
          <Card shadow='none' key={index} borderRadius='0'>
            <CardBody>
              <CommentView boardId={boardId} postId={postId} comment={comment} allowNestedComment={true} onChange={onChangeCommentView}/>
            </CardBody>
          </Card>)}
        {post && post.isAllowComment && <Card shadow='none' borderRadius='0'>
          <CardBody>
            <CommentEditor boardId={boardId} postId={postId} onChange={onChangeCommentView}/>
          </CardBody>
        </Card>}
        {post && !post.isAllowComment && <Card shadow='none'>
          <CardBody>
            <Alert status='warning' borderRadius='.5rem'>
              <AlertIcon/>
              <AlertTitle>댓글을 허용하지 않는 게시물입니다.</AlertTitle>
            </Alert>
          </CardBody>
        </Card>}
      </VStack>
    </MainLayout>
  );
};

export default BoardsPostsPage;
