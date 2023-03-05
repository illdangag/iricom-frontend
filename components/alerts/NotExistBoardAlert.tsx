// react
import { useRef, } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, } from '@chakra-ui/react';

type Props = {
  isOpen?: boolean,
  onClose?: () => void,
}

const NotExistBoardAlert = ({
  isOpen = false,
  onClose = () => {},
}: Props) => {
  const cancelRef = useRef();

  return (<AlertDialog
    motionPreset='slideInBottom'
    size='xs'
    leastDestructiveRef={cancelRef}
    onClose={onClose}
    isOpen={isOpen}
    isCentered
  >
    <AlertDialogOverlay/>
    <AlertDialogContent>
      <AlertDialogHeader>저런!</AlertDialogHeader>
      <AlertDialogBody>
        존재하지 않는 게시판입니다.
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button ref={cancelRef} onClick={onClose}>
          닫기
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>);
};

export default NotExistBoardAlert;
