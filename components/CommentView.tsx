// react
import { useState, } from 'react';
import { Button, ButtonGroup, Card, CardBody, HStack, IconButton, Spacer, Text, VStack, Box, Divider, } from '@chakra-ui/react';
import { MdThumbDownOffAlt, MdThumbUpOffAlt, MdEdit, MdDeleteOutline, } from 'react-icons/md';
// store
import { useRecoilValue, } from 'recoil';
import { myAccountAtom, } from '../recoil';
// etc
import { Comment, Account, } from '../interfaces';
import CommentEditor from './CommentEditor';

type Props = {
  boardId: string,
  postId: string,
  comment: Comment,
  allowNestedComment?: boolean,
}
const CommentView = ({
  boardId,
  postId,
  comment,
  allowNestedComment = false,
}: Props) => {

  const account: Account | null = useRecoilValue<Account | null>(myAccountAtom);
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
            <Button rightIcon={<MdThumbUpOffAlt/>}>{comment.upvote}</Button>
            <Button rightIcon={<MdThumbDownOffAlt/>}>{comment.downvote}</Button>
          </ButtonGroup>
        </HStack>
      </VStack>
      {showCommentEditor && <Box marginTop='0.8rem'>
        <CommentEditor boardId={boardId} postId={postId} referenceCommentId={comment.id}/>
      </Box>}
      {comment.nestedComments && comment.nestedComments.map((nestedComment, index) => (
        <Card shadow='none' backgroundColor='gray.50' marginTop='.5rem' key={index}>
          <CardBody>
            <CommentView boardId={boardId} postId={postId} comment={nestedComment}/>
          </CardBody>
        </Card>
      ))}
    </Box>
  );
};

export default CommentView;
