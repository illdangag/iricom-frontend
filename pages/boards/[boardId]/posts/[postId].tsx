// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { Alert, AlertIcon, AlertTitle, Card, CardBody, useMediaQuery, VStack, } from '@chakra-ui/react';
import { PageBody, } from '../../../../layouts';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { CommentEditor, CommentView, PostView, BoardHeader, } from '../../../../components';
import { useIricomAPI, } from '../../../../hooks';
// etc
import { Board, Comment, Post, PostState, } from '../../../../interfaces';
import { BORDER_RADIUS, MOBILE_MEDIA_QUERY, } from '../../../../constants/style';

const BoardsPostsPage = () => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();
  const [isMobile,] = useMediaQuery(MOBILE_MEDIA_QUERY, {
    ssr: true,
    fallback: false,
  });

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
      <PageBody>
        {board && <BoardHeader board={board}/>}
        {post && <Card
          width='100%'
          shadow={isMobile ? 'none' : 'sm'}
          borderRadius={isMobile ? '0' : BORDER_RADIUS}
        >
          <CardBody>
            <PostView post={post} onChange={onChangePostView}/>
          </CardBody>
        </Card>}
        {commentList && <Card
          marginTop='1rem'
          width='100%'
          shadow={isMobile ? 'none' : 'sm'}
          borderRadius={isMobile ? '0' : BORDER_RADIUS}
        >
          <CardBody>
            <VStack align='stretch' spacing='1rem'>
              {commentList.map((comment, index) => (
                <CommentView
                  key={index}
                  boardId={boardId}
                  postId={postId}
                  comment={comment}
                  allowNestedComment={true}
                  onChange={onChangeCommentView}
                />
              ))}
            </VStack>

          </CardBody>
        </Card>}
        {post && post.isAllowComment && <Card
          marginTop='1rem'
          width='100%'
          shadow={isMobile ? 'none' : 'sm'}
          borderRadius={isMobile ? '0' : BORDER_RADIUS}
        >
          <CardBody>
            <CommentEditor boardId={boardId} postId={postId} onChange={onChangeCommentView}/>
          </CardBody>
        </Card>}
        {post && !post.isAllowComment && <Card
          marginTop='1rem'
          width='100%'
          shadow={isMobile ? 'none' : 'sm'}
          borderRadius={isMobile ? '0' : BORDER_RADIUS}
        >
          <CardBody>
            <Alert status='warning' borderRadius='.5rem'>
              <AlertIcon/>
              <AlertTitle>댓글을 허용하지 않는 게시물입니다.</AlertTitle>
            </Alert>
          </CardBody>
        </Card>}
      </PageBody>
    </MainLayout>
  );
};

export default BoardsPostsPage;
