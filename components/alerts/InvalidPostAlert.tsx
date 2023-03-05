// react
import { useRef, } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Text, } from '@chakra-ui/react';

type Props = {
  isOpen?: boolean,
  onClose?: () => void,
}

const InvalidPostAlert = ({
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
        <Text>유효하지 않은 게시물입니다.</Text>
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button ref={cancelRef} onClick={onClose}>
          닫기
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>);
};

export default InvalidPostAlert;
