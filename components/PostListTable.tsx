// react
import { ReactNode, useRef, useState, } from 'react';
import NextLink from 'next/link';
import { Badge, Button, ButtonGroup, Divider, Heading, HStack, Text, VStack, AlertDialog, AlertDialogOverlay, AlertDialogContent,
  LinkBox, LinkOverlay, AlertDialogHeader, AlertDialogFooter, AlertDialogBody, } from '@chakra-ui/react';
import { MdOutlineModeComment, MdThumbDownOffAlt, MdThumbUpOffAlt, } from 'react-icons/md';
import { useIricomAPI, } from '../hooks';
// etc
import { Post, PostList, } from '../interfaces';
import { getFormattedDateTime, } from '../utils';

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
  const deleteAlertCancelRef = useRef();
  const iricomAPI = useIricomAPI();

  const [showDeleteAlert, setShowDeleteAlert,] = useState<boolean>(false);
  const [deletePost, setDeletePost,] = useState<Post | null>(null);

  const onClickDeleteAlertCancel = () => {
    setShowDeleteAlert(false);
  };

  const onClickDeleteAlertConfirm = () => {
    setShowDeleteAlert(false);
    void iricomAPI.deletePost(deletePost.boardId, deletePost.id)
      .then(() => {
        onChangePost();
      });
  };

  const onClickDelete = (post: Post) => {
    setDeletePost(post);
    setShowDeleteAlert(true);
  };

  const getPagination = (): ReactNode => {
    const buttonMaxLength: number = 5;
    const total: number = postList.total;
    const limit: number = postList.limit;

    const currentPage: number = postList.currentPage;
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
    for (let indexPage = startPage; indexPage <= endPage; indexPage++) {
      buttonList.push(<Button key={indexPage} backgroundColor={indexPage === page ? 'gray.100' : 'transparent'} onClick={() => {onClickPagination(indexPage);}}>{indexPage}</Button>);
    }

    return <HStack justifyContent='center' marginTop='0.4rem'>
      <ButtonGroup size='xs' variant='outline' isAttached>
        {...buttonList}
      </ButtonGroup>
    </HStack>;
  };

  const getPostItem = (post: Post, index: number) => {
    return <LinkBox key={index} as='article'>
      <VStack alignItems='stretch'>
        <HStack justifyContent='space-between'>
          <Heading size='xs' fontWeight='medium' width='100%'>
            <LinkOverlay as={NextLink} href={`/boards/${post.boardId}/posts/${post.id}`}>
              {post.title}
            </LinkOverlay>
          </Heading>
          {isShowPostState && <HStack>
            {post.isPublish && <Badge colorScheme='blue'>발행</Badge>}
            {post.hasTemporary && <Badge colorScheme='gray'>임시저장</Badge>}
          </HStack>}
        </HStack>
        <HStack alignItems='center'>
          <Badge><HStack><MdThumbUpOffAlt size='.8rem'/><Text fontSize='.8rem'>{post.upvote}</Text></HStack></Badge>
          <Badge><HStack><MdThumbDownOffAlt size='.8rem'/><Text fontSize='.8rem'>{post.downvote}</Text></HStack></Badge>
          <Badge><HStack><MdOutlineModeComment size='.8rem'/><Text fontSize='.8rem'>{post.commentCount}</Text></HStack></Badge>
        </HStack>
        <HStack>
          <Text fontSize='.5rem'>작성시간: {getFormattedDateTime(post.createDate)}</Text>
          <Divider orientation='vertical'/>
          <Text fontSize='.5rem'>조회수: {post.viewCount}</Text>
        </HStack>
        {isShowEditButton && <HStack justifyContent='flex-end'>
          <NextLink href={`/boards/${post.boardId}/posts/${post.id}/edit`}><Button size='xs'>수정</Button></NextLink>
          <Button size='xs' colorScheme='red' variant='solid' onClick={() => onClickDelete(post)}>삭제</Button>
        </HStack>}
        <Divider/>
      </VStack>
    </LinkBox>;
  };

  return (
    <>
      <VStack alignItems='stretch' spacing='1rem'>
        {postList.posts.map((post: Post, index: number) => getPostItem(post, index))}
      </VStack>
      {isShowPagination && getPagination()}
      <AlertDialog isOpen={showDeleteAlert} onClose={onClickDeleteAlertCancel} leastDestructiveRef={deleteAlertCancelRef} size='xs'>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              게시물 삭제
            </AlertDialogHeader>
            <AlertDialogBody>
              {deletePost && <Text>"{deletePost.title}" 게시물을 삭제합니다.</Text>}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={deleteAlertCancelRef} onClick={onClickDeleteAlertCancel}>취소</Button>
              <Button colorScheme='red' onClick={onClickDeleteAlertConfirm} marginLeft='1rem'>삭제</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default PostListTable;
