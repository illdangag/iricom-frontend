// react
import { useEffect, useState, } from 'react';
import NextLink from 'next/link';
import { Card, CardBody, CardHeader, Heading, IconButton, HStack, LinkBox, LinkOverlay, Alert, AlertTitle, Text, Divider, } from '@chakra-ui/react';
import { MdMoreHoriz, } from 'react-icons/md';
import { useIricomAPI, } from '../hooks';
// etc
import { Board, PostList, PostType, } from '../interfaces';
import PostListTable from './PostListTable';

type Props = {
  board: Board,
  postMaxLength?: number,
}

const BoardPostPreview = ({
  board,
  postMaxLength = 5,
}: Props) => {
  const iricomAPI = useIricomAPI();

  const [postList, setPostList,] = useState<PostList | null>(null);

  useEffect(() => {
    void iricomAPI.getPostList(board.id, 0, postMaxLength, PostType.POST)
      .then(postList => {
        setPostList(postList);
      });
  }, []);

  return (
    <Card shadow='none'>
      <LinkBox>
        <CardHeader>
          <HStack justifyContent='space-between'>
            <Heading size='md' fontWeight='semibold'>
              <LinkOverlay as={NextLink} href={`/boards/${board.id}`}>
                {board.title}
              </LinkOverlay>
            </Heading>
          </HStack>
        </CardHeader>
      </LinkBox>
      <CardBody paddingTop='0'>
        {postList !== null && postList.posts.length === 0 && <Alert status='info' borderRadius='.375rem'>
          <Text>게시판에 게시물이 없습니다.</Text>
        </Alert>}
        {postList !== null && postList.posts.length > 0 && <PostListTable
          postList={postList}
          isShowPagination={false}
          isShowPostState={false}
          page={0}
        />}
      </CardBody>
    </Card>
  );
};

export default BoardPostPreview;
