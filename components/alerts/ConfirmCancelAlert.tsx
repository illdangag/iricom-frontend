// react
import { useRef, } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, ButtonGroup, Text, } from '@chakra-ui/react';

type Props = {
  title?: string,
  body?: string[],
  confirm?: string,
  cancel?: string,
  isOpen?: boolean,
  disabled?: boolean,
  loading?: boolean,
  onConfirm?: () => void;
  onClose?: () => void;
};

const ConfirmCancelAlert = ({
  title = '',
  body = [],
  confirm = '',
  cancel = '',
  isOpen = false,
  disabled = false,
  loading = false,
  onConfirm = () => {
  },
  onClose = () => {
  },
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
      {title && <AlertDialogHeader>{title}</AlertDialogHeader>}
      {body && body.length > 0 && <AlertDialogBody>
        {body.map((text, index) => <Text key={index}>{text}</Text>)}
      </AlertDialogBody>}
      <AlertDialogFooter>
        <ButtonGroup isDisabled={disabled || loading}>
          <Button variant='ghost' onClick={() => onClose()}>{cancel}</Button>
          <Button isLoading={loading} onClick={() => onConfirm()}>{confirm}</Button>
        </ButtonGroup>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>);
};

export default ConfirmCancelAlert;
