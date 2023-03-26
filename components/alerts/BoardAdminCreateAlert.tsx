// react
import { useRef, } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
  Button, ButtonGroup, Text, } from '@chakra-ui/react';
import { useIricomAPI, } from '../../hooks';
// etc
import { Board, Account, } from '../../interfaces';

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  board?: Board,
  account?: Account,
};

const BoardAdminCreateAlert = ({
  isOpen = false,
  onClose = () => {},
  onConfirm = () => {},
  board = null,
  account = null,
}: Props) => {
  const cancelRef = useRef();
  const iricomAPI = useIricomAPI();

  const onClickAdd = () => {
    if (board === null || account === null) {
      return;
    }

    void iricomAPI.createBoardAdmin(board.id, account.id)
      .then(() => {
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
          <Button variant='ghost' onClick={onClose}>취소</Button>
          <Button onClick={onClickAdd}>추가</Button>
        </ButtonGroup>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>);
};

export default BoardAdminCreateAlert;
