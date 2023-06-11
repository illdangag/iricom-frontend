// react
import NextLink from 'next/link';
import { Heading, LinkBox, LinkOverlay, Alert, Text, Flex, VStack, } from '@chakra-ui/react';
// etc
import { Board, PostList, } from '../interfaces';
import PostListTable from './PostListTable';
import { BORDER_RADIUS, } from '../constants/style';

type Props = {
  board: Board,
  postList: PostList,
  postMaxLength?: number,
}

const BoardPostPreview = ({
  board,
  postList,
}: Props) => {
  return (
    <VStack alignItems='start'>
      <LinkBox>
        <Flex>
          <Heading size='sm' fontWeight='semibold'>
            <LinkOverlay as={NextLink} href={`/boards/${board.id}`}>
              {board.title}
            </LinkOverlay>
          </Heading>
        </Flex>
      </LinkBox>
      {postList !== null && postList.posts.length === 0 && <Alert status='info' borderRadius={BORDER_RADIUS}>
        <Text>게시판에 게시물이 없습니다.</Text>
      </Alert>}
      {postList !== null && postList.posts.length > 0 && <PostListTable
        postList={postList}
        isShowPagination={false}
        isShowPostState={false}
        page={0}
      />}
    </VStack>
  );
};

export default BoardPostPreview;
