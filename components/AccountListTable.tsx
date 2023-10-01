// react
import { useState, useEffect, ChangeEvent, KeyboardEvent, } from 'react';
import { Text, Checkbox, HStack, VStack, Input, InputGroup, InputLeftElement, InputRightElement, Button, } from '@chakra-ui/react';
import { MdSearch, } from 'react-icons/md';
import { Pagination, } from '../components';
import { useIricomAPI, } from '../hooks';
// etc
import { Account, AccountList, } from '../interfaces';

type Props = {
  defaultPage?: number,
  size?: number,
  defaultSelectedAccountIdList?: string[],
  isShowCheckbox?: boolean,
  onMultiSelect?: (accountList: Account[]) => void,
  onClickAccount?: (account: Account) => void,
};

const AccountListTable = ({
  defaultPage = 1,
  size = 2,
  defaultSelectedAccountIdList = [],
  isShowCheckbox = false,
  onMultiSelect = () => {},
  onClickAccount = () => {},
}: Props) => {
  const iricomAPI = useIricomAPI();

  const [page, setPage,] = useState<number>(defaultPage);
  const [selectedAccountIdList, setSelectedAccountIdList,] = useState<string[]>(defaultSelectedAccountIdList);
  const [accountList, setAccountList,] = useState<AccountList | null>(null);
  const [selectedAccountList, setSelectedAccountList,] = useState<Account[]>([]);

  const [inputKeyword, setInputKeyword,] = useState<string>('');
  const [keyword, setKeyword,] = useState<string>('');

  useEffect(() => {
    getAccountList();
  }, [page, keyword,]);

  const getAccountList = () => {
    const skip: number = (page - 1) * size;
    void iricomAPI.getAccountList(skip, size, keyword === '' ? null : keyword)
      .then(accountList => {
        setAccountList(accountList);
      });
  };

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

  const onClickPagination = (page: number) => {
    setPage(page);
  };

  const onChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    setInputKeyword(event.target.value);
  };

  const onKeyupKeyword = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      setKeyword(inputKeyword);
    }
  };

  const onClickKeyword = () => {
    setKeyword(inputKeyword);
    setPage(1);
    setSelectedAccountIdList([]);
  };

  const getAccountItem = (account: Account) => {
    return <HStack>
      <Text>{account.nickname}</Text>
      <Text fontSize='1rem' color='gray.500'>{account.email}</Text>
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
    <VStack alignItems='stretch'>
      <HStack justifyContent='flex-end'>
        <InputGroup size='sm' width='12rem' maxWidth='100%'>
          <InputLeftElement pointerEvents='none'>
            <MdSearch/>
          </InputLeftElement>
          <Input paddingRight='3rem' value={inputKeyword} onChange={onChangeKeyword} onKeyUp={onKeyupKeyword}/>
          <InputRightElement width='3rem'>
            <Button size='xs' onClick={onClickKeyword}>검색</Button>
          </InputRightElement>
        </InputGroup>
      </HStack>
      <VStack alignItems='stretch'>
        {accountList && accountList.accounts.map((account) => getAccountRow(account))}
      </VStack>
      {accountList && <Pagination page={page} listResponse={accountList} onClick={onClickPagination}/>}
    </VStack>
  );
};

export default AccountListTable;
