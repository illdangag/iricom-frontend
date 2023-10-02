// react
import { Badge, Box, Table, TableContainer, Tbody, Td, Th, Thead, Tr, VStack, Link, } from '@chakra-ui/react';
import Pagination from './Pagination';

// etc
import { ReportPostList, ReportType, } from '../../interfaces';
import { getFormattedDateTime, } from '../../utils';
import NextLink from 'next/link';

type Props = {
  reportPostList: ReportPostList,
  page: number,
  isShowPagination?: boolean,
  pageLinkHref?: string,
  reportLinkHref?: string,
};

const ReportPostListTable = ({
  reportPostList,
  page,
  isShowPagination = true,
  pageLinkHref = '#',
  reportLinkHref = '#',
}: Props) => {

  const getTypeElement = (type: ReportType) => {
    switch (type) {
      case ReportType.HATE:
        return <Badge>증오</Badge>;
      case ReportType.POLITICAL:
        return <Badge>정치</Badge>;
      case ReportType.PORNOGRAPHY:
        return <Badge>음란물</Badge>;
      case ReportType.ETC:
        return <Badge>기타</Badge>;
    }
  };

  return <VStack alignItems='stretch'>
    <TableContainer>
      <Table size='sm'>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>종류</Th>
            <Th>게시물 제목</Th>
            <Th>신고자</Th>
            <Th>신고일</Th>
          </Tr>
        </Thead>
        <Tbody>
          {reportPostList.reports.map((reportPost, index) => <Tr key={index}>
            <Td>{reportPost.id}</Td>
            <Td>{getTypeElement(reportPost.type)}</Td>
            <Td>
              <Link as={NextLink} href={reportLinkHref.replaceAll('{{reportId}}', reportPost.id)}>
                {reportPost.post.title}
              </Link>
            </Td>
            <Td>{reportPost.reporter.nickname}</Td>
            <Td>{getFormattedDateTime(reportPost.createDate)}</Td>
          </Tr>)}
        </Tbody>
      </Table>
    </TableContainer>
    {isShowPagination && <Box paddingTop='1rem'>
      <Pagination
        page={page}
        listResponse={reportPostList}
        pageLinkHref={pageLinkHref}
      />
    </Box>}
  </VStack>;
};

export default ReportPostListTable;
