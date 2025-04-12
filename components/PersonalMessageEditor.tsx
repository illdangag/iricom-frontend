// react
import { ChangeEvent, useState, } from 'react';
import { Box, Button, ButtonGroup, FormControl, FormLabel, HStack, Input, Textarea, VStack, } from '@chakra-ui/react';
// etc
import { PersonalMessage, } from '@root/interfaces';

type Props = {
  disabled?,
  loading?,
  onChange?: (personalMessage: PersonalMessage) => void,
};

const PersonalMessageEditor = ({
  disabled = false,
  loading = false,
  onChange = () => {},
}: Props) => {
  const [title, setTitle,] = useState<string>('');
  const [message, setMessage,] = useState<string>('');

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeMessage = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const onClickConfirm = () => {
    const personalMessage: PersonalMessage = {
      id: '',
      createDate: 0,
      updateDate: 0,
      title: title,
      message: message,
      receivedConfirm: false,
      sendAccount: null,
      receiveAccount: null,
    };
    onChange(personalMessage);
  };

  return <Box>
    <VStack>
      <FormControl isRequired>
        <FormLabel>제목</FormLabel>
        <Input value={title} onChange={onChangeTitle} disabled={disabled || loading}/>
      </FormControl>
      <FormControl>
        <FormLabel>내용</FormLabel>
        <Box>
          <Textarea value={message} onChange={onChangeMessage} disabled={disabled || loading}/>
        </Box>
      </FormControl>
    </VStack>
    <HStack justifyContent='flex-end' marginTop='.8rem'>
      <ButtonGroup size='sm'>
        <Button
          isDisabled={title.length === 0 || disabled}
          isLoading={loading}
          onClick={onClickConfirm}
        >
          전송
        </Button>
      </ButtonGroup>
    </HStack>
  </Box>;
};

export default PersonalMessageEditor;
