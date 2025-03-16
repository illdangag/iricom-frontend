// react
import { useState, MouseEvent, } from 'react';
import {
  Badge, Box, Button, ButtonGroup, Card, CardBody, Divider, HStack, IconButton, Link, Menu, MenuButton, MenuItem, MenuList, Spacer, Text, useToast, VStack,
} from '@chakra-ui/react';
import { MdDeleteOutline, MdEdit, MdThumbDownOffAlt, MdThumbUpOffAlt, } from 'react-icons/md';
import { useIricom, } from '../hooks';
// store
import { useRecoilValue, useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '../recoil';
import requireLoginPopupAtom, { RequireLoginPopup, } from '../recoil/requireLoginPopup';
// etc
import { Account, Comment, IricomError, NotExistTokenError, VoteType, } from '../interfaces';
import CommentEditor from './CommentEditor';
import { getFormattedDateTime, } from '../utils';

type Props = {
  boardId: string,
  postId: string,
  comment: Comment,
  allowNestedComment?: boolean,
  onChange?: (comment: Comment) => void,
  onClickDelete?: (event: MouseEvent<HTMLButtonElement>, comment: Comment) => void,
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
  onClickDelete = () => {},
}: Props) => {
  const iricomAPI = useIricom();
  const toast = useToast();

  const account: Account | null = useRecoilValue<Account | null>(myAccountAtom);
  const setRequireLoginPopup = useSetRecoilState<RequireLoginPopup>(requireLoginPopupAtom);
  const [viewState, setViewState,] = useState<ViewState>(ViewState.IDLE);
  const [showCommentEditor, setShowCommentEditor,] = useState<boolean>(false);

  const onClickReReply = () => {
    setShowCommentEditor(!showCommentEditor);
  };

  const onClickUpvote = async () => {
    setViewState(ViewState.REQUEST);

    try {
      const updatedComment: Comment = await iricomAPI.voteComment(boardId, postId, comment.id, VoteType.UP);
      onChange(updatedComment);
    } catch (error) {
      if (error instanceof NotExistTokenError) {
        setRequireLoginPopup({
          isShow: true,
          message: '\'좋아요\' 하기 위해서는 로그인이 필요합니다.',
          successURL: `/boards/${boardId}/posts/${postId}`,
        });
      } else {
        const iricomError: IricomError = error as IricomError;
        toast({
          title: iricomError.message,
          status: 'warning',
          duration: 3000,
        });
      }
    } finally {
      setViewState(ViewState.IDLE);
    }
  };

  const onClickDownvote = async () => {
    setViewState(ViewState.REQUEST);

    try {
      const updateComment: Comment = await iricomAPI.voteComment(boardId, postId, comment.id, VoteType.DOWN);
      onChange(updateComment);
    } catch (error) {
      if (error instanceof NotExistTokenError) {
        setRequireLoginPopup({
          isShow: true,
          message: '\'싫어요\' 하기 위해서는 로그인이 필요합니다.',
          successURL: `/boards/${boardId}/posts/${postId}`,
        });
      } else {
        const iricomError: IricomError = error as IricomError;
        toast({
          title: iricomError.message,
          status: 'warning',
          duration: 3000,
        });
      }
    } finally {
      setViewState(ViewState.IDLE);
    }
  };

  const getNestedCommentListElement = (commentList: Comment[]) => {
    const elementList: JSX.Element[] = [];
    for (let index = 0; index < commentList.length; index++) {
      const comment: Comment = commentList[index];
      elementList.push(<CommentView
        key={index}
        boardId={boardId}
        postId={postId}
        comment={comment}
        onChange={onChange}
        onClickDelete={(event) => onClickDelete(event, comment)}
      />);
      if (index < commentList.length - 1) {
        elementList.push(<Divider key={`divider-${index}`}/>);
      }
    }
    return elementList;
  };

  return (
    <Box>
      <VStack alignItems='stretch'>
        <HStack>
          <VStack alignItems='stretch'>
            <Box>
              <Menu size='sm'>
                <MenuButton as={Text} fontSize='.8rem'>{comment.account.nickname}</MenuButton>
                <MenuList fontSize='0.8rem'>
                  <Link href={`/message/create?to=${comment.account.id}`} _hover={{ textDecoration: 'none', }}>
                    <MenuItem>쪽지 보내기</MenuItem>
                  </Link>
                </MenuList>
              </Menu>
            </Box>
            <Text fontSize='.6rem'>{getFormattedDateTime(comment.createDate)}</Text>
          </VStack>
          <Spacer/>
          {account && account.id === comment.account.id && <ButtonGroup size='xs' variant='outline' justifyContent='flex-end'>
            <IconButton variant='ghost' aria-label='edit' icon={<MdEdit/>}/>
            {!comment.deleted && <IconButton
              variant='ghost'
              aria-label='delete'
              icon={<MdDeleteOutline/>}
              onClick={(event) => onClickDelete(event, comment)}
            />}
          </ButtonGroup>}
        </HStack>
        <Text fontSize='.8rem' wordBreak='break-word'>{comment.content}</Text>
        {comment.deleted && <Box padding='0' margin='0'>
          <Badge colorScheme='red' fontSize='0.8rem'>삭제된 댓글입니다</Badge>
        </Box>}
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
      {comment.nestedComments && <Card shadow='none' backgroundColor='gray.50' marginTop='.5rem'>
        <CardBody>
          <VStack align='stretch' spacing='.8rem'>
            {getNestedCommentListElement(comment.nestedComments)}
          </VStack>
        </CardBody>
      </Card>}
      {showCommentEditor && <Box marginTop='0.8rem'>
        <CommentEditor boardId={boardId} postId={postId} referenceCommentId={comment.id} onChange={onChange} autoFocus/>
      </Box>}
    </Box>
  );
};

export default CommentView;
