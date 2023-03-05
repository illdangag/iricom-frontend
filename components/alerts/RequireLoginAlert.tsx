// react
import { useRef, } from 'react';
import { useRouter, } from 'next/router';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Text, } from '@chakra-ui/react';

type Props = {
  text?: string,
  successURL?: string,
  isOpen?: boolean,
  onClose?: () => void,
}

const RequireLoginAlert = ({
  text,
  successURL,
  isOpen = false,
  onClose = () => {},
}: Props) => {
  const closeRef = useRef();
  const router = useRouter();

  const onClickLogin = () => {
    void router.push('/login?success=' + encodeURIComponent(successURL));
  };

  return (<AlertDialog
    motionPreset='slideInBottom'
    size='xs'
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
        <Text>로그인 페이지로 이동 하시겠습니까?</Text>
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button ref={closeRef} onClick={onClickLogin}>
          로그인 페이지로 이동
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>);
};

export default RequireLoginAlert;
