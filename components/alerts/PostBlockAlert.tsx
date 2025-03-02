// react
import { ChangeEvent, ChangeEventHandler, useRef, useState, } from 'react';
import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, ButtonGroup, Button,
  useToast, FormControl, FormLabel, Textarea, } from '@chakra-ui/react';
import { useIricom, } from '../../hooks';

// etc
import { IricomError, Post, } from '../../interfaces';

enum ComponentState {
  IDLE = 'IDLE',
  REQUEST = 'REQUEST',
}

type Props = {
  post: Post,
  isOpen?: boolean,
  onClose?: () => void,
}

const PostBlockAlert = ({
  isOpen = false,
  onClose = () => {},
  post,
}: Props) => {
  const closeRef = useRef();
  const iricomAPI = useIricom();
  const toast = useToast();

  const [state, setState,] = useState<ComponentState>(ComponentState.IDLE);
  const [reason, setReason,] = useState<string>('');

  const onChangeReason: ChangeEventHandler<HTMLTextAreaElement> = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value: string = event.target.value;
    setReason(value);
  };

  const onClickBan = async () => {
    setState(ComponentState.REQUEST);

    try {
      await iricomAPI.blockPost(post.boardId, post.id, reason);
      toast({
        title: '게시물을 차단 하였습니다.',
        status: 'success',
        duration: 3000,
      });
      setReason('');
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
      <AlertDialogHeader>게시물 차단</AlertDialogHeader>
      <AlertDialogBody>
        <FormControl>
          <FormLabel>사유</FormLabel>
          <Textarea
            value={reason}
            onChange={onChangeReason}
            disabled={state === ComponentState.REQUEST}
          />
        </FormControl>
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
            isDisabled={reason.length === 0}
            isLoading={state === ComponentState.REQUEST}
            onClick={onClickBan}
          >
            차단
          </Button>
        </ButtonGroup>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
};

export default PostBlockAlert;
