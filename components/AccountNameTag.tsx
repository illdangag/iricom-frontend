// react
import { Box, Link, Menu, MenuButton, MenuItem, MenuList, Text, } from '@chakra-ui/react';
// etc
import { Account, } from '@root/interfaces';

type Props = {
  account: Account;
  isShowSendPersonalMessage?: boolean;
}

const AccountNameTag = ({
  account,
  isShowSendPersonalMessage = false,
}: Props) => {
  const getCursorType = isShowSendPersonalMessage && 'pointer' || 'text';
  return <Box display='inline-block'>
    <Menu size='sm'>
      <MenuButton as={Text} fontSize='0.8rem' cursor={getCursorType}>{account.nickname || account.email}</MenuButton>
      {isShowSendPersonalMessage && <MenuList fontSize='0.8rem'>
        {isShowSendPersonalMessage && <Link href={`/message/create?to=${account.id}`} _hover={{ textDecoration: 'none', }}>
          <MenuItem>쪽지 보내기</MenuItem>
        </Link>}
      </MenuList>}
    </Menu>
  </Box>;
};

export default AccountNameTag;
