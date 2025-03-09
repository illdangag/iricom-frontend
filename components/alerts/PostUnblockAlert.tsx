// react
import { useRef, useState, } from 'react';
import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, ButtonGroup, Button,
  useToast,
} from '@chakra-ui/react';
import { useIricom, } from '@root/hooks';

// etc
import { IricomError, Post, } from '@root/interfaces';

enum ComponentState {
  IDLE = 'IDLE',
  REQUEST = 'REQUEST',
}

type Props = {
  post: Post,
  isOpen?: boolean,
  onClose?: () => void,
}

const PostUnblockAlert = ({
  isOpen = false,
  onClose = () => {},
  post,
}: Props) => {
  const closeRef = useRef();
  const iricomAPI = useIricom();
  const toast = useToast();

  const [state, setState,] = useState<ComponentState>(ComponentState.IDLE);

  const onClickUnblock = async () => {
    setState(ComponentState.REQUEST);

    try {
      await iricomAPI.unblockPost(post.boardId, post.id);
      toast({
        title: '게시물을 차단 해제 하였습니다.',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      const iricomError: IricomError = error as IricomError;
      toast({
        title: iricomError.message,
        status: 'warning',
        duration: 3000,
      });
    } finally {
      setState(ComponentState.IDLE);
      onClose();
    }
  };

  return <AlertDialog leastDestructiveRef={closeRef} isOpen={isOpen} onClose={onClose}>
    <AlertDialogOverlay/>
    <AlertDialogContent>
      <AlertDialogHeader>게시물 차단 해제</AlertDialogHeader>
      <AlertDialogBody>
      </AlertDialogBody>
      <AlertDialogFooter>
        <ButtonGroup>
          <Button
            variant='ghost'
            ref={closeRef}
            isDisabled={state === ComponentState.REQUEST}
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            isLoading={state === ComponentState.REQUEST}
            onClick={onClickUnblock}
          >
            차단 해제
          </Button>
        </ButtonGroup>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
};

export default PostUnblockAlert;
