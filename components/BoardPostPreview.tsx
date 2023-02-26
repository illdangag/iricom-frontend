// react
import { useEffect, useState, } from 'react';
import { Card, CardBody, CardHeader, Heading, Table, TableContainer, Tbody, Td, Tr, } from '@chakra-ui/react';
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
    void iricomAPI.getPostList(board, 0, postMaxLength, PostType.POST)
      .then(postList => {
        setPostList(postList.posts);
      });
  }, []);

  return (
    <Card shadow='none'>
      <CardHeader>
        <Heading size='sm' fontWeight='semibold'>
          {board.title}
        </Heading>
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
