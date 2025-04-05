// react
import { TableContainer, VStack, Box, Table, Thead, Tr, Th, Tbody, Td, Badge, } from '@chakra-ui/react';
import Pagination from './Pagination';

// etc
import { PersonalMessageList, } from '@root/interfaces';
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
      <Table size='sm'>
        <Thead>
          <Tr>
            <Th width='5rem'>날짜</Th>
            <Th>제목</Th>
          </Tr>
        </Thead>
        <Tbody>
          {personalMessageList.personalMessages.map((message) => {
            return <Tr key={'pm_' + message.id}>
              <Td>{getFormattedDateTime(message.createDate)}</Td>
              <Td>{message.title}{message.receivedConfirm ? '' : <Badge fontSize='0.5rem' variant='outline' colorScheme='red' marginLeft='0.2rem'>NEW</Badge>}</Td>
            </Tr>;
          })}
        </Tbody>
      </Table>
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
