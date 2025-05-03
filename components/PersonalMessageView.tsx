// react
import { Box, Button, Divider, HStack, Link, Menu, MenuButton, MenuItem, MenuList, Spacer, Text, VStack, } from '@chakra-ui/react';
import { MdSend, } from 'react-icons/md';
// etc
import { PersonalMessage, } from '@root/interfaces';
import { getFormattedDateTime, } from '@root/utils';

type Props = {
  personalMessage: PersonalMessage,
};

const PersonalMessageView = ({
  personalMessage,
}: Props) => {
  return <Box>
    <PersonalMessageViewHeader personalMessage={personalMessage}/>
    <Divider marginTop='0.8rem' marginBottom='0.8rem'/>
    <PersonalMessageViewBody personalMessage={personalMessage}/>
    <PersonalMessageViewFooter personalMessage={personalMessage}/>
  </Box>;
};

export default PersonalMessageView;

type HeaderProps = {
  personalMessage: PersonalMessage,
}

const PersonalMessageViewHeader = ({
  personalMessage,
}: HeaderProps) => {
  return <VStack align='stretch'>
    <Text fontSize='lg' fontWeight='medium'>{personalMessage.title}</Text>
    <HStack>
      <Box>
        <Menu size='sm'>
          <MenuButton as={Text} fontSize='0.8rem' cursor='pointer'>{personalMessage.sendAccount.nickname}</MenuButton>
          <MenuList fontSize='0.8rem'>
            <Link href={`/message/create?to=${personalMessage.sendAccount.id}`} _hover={{ textDecoration: 'none', }}>
              <MenuItem>쪽지 보내기</MenuItem>
            </Link>
          </MenuList>
        </Menu>
      </Box>
      <Spacer/>
      <VStack alignItems='flex-end' spacing='0.2rem'>
        <Text fontSize='0.8rem'>{getFormattedDateTime(personalMessage.createDate)}</Text>
      </VStack>
    </HStack>
  </VStack>;
};

type BodyProps = {
  personalMessage: PersonalMessage,
}

const PersonalMessageViewBody = ({
  personalMessage,
}: BodyProps) => {
  return <Box>
    <pre><Text>{personalMessage.message}</Text></pre>
  </Box>;
};

type FooterProps = {
  personalMessage: PersonalMessage,
}

const PersonalMessageViewFooter = ({
  personalMessage,
}: FooterProps) => {
  return <HStack marginTop='0.8rem'>
    <Spacer/>
    <Link href={`/message/create?to=${personalMessage.sendAccount.id}`}>
      <Button variant='outline' size='xs' leftIcon={<MdSend/>}>답장</Button>
    </Link>
  </HStack>;
};
