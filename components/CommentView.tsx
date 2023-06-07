// react
import { useState, } from 'react';
import { Box, Button, ButtonGroup, Card, CardBody, HStack, IconButton, Spacer, Text, VStack, useToast, } from '@chakra-ui/react';
import { MdDeleteOutline, MdEdit, MdThumbDownOffAlt, MdThumbUpOffAlt, } from 'react-icons/md';
import { useIricomAPI, } from '../hooks';
import { RequireLoginAlert, } from '../components/alerts';
// store
import { useRecoilValue, } from 'recoil';
import { myAccountAtom, } from '../recoil';
// etc
import { Account, Comment, NotExistTokenError, VoteType, } from '../interfaces';
import CommentEditor from './CommentEditor';
import { getFormattedDateTime, } from '../utils';

type Props = {
  boardId: string,
  postId: string,
  comment: Comment,
  allowNestedComment?: boolean,
  onChange?: (comment: Comment) => void,
}

enum ViewState {
  IDLE,
  REQUEST,
}

const CommentView = ({
  boardId,
  postId,
  comment,
  allowNestedComment = false,
  onChange = () => {},
}: Props) => {
  const iricomAPI = useIricomAPI();
  const toast = useToast();

  const account: Account | null = useRecoilValue<Account | null>(myAccountAtom);
  const [viewState, setViewState,] = useState<ViewState>(ViewState.IDLE);
  const [showCommentEditor, setShowCommentEditor,] = useState<boolean>(false);
  const [showLoginAlert, setShowLoginAlert,] = useState<boolean>(false);

  const onClickReReply = () => {
    setShowCommentEditor(!showCommentEditor);
  };

  const onClickUpvote = () => {
    setViewState(ViewState.REQUEST);
    void iricomAPI.voteComment(boardId, postId, comment.id, VoteType.UP)
      .then((comment) => {
        onChange(comment);
      })
      .catch((error: Error) => {
        if (error instanceof NotExistTokenError) {
          setShowLoginAlert(true);
        } else {
          toast({
            title: '이미 \'좋아요\'한 댓글입니다.',
            status: 'warning',
            duration: 3000,
          });
        }
      })
      .finally(() => {
        setViewState(ViewState.IDLE);
      });
  };

  const onClickDownvote = () => {
    setViewState(ViewState.REQUEST);
    void iricomAPI.voteComment(boardId, postId, comment.id, VoteType.DOWN)
      .then((comment) => {
        onChange(comment);
      })
      .catch((error: Error) => {
        if (error instanceof NotExistTokenError) {
          setShowLoginAlert(true);
        } else {
          toast({
            title: '이미 \'싫어요\'한 댓글입니다.',
            status: 'warning',
            duration: 3000,
          });
        }
      })
      .finally(() => {
        setViewState(ViewState.IDLE);
      });
  };

  const onClickRequireLoginAlertClose = () => {
    setShowLoginAlert(false);
  };

  return (
    <Box>
      <VStack alignItems='stretch'>
        <HStack>
          <VStack alignItems='stretch'>
            <Text fontSize='.8rem'>{comment.account.nickname}</Text>
            <Text fontSize='.6rem'>{getFormattedDateTime(comment.createDate)}</Text>
          </VStack>
          <Spacer/>
          {account && account.id === comment.account.id && <ButtonGroup size='xs' variant='outline' justifyContent='flex-end'>
            <IconButton variant='ghost' aria-label='edit' icon={<MdEdit/>}/>
            <IconButton variant='ghost' aria-label='delete' icon={<MdDeleteOutline/>}/>
          </ButtonGroup>}
        </HStack>
        <Text fontSize='.8rem' wordBreak='break-word'>{comment.content}</Text>
        <HStack>
          {allowNestedComment && <Button size='xs' onClick={onClickReReply}>답글</Button>}
          <Spacer/>
          <ButtonGroup size='xs' variant='ghost'>
            <Button
              rightIcon={<MdThumbUpOffAlt/>}
              onClick={onClickUpvote}
              isDisabled={viewState === ViewState.REQUEST}
            >
              {comment.upvote}
            </Button>
            <Button
              rightIcon={<MdThumbDownOffAlt/>}
              onClick={onClickDownvote}
              isDisabled={viewState === ViewState.REQUEST}
            >
              {comment.downvote}
            </Button>
          </ButtonGroup>
        </HStack>
      </VStack>
      {showCommentEditor && <Box marginTop='0.8rem'>
        <CommentEditor boardId={boardId} postId={postId} referenceCommentId={comment.id} onChange={onChange} autoFocus/>
      </Box>}
      {comment.nestedComments && comment.nestedComments.map((nestedComment, index) => (
        <Card shadow='none' backgroundColor='gray.50' marginTop='.5rem' key={index}>
          <CardBody padding='.5rem'>
            <CommentView boardId={boardId} postId={postId} comment={nestedComment} onChange={onChange}/>
          </CardBody>
        </Card>
      ))}
      <RequireLoginAlert
        isOpen={showLoginAlert}
        text='좋아요/싫어요 하기 위해서는 로그인이 필요합니다.'
        successURL={`/boards/${boardId}/posts/${postId}`}
        onClose={onClickRequireLoginAlertClose}
      />
    </Box>
  );
};

export default CommentView;
