// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { Alert, AlertIcon, AlertTitle, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Card, CardBody, HStack, VStack, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { CommentEditor, CommentView, PostView, } from '../../../../components';
import { MdCreate, } from 'react-icons/md';
import { useIricomAPI, } from '../../../../hooks';
// etc
import { Board, Comment, Post, PostState, } from '../../../../interfaces';

const BoardsPostsPage = () => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();

  const boardId: string = router.query.boardId as string;
  const postId: string = router.query.postId as string;

  const [post, setPost,] = useState<Post | null>(null);
  const [board, setBoard,] = useState<Board | null>(null);
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
        // TODO error
      });

    void iricomAPI.getBoard(boardId)
      .then(board => {
        setBoard(board);
      })
      .catch(() => {
        // TODO error
      });
  };

  const initCommentList = (boardId: string, postId: string) => {
    void iricomAPI.getCommentList(boardId, postId)
      .then(commentList => {
        setCommentList(commentList.comments);
      })
      .catch(() => {
        // TODO error
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
      <Card shadow='none' borderRadius='0'>
        {boardId && <CardBody paddingTop='.6rem' paddingBottom='.6rem'>
          <HStack justifyContent='space-between'>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>이리콤</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                {board && <BreadcrumbLink href={`/boards/${board.id}`}>{board.title}</BreadcrumbLink>}
              </BreadcrumbItem>
            </Breadcrumb>
          </HStack>
        </CardBody>}
      </Card>
      <VStack alignItems='stretch' spacing='1rem' marginTop='1rem' marginLeft='auto' marginRight='auto' paddingLeft='1rem' paddingRight='1rem' maxWidth='60rem'>
        {post && <PostView post={post} onChange={onChangePostView}/>}
        {commentList && commentList.map((comment, index) =>
          <Card shadow='none' key={index}>
            <CardBody>
              <CommentView boardId={boardId} postId={postId} comment={comment} allowNestedComment={true} onChange={onChangeCommentView}/>
            </CardBody>
          </Card>)}
        {post && post.isAllowComment && <Card shadow='none'>
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
