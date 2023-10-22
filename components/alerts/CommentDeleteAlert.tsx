// react
import { useRef, useState, } from 'react';
import {
  AlertDialog, AlertDialogOverlay, AlertDialogHeader, AlertDialogBody, AlertDialogContent, AlertDialogFooter,
  Text, Box, ButtonGroup, Button, useToast,
} from '@chakra-ui/react';
import { useIricomAPI, } from '../../hooks';
// etc
import { Comment, CommentList, IricomError, IricomErrorResponse, } from '../../interfaces';

enum State {
  IDLE,
  REQUEST,
}

type Props = {
  boardId: string,
  postId: string,
  comment: Comment,
  isOpen?: boolean,
  onClose?: () => void,
  onChange?: (comment: Comment) => void,
};

const CommentDeleteAlert = ({
  boardId,
  postId,
  comment,
  isOpen = false,
  onClose = () => {},
  onChange = () => {},
}: Props) => {
  const closeRef = useRef();
  const iricomAPI = useIricomAPI();
  const toast = useToast();

  const [state, setState,] = useState<State>(State.IDLE);

  const onClickDelete = async () => {
    try {
      setState(State.REQUEST);
      const deleteComment: Comment = await iricomAPI.deleteComment(boardId, postId, comment.id);
      toast({
        title: '댓글을 삭제 하였습니다.',
        status: 'success',
        duration: 3000,
      });
      onChange(deleteComment);
    } catch (error) {
      toast({
        title: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      onClose();
      setState(State.IDLE);
    }
  };

  return <AlertDialog
    isOpen={isOpen}
    leastDestructiveRef={closeRef}
    onClose={onClose}
    motionPreset='slideInBottom'
    size='xs'
    isCentered={true}
  >
    <AlertDialogOverlay/>
    <AlertDialogContent>
      <AlertDialogHeader>댓글 삭제</AlertDialogHeader>
      <AlertDialogBody>
        <Box
          padding='0.5rem'
          marginBottom='0.5rem'
          borderWidth='1px' borderRadius='lg'
          overflow='hidden'
        >
          <Text fontSize='sm'>{comment.content}</Text>
        </Box>
      </AlertDialogBody>
      <AlertDialogFooter>
        <ButtonGroup>
          <Button
            variant='ghost'
            onClick={onClose}
            isDisabled={state === State.REQUEST}
          >
            취소
          </Button>
          <Button
            isLoading={state === State.REQUEST}
            onClick={onClickDelete}
          >
            삭제
          </Button>
        </ButtonGroup>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
};

export default CommentDeleteAlert;
