// react
import { ReactNode, } from 'react';
import NextLink from 'next/link';
import { TableContainer, Table, Tbody, Td, Tr, Badge, Box, ButtonGroup, Button, Thead, Th, } from '@chakra-ui/react';
// etc
import { PostList, Post, } from '../interfaces';

type Props = {
  postList: PostList,
  isShowHeader?: boolean,
  isShowPostState?: boolean,
  isShowPagination?: boolean,
  isShowPostNumber?: boolean,
}

const PostListTable = ({
  postList,
  isShowHeader = true,
  isShowPostState = true,
  isShowPagination = true,
  isShowPostNumber = true,
}: Props) => {

  const getRow = (post: Post, index: number): ReactNode => {
    return <Tr key={post.id}>
      {isShowPostNumber && <Td>{postList.skip + postList.posts.length - index}</Td>}
      <Td width='100%'>
        {post.title}
        {isShowPostState && post.isPublish && <NextLink href={`/boards/${post.boardId}/posts/${post.id}/edit`}>
          <Badge marginLeft='0.4rem' colorScheme='green' variant='solid'>발행</Badge>
        </NextLink>}
        {isShowPostState && post.hasTemporary && <NextLink href={`/boards/${post.boardId}/posts/${post.id}/edit`}>
          <Badge marginLeft='0.4rem' variant='outline'>임시저장</Badge>
        </NextLink>}
      </Td>
      <Td>{post.createDate}</Td>
      <Td>{post.viewCount}</Td>
    </Tr>;
  };

  const getPagination = (): ReactNode => {
    const buttonMaxLength: number = 5;
    const total: number = postList.total;
    const skip: number = postList.skip;
    const limit: number = postList.limit;

    const currentPage: number = (skip / limit) + 1;
    const totalPage: number = Math.ceil(total / limit);
    const paddingLength: number = Math.floor(buttonMaxLength / 2);

    let startPage: number = currentPage - paddingLength;
    let endPage: number = currentPage + paddingLength;

    if (startPage < 1) {
      endPage += startPage * -1;
      startPage = 1;
    }
    endPage = Math.min(endPage, totalPage);
    const buttonList: ReactNode[] = [];
    for (let page = startPage; page <= endPage; page++) {
      buttonList.push(<Button key={page}>{page}</Button>);
    }
    return <Box marginTop='0.4rem'>
      <ButtonGroup size='xs' variant='outline' isAttached>
        {...buttonList}
      </ButtonGroup>
    </Box>;
  };

  return (
    <TableContainer>
      <Table size='sm' variant='unstyled'>
        {isShowHeader && <Thead>
          <Tr>
            {isShowPostNumber && <Th>번호</Th>}
            <Th>제목</Th>
            <Th>작성일</Th>
            <Th>조회수</Th>
          </Tr>
        </Thead>}
        <Tbody>
          {postList.posts.map((post, index) => getRow(post, index))}
        </Tbody>
      </Table>
      {isShowPagination && getPagination()}
    </TableContainer>
  );
};

export default PostListTable;
