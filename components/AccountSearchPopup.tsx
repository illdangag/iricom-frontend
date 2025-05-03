import { useEffect, useRef, useState, } from 'react';
import { Box, Button, ButtonGroup, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, } from '@chakra-ui/react';
import AccountSearch from './AccountSearch';
// etc
import { Account, } from '@root/interfaces';

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: (accountList: Account[]) => void;
};

const AccountSearchPopup = ({
  isOpen = true,
  onClose = () => {},
  onConfirm = () => {},
}: Props) => {
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const [selectedAccount, setSelectedAccount,] = useState<Account | null>(null);

  useEffect(() => {
    setSelectedAccount(null);
  }, [isOpen,]);

  const onClickAccount = (account: Account) => {
    setSelectedAccount(account);
  };

  const onClickCancel = () => {
    onClose();
  };

  const onClickConfirm = () => {
    onConfirm([selectedAccount,]);
  };

  const onClickModalOverlay = () => {
    onClose();
  };

  return <Modal
    isOpen={isOpen}
    initialFocusRef={initialRef}
    finalFocusRef={finalRef}
    onClose={onClickModalOverlay}
  >
    <ModalOverlay/>
    <ModalContent>
      <ModalHeader>수신자 검색</ModalHeader>
      <ModalBody>
        <AccountSearch
          onClickAccount={onClickAccount}
        />
        {selectedAccount && <Box marginTop='1rem'>
          <Text as='b' display='inline-block'>{selectedAccount.nickname || selectedAccount.email}</Text> <Text display='inline-block'>에게 쪽지보내기</Text>
        </Box>}
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button variant='ghost' onClick={onClickCancel}>취소</Button>
          <Button isDisabled={!selectedAccount} onClick={onClickConfirm}>확인</Button>
        </ButtonGroup>
      </ModalFooter>
    </ModalContent>
  </Modal>;
};

export default AccountSearchPopup;
