// react
import { Button, HStack, Link, } from '@chakra-ui/react';
import { MdEditNote, } from 'react-icons/md';
import PageTitle from './PageTitle';

// etc
import {} from '@root/interfaces';

type Props = {
  isShowCreate?: boolean,
}

const PersonalMessagePageTitle = ({
  isShowCreate = true,
}: Props) => {
  return <>
    <HStack marginBottom='1rem' justifyContent='space-between' alignItems='end'>
      <PageTitle title='쪽지함'/>
      {isShowCreate && <Link href='/message/create' _hover={{ textDecoration: 'none', }}>
        <Button
          size='xs'
          variant='outline'
          backgroundColor='white'
          leftIcon={<MdEditNote/>}
          marginRight={{ base: '1rem', md: '0', }}
        >
          쪽지 보내기
        </Button>
      </Link>}
    </HStack>
  </>;
};

export default PersonalMessagePageTitle;
