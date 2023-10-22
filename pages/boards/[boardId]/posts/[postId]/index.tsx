// react
import { useEffect, useState, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { Alert, AlertIcon, Card, CardBody, Divider, VStack, AlertDescription, } from '@chakra-ui/react';

import { PageBody, } from '../../../../../layouts';
import MainLayout from '../../../../../layouts/MainLayout';
import { BoardTitle, CommentEditor, CommentView, PostView, } from '../../../../../components';
import { useIricomAPI, } from '../../../../../hooks';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '../../../../../recoil';

// etc
import { Account, Board, Comment, CommentList, Post, PostState, TokenInfo, } from '../../../../../interfaces';
import { BORDER_RADIUS, } from '../../../../../constants/style';
import iricomAPI from '../../../../../utils/iricomAPI';
import { getTokenInfoByCookies, } from '../../../../../utils';

type Props = {
  account: Account | null,
  board: Board,
  post: Post,
  commentList: CommentList,
};

const BoardsPostsPage = (props: Props) => {
  const iricomAPI = useIricomAPI();

  const board: Board = Object.assign(new Board(), props.board);
  const [post, setPost,] = useState<Post | null>(props.post);
  const [commentList, setCommentList,] = useState<Comment[] | null>(Object.assign(new CommentList(), props.commentList).comments);

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);
  const boardId: string = board.id;
  const postId: string = post.id;

  useEffect(() => {
    setAccount(props.account);
  }, []);

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

  const getCommentListElement = (commentList: Comment[]) => {
    const elementList: JSX.Element[] = [];
    for (let index = 0; index < commentList.length; index++) {
      const comment: Comment = commentList[index];
      elementList.push(<CommentView
        key={index}
        boardId={boardId}
        postId={postId}
        comment={comment}
        allowNestedComment={true}
        onChange={onChangeCommentView}
      />);
      if (index < commentList.length - 1) {
        elementList.push(<Divider key={`divider-${index}`}/>);
      }
    }
    return elementList;
  };

  return (
    <MainLayout>
      <PageBody>
        {board && <BoardTitle board={board}/>}
        {post && <Card
          width='100%'
          shadow={{ base: 'none', md: 'sm', }}
          borderRadius={{ base: '0', md: BORDER_RADIUS, }}
        >
          <CardBody>
            <PostView
              post={post}
              onChange={onChangePostView}
              isShowVote={true}
              isShowShare={true}
              isShowReport={true}
              isShowBan={board.boardAdmin ? board.boardAdmin : false}
            />
          </CardBody>
        </Card>}
        {commentList && commentList.length > 0 && <Card
          marginTop='1rem'
          width='100%'
          shadow={{ base: 'none', md: 'sm', }}
          borderRadius={{ base: '0', md: BORDER_RADIUS, }}
        >
          <CardBody>
            <VStack align='stretch' spacing='1rem'>
              {getCommentListElement(commentList)}
            </VStack>
          </CardBody>
        </Card>}

        {!post.ban && post.allowComment && <Card
          marginTop='1rem'
          marginBottom='1rem'
          width='100%'
          shadow={{ base: 'none', md: 'sm', }}
          borderRadius={{ base: '0', md: BORDER_RADIUS, }}
        >
          <CardBody>
            <CommentEditor boardId={boardId} postId={postId} onChange={onChangeCommentView}/>
          </CardBody>
        </Card>}

        {post && !post.allowComment && <Card
          marginTop='1rem'
          marginBottom='1rem'
          width='100%'
          shadow={{ base: 'none', md: 'sm', }}
          borderRadius={{ base: '0', md: BORDER_RADIUS, }}
        >
          <CardBody>
            <Alert status='warning' borderRadius='.5rem'>
              <AlertIcon/>
              <AlertDescription>댓글을 허용하지 않는 게시물입니다.</AlertDescription>
            </Alert>
          </CardBody>
        </Card>}
      </PageBody>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  const boardId: string = context.query.boardId as string;
  const postId: string = context.query.postId as string;

  const apiRequestList: any[] = [
    iricomAPI.getMyAccount(tokenInfo),
    iricomAPI.getBoard(tokenInfo, boardId),
    iricomAPI.getPost(tokenInfo, boardId, postId, PostState.PUBLISH),
    iricomAPI.getCommentList(tokenInfo, boardId, postId),
  ];

  const responseList: any[] = await Promise.allSettled(apiRequestList);

  const account: Account | null = responseList[0].status === 'fulfilled' ? responseList[0].value as Account : null;

  const board: Board = responseList[1].value as Board;
  const post: Post = responseList[2].value as Post;

  let commentList: CommentList;
  if (responseList[3].status === 'fulfilled') {
    commentList = responseList[3].value as CommentList;
  } else { // status === 'reject'
    commentList = new CommentList();
  }

  return {
    props: {
      account: account,
      board: JSON.parse(JSON.stringify(board)),
      post: JSON.parse(JSON.stringify(post)),
      commentList: JSON.parse(JSON.stringify(commentList)),
    },
  };
};

export default BoardsPostsPage;
