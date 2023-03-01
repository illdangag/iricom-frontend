// react
import { useEffect, useState, } from 'react';
import NextLink from 'next/link';
import { Card, CardBody, CardHeader, Heading, Table, TableContainer, Tbody, Td, Tr, IconButton, HStack, } from '@chakra-ui/react';
import { MdMoreHoriz, } from 'react-icons/md';
import { useIricomAPI, } from '../hooks';
// etc
import { Board, Post, PostType, } from '../interfaces';

type Props = {
  board: Board,
  postMaxLength?: number,
}

const BoardPostPreview = ({
  board,
  postMaxLength = 5,
}: Props) => {
  const iricomAPI = useIricomAPI();

  const [postList, setPostList,] = useState<Post[] | null>(null);

  useEffect(() => {
    void iricomAPI.getPostList(board.id, 0, postMaxLength, PostType.POST)
      .then(postList => {
        setPostList(postList.posts);
      });
  }, []);

  // TODO 게시물이 존재하지 않는 경우에 디자인 수정
  return (
    <Card shadow='none'>
      <CardHeader>
        <HStack justifyContent='space-between'>
          <Heading size='sm' fontWeight='semibold'>
            {board.title}
          </Heading>
          <NextLink href={`/boards/${board.id}`}>
            <IconButton icon={<MdMoreHoriz/>} aria-label='more posts' size='sm' variant='ghost'/>
          </NextLink>
        </HStack>
      </CardHeader>
      <CardBody>
        {postList !== null && postList.length === 0 && <>
          게시물이 존재하지 않습니다.
        </>}
        {postList !== null && postList.length > 0 && <TableContainer>
          <Table size='sm' variant='unstyled'>
            <Tbody>
              <Tr>
                <Td>글 제목</Td>
              </Tr>
              <Tr>
                <Td>글 제목</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>}
      </CardBody>
    </Card>
  );
};

export default BoardPostPreview;
