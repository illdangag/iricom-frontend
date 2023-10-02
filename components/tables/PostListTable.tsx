// react
import { useState, } from 'react';
import NextLink from 'next/link';
import { Badge, Button, Divider, Flex, HStack, LinkBox, LinkOverlay, Text, VStack, } from '@chakra-ui/react';
import { MdOutlineModeComment, MdThumbDownOffAlt, MdThumbUpOffAlt, } from 'react-icons/md';
import Pagination from './Pagination';
// etc
import { Post, PostList, } from '../../interfaces';
import { getFormattedDateTime, } from '../../utils';
import PostDeleteAlert from '../alerts/PostDeleteAlert';

type Props = {
  postList: PostList,
  page: number,
  pageLinkHref?: string,
  isShowPostState?: boolean,
  isShowPagination?: boolean,
  isShowEditButton?: boolean,
  onChangePost?: () => void,
}

const PostListTable = ({
  postList,
  page,
  pageLinkHref = '?page={{page}}',
  isShowPostState = true,
  isShowPagination = true,
  isShowEditButton = false,
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
      <VStack align='stretch' spacing='0.2rem'>
        <HStack justifyContent='space-between'>
          <Flex
            flexDirection={{ base: 'column', md: 'row', }}
            justifyContent='start'
          >
            <HStack>
              <Text>
                <LinkOverlay as={NextLink} href={`/boards/${post.boardId}/posts/${post.id}`}>
                  {post.title}
                </LinkOverlay>
              </Text>
              {isShowPostState && (
                <HStack>
                  {post.publish && <Badge colorScheme='blue'>발행</Badge>}
                  {post.hasTemporary && <Badge colorScheme='gray'>임시저장</Badge>}
                </HStack>
              )}
            </HStack>
            <Flex
              flexDirection='row'
              alignItems='center'
              marginLeft={{ base: '0', md: '0.5rem', }}
              marginTop={{ base: '0.2rem', md: '0', }}
            >
              <HStack>
                <Badge><HStack><MdThumbUpOffAlt size='.8rem'/><Text fontSize='.8rem'>{post.upvote}</Text></HStack></Badge>
                <Badge><HStack><MdThumbDownOffAlt size='.8rem'/><Text fontSize='.8rem'>{post.downvote}</Text></HStack></Badge>
                <Badge><HStack><MdOutlineModeComment size='.8rem'/><Text fontSize='.8rem'>{post.commentCount}</Text></HStack></Badge>
              </HStack>
            </Flex>
          </Flex>
          {isShowEditButton && (
            <HStack marginLeft='auto'>
              <NextLink href={`/boards/${post.boardId}/posts/${post.id}/edit`}>
                <Button size='xs' variant='outline'>수정</Button>
              </NextLink>
              <Button size='xs' colorScheme='red' variant='outline' onClick={() => onClickDelete(post)}>삭제</Button>
            </HStack>
          )}
        </HStack>
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

  const getPostList = (): JSX.Element[] => {
    const postElementList: JSX.Element[] = postList.posts.map((post: Post, index: number) => getPostItem(post, '' + index));
    const elementList: JSX.Element[] = [];
    for (let index = 0; index < postElementList.length; index++) {
      const postElement: JSX.Element = postElementList[index];
      elementList.push(postElement);
      if (index < postElementList.length - 1) {
        elementList.push(<Divider key={'divider-' + index}/>);
      }
    }
    return elementList;
  };

  return (
    <>
      <VStack alignItems='stretch' spacing='1rem' align='stretch'>
        {getPostList()}
      </VStack>
      {isShowPagination && <Pagination
        page={page}
        pageLinkHref={pageLinkHref}
        listResponse={postList}
      />}
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