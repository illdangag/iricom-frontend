// react
import { ChangeEvent, useState, KeyboardEvent, useEffect, } from 'react';
import { Box, Button, HStack, Input, InputGroup, InputLeftElement, InputRightElement, VStack, } from '@chakra-ui/react';
import { MdSearch, } from 'react-icons/md';
import AccountListTable from './tables/AccountListTable';
// hook
import { useIricom, } from '@root/hooks';
// etc
import { Account, AccountList, } from '@root/interfaces';


type Props = {
  onClickAccount?: (account: Account) => void,
};

const AccountSearch = ({
  onClickAccount = () => {},
}: Props) => {
  const iricomAPI = useIricom();

  const [keyword, setKeyword,] = useState<string>('');
  const [page, setPage,] = useState<number>(1);
  const [skip, setSkip,] = useState<number>(0);
  const [accountList, setAccountList,] = useState<AccountList>(new AccountList());

  const PAGE_LIMIT = 10;

  useEffect(() => {
    void searchAccount();
  }, [skip,]);

  const onChangeSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const onClickSearchButton = () => {
    void searchAccount();
  };

  const onKeyUpSearchInput = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      void searchAccount();
    }
  };

  const searchAccount = async () => {
    const accountList: AccountList = await iricomAPI.getAccountList(skip, PAGE_LIMIT, keyword === '' ? null : keyword);
    setAccountList(accountList);
  };

  const onClickAccountPage = (page: number) => {
    setPage(page);
    setSkip(PAGE_LIMIT * (page - 1));
  };

  return <VStack>
    <InputGroup size='sm'>
      <InputLeftElement pointerEvents='none'>
        <MdSearch/>
      </InputLeftElement>
      <Input
        paddingRight='3rem'
        value={keyword}
        onChange={onChangeSearchInput}
        onKeyUp={onKeyUpSearchInput}
      />
      <InputRightElement width='3rem'>
        <Button size='xs' onClick={onClickSearchButton}>검색</Button>
      </InputRightElement>
    </InputGroup>
    <AccountListTable
      accountList={accountList}
      page={page}
      isShowCheckbox={false}
      pageLinkHref={null}
      onClickPage={onClickAccountPage}
      onClickAccount={onClickAccount}
    />
  </VStack>;
};

export default AccountSearch;
