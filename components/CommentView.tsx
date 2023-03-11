// react
import { useState, } from 'react';
import { Box, Button, ButtonGroup, Card, CardBody, HStack, IconButton, Spacer, Text, VStack,
  useToast, } from '@chakra-ui/react';
import { MdDeleteOutline, MdEdit, MdThumbDownOffAlt, MdThumbUpOffAlt, } from 'react-icons/md';
import { useIricomAPI, } from '../hooks';
// store
import { useRecoilValue, } from 'recoil';
import { myAccountAtom, } from '../recoil';
// etc
import { Account, Comment, VoteType, } from '../interfaces';
import CommentEditor from './CommentEditor';

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

  const onClickReReply = () => {
    setShowCommentEditor(!showCommentEditor);
  };

  const getCommentDate = (time: Date): string => {
    const postDate: Date = new Date(time);
    const year: number = postDate.getFullYear();
    const month: number = postDate.getMonth() + 1;
    const date: number = postDate.getDate();
    let hour: number = postDate.getHours();
    const minute: number = postDate.getMinutes();

    return `${year}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date} ${hour >= 10 ? hour : '0' + hour}:${minute}`;
  };

  const onClickUpvote = () => {
    setViewState(ViewState.REQUEST);
    void iricomAPI.voteComment(boardId, postId, comment.id, VoteType.UP)
      .then((comment) => {
        onChange(comment);
      })
      .catch(() => {
        toast({
          title: '이미 \'좋아요\'한 댓글입니다.',
          status: 'warning',
          duration: 3000,
        });
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
      .catch(() => {
        toast({
          title: '이미 \'싫어요\'한 댓글입니다.',
          status: 'warning',
          duration: 3000,
        });
      })
      .finally(() => {
        setViewState(ViewState.IDLE);
      });
  };

  return (
    <Box>
      <VStack alignItems='stretch'>
        <HStack>
          <VStack alignItems='stretch'>
            <Text fontSize='.8rem'>{comment.account.nickname}</Text>
            <Text fontSize='.6rem'>{getCommentDate(comment.createDate)}</Text>
          </VStack>
          <Spacer/>
          {account && account.id === comment.account.id && <ButtonGroup size='xs' variant='outline' justifyContent='flex-end'>
            <IconButton aria-label='edit' icon={<MdEdit/>}/>
            <IconButton aria-label='delete' icon={<MdDeleteOutline/>}/>
          </ButtonGroup>}
        </HStack>
        <Text fontSize='.8rem' wordBreak='break-word'>{comment.content}</Text>
        <HStack>
          {allowNestedComment && <Button size='xs' onClick={onClickReReply}>답글</Button>}
          <Spacer/>
          <ButtonGroup size='xs' variant='outline'>
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
    </Box>
  );
};

export default CommentView;
