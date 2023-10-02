// react
import { useState, } from 'react';
import { Box, Button, ButtonGroup, Flex, Heading, Spacer, Text, useToast, VStack, } from '@chakra-ui/react';
import { MdOutlineReport, MdShare, MdThumbDownOffAlt, MdThumbUpOffAlt, } from 'react-icons/md';
import { useIricomAPI, } from '../hooks';
import { PostReportAlert, } from './alerts';

// store
import { useSetRecoilState, } from 'recoil';
import requireLoginPopupAtom, { RequireLoginPopup, } from '../recoil/requireLoginPopup';

// etc
import { NotExistTokenError, Post, TokenInfo, VoteType, } from '../interfaces';
import { getFormattedDateTime, getTokenInfo, } from '../utils';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

type Props = {
  post: Post,
  isShowVote?: boolean,
  isShowFooter?: boolean,
  onChange?: (post: Post) => void,
}

enum ViewState {
  IDLE,
  REQUEST,
}

const PostView = ({
  post,
  onChange = () => {},
  isShowVote = true,
  isShowFooter = true,
}: Props) => {
  const iricomAPI = useIricomAPI();
  const toast = useToast();

  const setRequireLoginPopup = useSetRecoilState<RequireLoginPopup>(requireLoginPopupAtom);

  const [viewState, setViewState,] = useState<ViewState>(ViewState.IDLE);
  const [isOpenReport, setOpenReport,] = useState<boolean>(false);

  const onClickUpvote = async () => {
    setViewState(ViewState.REQUEST);

    try {
      const votedPost: Post = await iricomAPI.votePost(post.boardId, post.id, VoteType.UP);
      onChange(votedPost);
    } catch (error) {
      if (!(error instanceof NotExistTokenError)) {
        toast({
          title: '이미 \'좋아요\'한 게시물입니다.',
          status: 'warning',
          duration: 3000,
        });
      }
    } finally {
      setViewState(ViewState.IDLE);
    }
  };

  const onClickDownvote = async () => {
    setViewState(ViewState.REQUEST);

    try {
      const votedPost: Post = await iricomAPI.votePost(post.boardId, post.id, VoteType.DOWN);
      onChange(votedPost);
    } catch (error) {
      if (!(error instanceof NotExistTokenError)) {
        toast({
          title: '이미 \'싫어요\'한 게시물입니다.',
          status: 'warning',
          duration: 3000,
        });
      }
    } finally {
      setViewState(ViewState.IDLE);
    }
  };

  const onClickShareButton = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      toast({
        title: '게시물 링크를 복사하였습니다.',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: '클립보드 접근에 실패하였습니다.',
        status: 'warning',
        duration: 3000,
      });
    }
  };

  const onClickReportButton = async () => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    if (tokenInfo !== null) {
      setOpenReport(true);
    } else {
      setRequireLoginPopup({
        isShow: true,
        message: '게시물을 신고하기 위해서는 로그인이 필요합니다.',
        successURL: location.pathname + location.search,
      });
    }
  };

  const onCloseReport = async () => {
    setOpenReport(false);
  };

  return (
    <>
      <Box>
        <Flex flexDirection='column'>
          <Flex flexDirection='row' justifyContent='space-between'>
            <Heading size='lg' fontWeight='medium'>{post.title}</Heading>
          </Flex>
          <Flex marginTop='1rem'>
            <Text fontSize='0.8rem'>{post.account.nickname}</Text>
            <Spacer/>
            <VStack alignItems='flex-end' spacing='0.2rem'>
              <Text fontSize='0.8rem'>{getFormattedDateTime(post.createDate)}</Text>
              <Text fontSize='0.8rem'>조회수: {post.viewCount}</Text>
            </VStack>
          </Flex>
        </Flex>
        <Box padding='0.5rem'>
          <MarkdownPreview
            source={post.content}
            data-color-mode='light'
            style={{ backgroundColor: '#ffffff00', }}
          />
        </Box>
      </Box>
      {isShowVote && <Flex justifyContent='center'>
        <ButtonGroup variant='outline'>
          <Button
            rightIcon={<MdThumbUpOffAlt/>}
            onClick={onClickUpvote}
            isDisabled={viewState === ViewState.REQUEST}
            size='sm'
          >
            {post.upvote}
          </Button>
          <Button
            rightIcon={<MdThumbDownOffAlt/>}
            onClick={onClickDownvote}
            isDisabled={viewState === ViewState.REQUEST}
            size='sm'
          >
            {post.downvote}
          </Button>
        </ButtonGroup>
      </Flex>}
      {isShowFooter && <Flex justifyContent='flex-end' marginTop='1rem'>
        <ButtonGroup variant='outline'>
          <Button
            leftIcon={<MdShare/>}
            size='xs'
            onClick={onClickShareButton}
          >
            공유
          </Button>
          <Button
            leftIcon={<MdOutlineReport/>}
            size='xs'
            onClick={onClickReportButton}
          >
            신고
          </Button>
        </ButtonGroup>
      </Flex>}
      <PostReportAlert
        post={post}
        isOpen={isOpenReport}
        onClose={onCloseReport}
      />
    </>
  );
};

export default PostView;
