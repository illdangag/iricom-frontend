// react
import { VStack, Box, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Badge, } from '@chakra-ui/react';
import Pagination from '../Pagination';

// etc
import { BoardList, Board, } from '../../interfaces';

type Props = {
  boardList: BoardList,
  page: number,
  isShowPagination?: boolean,
  pageLinkHref?: string,
  onClickBoard?: (board: Board) => void,
}

const BoardListTable = ({
  boardList,
  page,
  isShowPagination = true,
  pageLinkHref = '?page={{page}}',
  onClickBoard = () => {},
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
            onClick={() => onClickBoard(board)}
            cursor='pointer'
            _hover={{
              background: 'gray.50',
            }}
          >
            <Td>{board.id}</Td>
            <Td>{board.title}</Td>
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
