import { useRef, } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
  Button, ButtonGroup, Text, } from '@chakra-ui/react';

type Props = {
  isOpen?: boolean;
  redirectURL?: string,
  onClose?: () => void;
}

const UnregisteredAccountAlert = ({
  isOpen = false,
  redirectURL,
  onClose = () => {},
}: Props) => {
  const cancelRef = useRef();

  const onClickAccountEdit = () => {
    const redirectURLQueryParam: string = redirectURL ? '?redirect=' + encodeURIComponent(redirectURL) : '';
    window.location.href = '/info/edit' + redirectURLQueryParam;
  };

  return <AlertDialog
    motionPreset='slideInBottom'
    size='sm'
    leastDestructiveRef={cancelRef}
    isOpen={isOpen}
    onClose={onClose}
  >
    <AlertDialogOverlay/>
    <AlertDialogContent>
      <AlertDialogHeader>저런!</AlertDialogHeader>
      <AlertDialogBody>
        <Text>닉네임이 등록되지 않은 계정입니다.</Text>
        <Text>계정 수정 페이지에서 닉네임을 등록 하시겠습니까?</Text>
      </AlertDialogBody>
      <AlertDialogFooter>
        <ButtonGroup>
          <Button variant='ghost' onClick={onClose}>취소</Button>
          <Button onClick={onClickAccountEdit}>이동</Button>
        </ButtonGroup>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
};

export default UnregisteredAccountAlert;
