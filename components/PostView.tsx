// react
import { useState, } from 'react';
import {
  Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Flex, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList,
  Spacer, Text, VStack, useToast, Box,
} from '@chakra-ui/react';
import { MdMoreHoriz, MdOutlineReport, MdShare, MdThumbDownOffAlt, MdThumbUpOffAlt, } from 'react-icons/md';
import { useIricomAPI, } from '../hooks';

import dynamic from 'next/dynamic';
const MDPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});


// etc
import { Post, VoteType, } from '../interfaces';
import { getFormattedDateTime, } from '../utils';

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
  onChange = () => {},
}: Props) => {
  const iricomAPI = useIricomAPI();
  const toast = useToast();

  const [viewState, setViewState,] = useState<ViewState>(ViewState.IDLE);

  const onClickUpvote = () => {
    setViewState(ViewState.REQUEST);
    void iricomAPI.votePost(post.boardId, post.id, VoteType.UP)
      .then((post) => {
        onChange(post);
      })
      .catch(() => {
        toast({
          title: '이미 \'좋아요\'한 게시물입니다.',
          status: 'warning',
          duration: 3000,
        });
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
      .catch(() => {
        toast({
          title: '이미 \'싫어요\'한 게시물입니다.',
          status: 'warning',
          duration: 3000,
        });
      })
      .finally(() => {
        setViewState(ViewState.IDLE);
      });
  };

  return (
    <VStack alignItems='stretch'>
      <Card shadow='none'>
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
            <MDPreview source={post.content}/>
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
    </VStack>
  );
};

export default PostView;
