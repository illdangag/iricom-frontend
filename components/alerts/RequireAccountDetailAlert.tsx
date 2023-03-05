// react
import { useRef, } from 'react';
import { useRouter, } from 'next/router';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Text, } from '@chakra-ui/react';

type Props = {
  text?: string,
  isOpen?: boolean,
  onClose?: () => void,
}

const RequireAccountDetailAlert = ({
  text,
  isOpen = false,
  onClose = () => {},
}: Props) => {
  const closeRef = useRef();
  const router = useRouter();

  const onClickRegister = () => {
    void router.push('/info/edit');
  };

  return (<AlertDialog
    motionPreset='slideInBottom'
    size='sm'
    leastDestructiveRef={closeRef}
    onClose={onClose}
    isOpen={isOpen}
    isCentered
  >
    <AlertDialogOverlay/>
    <AlertDialogContent>
      <AlertDialogHeader>저런!</AlertDialogHeader>
      <AlertDialogBody>
        {text && <Text>{text}</Text>}
        <Text>계정 정보 등록 페이지로 이동 하시겠습니까?</Text>
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button ref={closeRef} onClick={onClickRegister}>
          계정 등록 페이지로 이동
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>);
};

export default RequireAccountDetailAlert;
