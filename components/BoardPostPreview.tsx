// react
import { useEffect, useState, } from 'react';
import NextLink from 'next/link';
import { Card, CardBody, CardHeader, Heading, IconButton, HStack, LinkBox, LinkOverlay, Alert, AlertTitle, } from '@chakra-ui/react';
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
            <NextLink href={`/boards/${board.id}`}>
              <IconButton icon={<MdMoreHoriz/>} aria-label='more posts' size='sm' variant='ghost'/>
            </NextLink>
          </HStack>
        </CardHeader>
      </LinkBox>
      <CardBody>
        {postList !== null && postList.posts.length === 0 && <Alert status='info' borderRadius='.5rem'>
          <AlertTitle>게시물이 존재하지 않습니다.</AlertTitle>
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
