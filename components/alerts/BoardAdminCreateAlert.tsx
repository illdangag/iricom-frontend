// react
import { useEffect, useRef, useState, } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, ButtonGroup, Text, } from '@chakra-ui/react';
import { useIricomAPI, } from '../../hooks';
// etc
import { Account, Board, } from '../../interfaces';

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  board?: Board;
  account?: Account;
};

enum State {
  INVALID,
  VALID,
  REQUEST,
}

const BoardAdminCreateAlert = ({
  isOpen = false,
  onClose = () => {
  },
  onConfirm = () => {
  },
  board = null,
  account = null,
}: Props) => {
  const cancelRef = useRef();
  const iricomAPI = useIricomAPI();

  const [state, setState,] = useState<State>(State.INVALID);

  useEffect(() => {
    if (board !== null && account !== null) {
      setState(State.VALID);
    } else {
      setState(State.INVALID);
    }
  }, [board, account,]);

  const onClickCreate = () => {
    if (board === null || account === null) {
      return;
    }

    setState(State.REQUEST);
    void iricomAPI.createBoardAdmin(board.id, account.id)
      .then(() => {
        setState(State.VALID);
        onConfirm();
      });
  };

  return (<AlertDialog
    leastDestructiveRef={cancelRef}
    isOpen={isOpen}
    onClose={onClose}
    motionPreset='slideInBottom'
    size='xs'
    isCentered
  >
    <AlertDialogOverlay/>
    <AlertDialogContent>
      <AlertDialogHeader>관리자 계정 추가</AlertDialogHeader>
      <AlertDialogBody>
        <Text>"{account && account.nickname}" 계정을 게시판 관리자로 추가합니다.</Text>
      </AlertDialogBody>
      <AlertDialogFooter>
        <ButtonGroup>
          <Button
            variant='ghost'
            isDisabled={state === State.INVALID || state === State.REQUEST}
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            isDisabled={state === State.INVALID}
            isLoading={state === State.REQUEST}
            onClick={onClickCreate}
          >
            추가
          </Button>
        </ButtonGroup>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>);
};

export default BoardAdminCreateAlert;
