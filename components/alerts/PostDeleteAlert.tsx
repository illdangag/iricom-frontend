// react
import { useRef, useState, useEffect, } from 'react';
import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody,
  AlertDialogFooter, Text, ButtonGroup, Button, } from '@chakra-ui/react';
import { useIricom, } from '../../hooks';
// etc
import { Post, } from '../../interfaces';

enum State {
  INVALID,
  VALID,
  REQUEST,
}

type Props = {
  isOpen?: boolean,
  onClose?: () => void,
  onConfirm?: () => void,
  post?: Post,
};

const PostDeleteAlert = ({
  isOpen = false,
  onClose = () => {},
  onConfirm = () => {},
  post = null,
}: Props) => {
  const closeRef = useRef();
  const iricomAPI = useIricom();

  const [state, setState,] = useState<State>(State.INVALID);

  useEffect(() => {
    if (post) {
      setState(State.VALID);
    } else {
      setState(State.INVALID);
    }
  }, [post,]);

  const onClickDelete = () => {
    void iricomAPI.deletePost(post.boardId, post.id)
      .then(() => {
        onConfirm();
      });
  };

  return (<AlertDialog
    isOpen={isOpen}
    leastDestructiveRef={closeRef}
    onClose={onClose}
    motionPreset='slideInBottom'
    size='xs'
    isCentered
  >
    <AlertDialogOverlay/>
    <AlertDialogContent>
      <AlertDialogHeader>게시물 삭제</AlertDialogHeader>
      <AlertDialogBody>
        {post && <Text>"{post.title}" 게시물을 삭제합니다.</Text>}
      </AlertDialogBody>
      <AlertDialogFooter>
        <ButtonGroup>
          <Button
            variant='ghost'
            ref={closeRef}
            isDisabled={state === State.INVALID || state === State.REQUEST}
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            colorScheme='red'
            isDisabled={state === State.INVALID}
            isLoading={state === State.REQUEST}
            onClick={onClickDelete}
          >
            삭제
          </Button>
        </ButtonGroup>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>);
};

export default PostDeleteAlert;
