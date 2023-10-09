// react
import { VStack, Box, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Badge, Link, Icon, } from '@chakra-ui/react';
import NextLink from 'next/link';
import Pagination from './Pagination';

// etc
import { BoardList, } from '../../interfaces';
import { MdOpenInNew, } from 'react-icons/md';

type Props = {
  boardList: BoardList,
  page: number,
  isShowPagination?: boolean,
  pageLinkHref?: string,
  boardLinkHref?: string,
}

const BoardListTable = ({
  boardList,
  page,
  isShowPagination = true,
  pageLinkHref = '?page={{page}}',
  boardLinkHref = '#',
}: Props) => {
  return <VStack alignItems='stretch'>
    <TableContainer>
      <Table size='sm'>
        <Thead>
          <Tr>
            <Th>아이디</Th>
            <Th>이름</Th>
            <Th>설명</Th>
            <Th>상태</Th>
          </Tr>
        </Thead>
        <Tbody>
          {boardList.boards.map((board, index) => <Tr
            key={index}
            _hover={{
              background: 'gray.50',
            }}
          >
            <Td>{board.id}</Td>
            <Td>
              <Link as={NextLink} href={boardLinkHref.replaceAll('{{boardId}}', '' + board.id)}>
                {board.title}<Icon as={MdOpenInNew} marginLeft='0.2rem'/>
              </Link>
            </Td>
            <Td>{board.description}</Td>
            <Td>
              {board.enabled && <Badge colorScheme='green'>활성화</Badge>}
              {!board.enabled && <Badge colorScheme='gray'>비활성화</Badge>}
            </Td>
          </Tr>)}
        </Tbody>
      </Table>
    </TableContainer>
    {isShowPagination && <Box paddingTop='1rem'>
      <Pagination
        page={page}
        listResponse={boardList}
        pageLinkHref={pageLinkHref}
      />
    </Box>}
  </VStack>;
};

export default BoardListTable;
