// react
import { HStack, } from '@chakra-ui/react';
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
