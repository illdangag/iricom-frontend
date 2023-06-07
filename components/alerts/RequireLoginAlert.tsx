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
    const successQueryParam: string = successURL ? '?success=' + encodeURIComponent(successURL) : '';
    void router.push('/login' + successQueryParam);
  };

  return (<AlertDialog
    motionPreset='slideInBottom'
    size='sm'
    leastDestructiveRef={closeRef}
    onClose={onClose}
    isOpen={isOpen}
    isCentered
  >
    <AlertDialogOverlay>
      <AlertDialogContent>
        <AlertDialogHeader>저런!</AlertDialogHeader>
        <AlertDialogBody>
          {text && <Text>{text}</Text>}
          <Text>로그인 페이지로 이동 하시겠습니까?</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button variant='ghost' onClick={onClose}>
            취소
          </Button>
          <Button ref={closeRef} onClick={onClickLogin} marginLeft={3}>
            이동
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogOverlay>
  </AlertDialog>);
};

export default RequireLoginAlert;
