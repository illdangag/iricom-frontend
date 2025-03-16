// react
import { useState, } from 'react';
import { TableContainer, VStack, Box, } from '@chakra-ui/react';
import Pagination from './Pagination';

// etc
import { PersonalMessageList, PersonalMessage, } from '@root/interfaces';
import { getFormattedDateTime, } from '@root/utils';

type Props = {
  personalMessageList: PersonalMessageList,
  page: number,
  pageLinkHref?: string,
}

const PersonalMessageListTable = ({
  personalMessageList,
  page,
  pageLinkHref = '?page={{page}}',
}: Props) => {
  return <VStack alignItems='stretch'>
    <TableContainer>

    </TableContainer>
    <Box paddingTop='1rem'>
      <Pagination
        page={page}
        listResponse={personalMessageList}
        pageLinkHref={pageLinkHref}
      />
    </Box>
  </VStack>;
};

export default PersonalMessageListTable;
