// react
import { Text, HStack, VStack, Box, Checkbox, ButtonGroup, Button, } from '@chakra-ui/react';
// etc
import { AccountList, Account, } from '../interfaces';
import { ReactNode } from 'react';

type Props = {
  page: number,
  accountList: AccountList,
  selectedAccountIdList: string[],
};

const AccountListTable = ({
  page = 0,
  accountList,
  selectedAccountIdList = [],
}: Props) => {

  const getAccountItem = (account: Account, key: string) => {
    return <HStack key={key} justifyContent='flex-start'>
      <Checkbox/>
      <Text>{account.nickname}</Text>
    </HStack>;
  };

  const getPagination = (): ReactNode => {
    const paginationList: number[] = accountList.getPaginationList(5);
    return <HStack justifyContent='center' marginTop='0.4rem'>
      <ButtonGroup size='xs' variant='outline' isAttached>
        {paginationList.map((pagination, index) => <Button
          key={index}
          backgroundColor={pagination === page ? 'gray.100' : 'transparent'}
          onClick={() => {
          }}>
          {pagination}
        </Button>)}
      </ButtonGroup>
    </HStack>;
  };

  return (
    <VStack alignItems='stretch'>
      <VStack alignItems='stretch'>
        {accountList.accounts.map((account, index) => getAccountItem(account, '' + index))}
      </VStack>
      {getPagination()}
    </VStack>
  );
};

export default AccountListTable;
