// react
import { useState, } from 'react';
import { useRouter, } from 'next/router';
import { Alert, AlertIcon, AlertTitle, Card, CardBody, useMediaQuery, VStack, } from '@chakra-ui/react';
import { PageBody, } from '../../../../layouts';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { BoardHeader, CommentEditor, CommentView, PostView, } from '../../../../components';
import { useIricomAPI, } from '../../../../hooks';
// etc
import { Board, Comment, CommentList, Post, PostState, } from '../../../../interfaces';
import { BORDER_RADIUS, MOBILE_MEDIA_QUERY, } from '../../../../constants/style';
import { GetServerSideProps, } from 'next/types';
import iricomAPI from '../../../../utils/iricomAPI';

type Props = {
  board: Board,
  post: Post,
  commentList: CommentList,
};

const BoardsPostsPage = (props: Props) => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();
  const [isMobile,] = useMediaQuery(MOBILE_MEDIA_QUERY, {
    ssr: true,
    fallback: false,
  });

  const boardId: string = router.query.boardId as string;
  const postId: string = router.query.postId as string;

  const board: Board = Object.assign(new Board(), props.board);
  const [post, setPost,] = useState<Post | null>(props.post);
  const [commentList, setCommentList,] = useState<Comment[] | null>(Object.assign(new CommentList(), props.commentList).comments);

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
        {commentList && commentList.length > 0 && <Card
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
          marginBottom='1rem'
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
          marginBottom='1rem'
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const boardId: string = context.query.boardId as string;
  const postId: string = context.query.postId as string;

  const board: Board = await iricomAPI.getBoard(boardId);
  const post: Post = await iricomAPI.getPost(boardId, postId, PostState.PUBLISH, null);
  const commentList: CommentList = await iricomAPI.getCommentList(boardId, postId);

  return {
    props: {
      board: JSON.parse(JSON.stringify(board)),
      post: JSON.parse(JSON.stringify(post)),
      commentList: JSON.parse(JSON.stringify(commentList)),
    },
  };
};

export default BoardsPostsPage;
