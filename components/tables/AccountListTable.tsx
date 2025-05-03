// react
import { useState, ChangeEvent, } from 'react';
import { Text, Checkbox, HStack, VStack, } from '@chakra-ui/react';
import { Pagination, } from '../index';

// etc
import { Account, AccountList, } from '../../interfaces';

type Props = {
  accountList: AccountList,
  page: number,
  pageLinkHref?: string,
  size?: number,
  defaultSelectedAccountIdList?: string[],
  isShowCheckbox?: boolean,
  onMultiSelect?: (accountList: Account[]) => void,
  onClickAccount?: (account: Account) => void,
  onClickPage?: (page: number) => void,
};

const AccountListTable = ({
  accountList,
  page,
  pageLinkHref = '?page={{page}}',
  defaultSelectedAccountIdList = [],
  isShowCheckbox = false,
  onMultiSelect = () => {},
  onClickAccount = () => {},
  onClickPage = () => {},
}: Props) => {
  const [selectedAccountIdList, setSelectedAccountIdList,] = useState<string[]>(defaultSelectedAccountIdList);
  const [selectedAccountList, setSelectedAccountList,] = useState<Account[]>([]);

  const onChangeCheckbox = (event: ChangeEvent<HTMLInputElement>, account: Account) => {
    const checked: boolean = event.target.checked;

    let newAccountList: Account[] = null;
    if (checked) {
      newAccountList = [...selectedAccountList, account,];
    } else {
      newAccountList = selectedAccountList.filter((item) => {
        return item.id !== account.id;
      });
      const newAccountIdList = selectedAccountIdList.filter((item: string) => {
        return item !== account.id;
      });
      setSelectedAccountIdList(newAccountIdList);
    }
    setSelectedAccountList(newAccountList);
    onMultiSelect(newAccountList);
  };

  const getAccountItem = (account: Account) => {
    return <HStack>
      {account.nickname && <Text marginRight='0.2rem'>{account.nickname}</Text>}<Text fontSize='1rem' color='gray.500'>{account.email}</Text>
    </HStack>;
  };

  const getAccountRow = (account: Account) => {
    const checked: boolean = !!selectedAccountList.find((item) => {
      return item.id === account.id;
    }) || !!selectedAccountIdList.find((item) => {
      return item === account.id;
    });

    return <HStack
      key={account.id}
      justifyContent='flex-start'
      cursor='pointer'
      onClick={() => onClickAccount(account)}
    >
      {isShowCheckbox && <Checkbox
        width='100%'
        defaultChecked={checked}
        onChange={(event) => onChangeCheckbox(event, account)}
      >
        {getAccountItem(account)}
      </Checkbox>}
      {!isShowCheckbox && getAccountItem(account)}
    </HStack>;
  };

  return (
    <VStack alignItems='stretch' style={{ width: '100%', }}>
      <VStack alignItems='stretch'>
        {accountList && accountList.accounts.map((account) => getAccountRow(account))}
      </VStack>
      {accountList && <Pagination
        page={page}
        listResponse={accountList}
        pageLinkHref={pageLinkHref}
        onClickPage={onClickPage}
      />}
    </VStack>
  );
};

export default AccountListTable;
