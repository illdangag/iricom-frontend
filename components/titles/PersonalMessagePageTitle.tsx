// react
import { Button, HStack, Link, } from '@chakra-ui/react';
import { MdEditNote, } from 'react-icons/md';
import PageTitle from './PageTitle';

// etc
import {} from '@root/interfaces';

type Props = {
}

const PersonalMessagePageTitle = ({}: Props) => {
  return <>
    <HStack marginBottom='1rem' justifyContent='space-between' alignItems='end'>
      <PageTitle title='쪽지함'/>
    </HStack>
  </>;
};

export default PersonalMessagePageTitle;
