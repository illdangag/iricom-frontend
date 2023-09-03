// react
import { useEffect, useRef, useState, } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, ButtonGroup, Text, } from '@chakra-ui/react';
import { useIricomAPI, } from '../../hooks';
// etc
import { Account, Board, BoardAdmin, } from '../../interfaces';

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: (boardAdmin: BoardAdmin) => void;
  board?: Board;
  account?: Account;
};

enum State {
  INVALID,
  VALID,
  REQUEST,
}

const BoardAdminDeleteAlert = ({
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

  const onClickDelete = () => {
    if (board === null || account === null) {
      return;
    }

    setState(State.REQUEST);
    void iricomAPI.deleteBoardAdmin(board.id, account.id)
      .then((boardAdmin: BoardAdmin) => {
        setState(State.VALID);
        onConfirm(boardAdmin);
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
      <AlertDialogHeader>관리자 계정 삭제</AlertDialogHeader>
      <AlertDialogBody>
        <Text>"{account && account.nickname}" 계정을 게시판 관리자에서 삭제합니다.</Text>
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
            onClick={onClickDelete}
          >
            삭제
          </Button>
        </ButtonGroup>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>);
};

export default BoardAdminDeleteAlert;
