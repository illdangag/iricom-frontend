// react
import { useState, } from 'react';
import NextLink from 'next/link';
import { Badge, Button, Divider, HStack, LinkBox, LinkOverlay, Text, VStack, } from '@chakra-ui/react';
import { MdOutlineModeComment, MdThumbDownOffAlt, MdThumbUpOffAlt, } from 'react-icons/md';
import Pagination from './Pagination';
// etc
import { Post, PostList, } from '../interfaces';
import { getFormattedDateTime, } from '../utils';
import PostDeleteAlert from './alerts/PostDeleteAlert';

type Props = {
  postList: PostList,
  page: number,
  isShowPostState?: boolean,
  isShowPagination?: boolean,
  isShowEditButton?: boolean,
  onClickPagination?: (page: number) => void,
  onChangePost?: () => void,
}

const PostListTable = ({
  postList,
  page,
  isShowPostState = true,
  isShowPagination = true,
  isShowEditButton = false,
  onClickPagination = () => {},
  onChangePost = () => {},
}: Props) => {

  const [isShowDeleteAlert, setShowDeleteAlert,] = useState<boolean>(false);
  const [deletePost, setDeletePost,] = useState<Post | null>(null);

  const onClickDelete = (post: Post) => {
    setDeletePost(post);
    setShowDeleteAlert(true);
  };

  const onClickDeleteAlertCancel = () => {
    setShowDeleteAlert(false);
  };

  const onClickDeleteAlertConfirm = () => {
    setShowDeleteAlert(false);
    onChangePost();
  };

  const getPostItem = (post: Post, key: string) => (
    <LinkBox key={key}>
      <VStack alignItems='stretch'>
        <HStack justifyContent='space-between'>
          <HStack>
            <Text>
              <LinkOverlay as={NextLink} href={`/boards/${post.boardId}/posts/${post.id}`}>
                {post.title}
              </LinkOverlay>
            </Text>
            {isShowPostState && (
              <HStack>
                {post.isPublish && <Badge colorScheme='blue'>발행</Badge>}
                {post.hasTemporary && <Badge colorScheme='gray'>임시저장</Badge>}
              </HStack>
            )}
          </HStack>
          {isShowEditButton && (
            <HStack>
              <NextLink href={`/boards/${post.boardId}/posts/${post.id}/edit`}>
                <Button size='xs' variant='outline'>수정</Button>
              </NextLink>
              <Button size='xs' colorScheme='red' variant='outline' onClick={() => onClickDelete(post)}>삭제</Button>
            </HStack>
          )}
        </HStack>
        {/* 좋아요/싫어요/댓글수 수정/삭제 */}
        <HStack justifyContent='space-between'>
          <HStack>
            <Badge><HStack><MdThumbUpOffAlt size='.8rem'/><Text fontSize='.8rem'>{post.upvote}</Text></HStack></Badge>
            <Badge><HStack><MdThumbDownOffAlt size='.8rem'/><Text fontSize='.8rem'>{post.downvote}</Text></HStack></Badge>
            <Badge><HStack><MdOutlineModeComment size='.8rem'/><Text fontSize='.8rem'>{post.commentCount}</Text></HStack></Badge>
          </HStack>
        </HStack>
        {/* 상세 정보 */}
        <HStack>
          <Text fontSize='.8rem'>{post.account.nickname}</Text>
          <Divider orientation='vertical'/>
          <Text fontSize='.8rem'>{getFormattedDateTime(post.createDate)}</Text>
          <Divider orientation='vertical'/>
          <Text fontSize='.8rem'>조회수: {post.viewCount}</Text>
        </HStack>
      </VStack>
    </LinkBox>
  );

  return (
    <>
      <VStack alignItems='stretch' spacing='2rem'>
        {postList.posts.map((post: Post, index: number) => getPostItem(post, '' + index))}
      </VStack>
      {isShowPagination && <Pagination page={page} listResponse={postList} onClick={onClickPagination}/>}
      <PostDeleteAlert
        isOpen={isShowDeleteAlert}
        post={deletePost}
        onClose={onClickDeleteAlertCancel}
        onConfirm={onClickDeleteAlertConfirm}
      />
    </>
  );
};

export default PostListTable;
