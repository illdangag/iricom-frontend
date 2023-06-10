// react
import { useEffect, useState, } from 'react';
import NextLink from 'next/link';
import { Heading, LinkBox, LinkOverlay, Alert, Text, Flex, VStack, } from '@chakra-ui/react';
import { useIricomAPI, } from '../hooks';
// etc
import { Board, PostList, PostType, } from '../interfaces';
import PostListTable from './PostListTable';
import { BORDER_RADIUS, } from '../constants/style';

type Props = {
  board: Board,
  postMaxLength?: number,
}

const BoardPostPreview = ({
  board,
  postMaxLength = 5, // 기본적으로 게시판 미리보기에서는 최대 5개의 게시물을 표현
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
