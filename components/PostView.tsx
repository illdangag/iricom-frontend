// react
import { useState, } from 'react';
import { Box, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Flex, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer, Text, useToast, VStack, } from '@chakra-ui/react';
import { MdMoreHoriz, MdOutlineReport, MdShare, MdThumbDownOffAlt, MdThumbUpOffAlt, } from 'react-icons/md';
import { useIricomAPI, } from '../hooks';
import { RequireLoginAlert, } from '../components/alerts';
// etc
import { NotExistTokenError, Post, VoteType, } from '../interfaces';
import { getFormattedDateTime, } from '../utils';

import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

type Props = {
  post: Post,
  onChange?: (post: Post) => void,
}

enum ViewState {
  IDLE,
  REQUEST,
}

const PostView = ({
  post,
  onChange = () => {
  },
}: Props) => {
  const iricomAPI = useIricomAPI();
  const toast = useToast();

  const [viewState, setViewState,] = useState<ViewState>(ViewState.IDLE);
  const [showLoginAlert, setShowLoginAlert,] = useState<boolean>(false);

  const onClickUpvote = () => {
    setViewState(ViewState.REQUEST);
    void iricomAPI.votePost(post.boardId, post.id, VoteType.UP)
      .then((post) => {
        onChange(post);
      })
      .catch((error: Error) => {
        if (error instanceof NotExistTokenError) {
          setShowLoginAlert(true);
        } else {
          toast({
            title: '이미 \'좋아요\'한 게시물입니다.',
            status: 'warning',
            duration: 3000,
          });
        }
      })
      .finally(() => {
        setViewState(ViewState.IDLE);
      });
  };

  const onClickDownvote = () => {
    setViewState(ViewState.REQUEST);
    void iricomAPI.votePost(post.boardId, post.id, VoteType.DOWN)
      .then((post) => {
        onChange(post);
      })
      .catch((error: Error) => {
        if (error instanceof NotExistTokenError) {
          setShowLoginAlert(true);
        } else {
          toast({
            title: '이미 \'싫어요\'한 게시물입니다.',
            status: 'warning',
            duration: 3000,
          });
        }
      })
      .finally(() => {
        setViewState(ViewState.IDLE);
      });
  };

  const onClickRequireLoginAlertClose = () => {
    setShowLoginAlert(false);
  };

  return (
    <VStack alignItems='stretch'>
      <Card shadow='none' borderRadius='0'>
        <CardHeader>
          <Flex flexDirection='column'>
            <Flex flexDirection='row' justifyContent='space-between'>
              <Heading size='md' fontWeight='medium'>{post.title}</Heading>
              <Menu>
                <MenuButton as={IconButton} icon={<MdMoreHoriz/>} variant='ghost' size='sm'/>
                <MenuList>
                  <MenuItem icon={<MdShare/>}>
                    공유
                  </MenuItem>
                  <MenuItem icon={<MdOutlineReport/>}>
                    신고
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
            <Flex marginTop='0.4rem'>
              <Text fontSize='0.8rem'>{post.account.nickname}</Text>
              <Spacer/>
              <VStack alignItems='flex-end' spacing='0.2rem'>
                <Text fontSize='0.8rem'>{getFormattedDateTime(post.createDate)}</Text>
                <Text fontSize='0.8rem'>조회수: {post.viewCount}</Text>
              </VStack>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody>
          <Box>
            <MarkdownPreview
              source={post.content}
              data-color-mode='light'
            />
          </Box>
        </CardBody>
        <CardFooter justifyContent='center'>
          <ButtonGroup>
            <Button
              rightIcon={<MdThumbUpOffAlt/>}
              onClick={onClickUpvote}
              isDisabled={viewState === ViewState.REQUEST}
            >
              {post.upvote}
            </Button>
            <Button
              rightIcon={<MdThumbDownOffAlt/>}
              onClick={onClickDownvote}
              isDisabled={viewState === ViewState.REQUEST}
            >
              {post.downvote}
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
      <RequireLoginAlert
        isOpen={showLoginAlert}
        text='좋아요/싫어요 하기 위해서는 로그인이 필요합니다.'
        successURL={`/boards/${post.boardId}/posts/${post.id}`}
        onClose={onClickRequireLoginAlertClose}
      />
    </VStack>
  );
};

export default PostView;
