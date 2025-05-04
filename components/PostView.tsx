// react
import { useState, } from 'react';
import dynamic from 'next/dynamic';
import { Alert, AlertDescription, AlertIcon, Box, Button, ButtonGroup, Divider, Flex, Heading, HStack, Spacer, Text, useToast, VStack, } from '@chakra-ui/react';
import { MdBlock, MdOutlineReport, MdShare, MdThumbDownOffAlt, MdThumbUpOffAlt, } from 'react-icons/md';
import { useIricom, } from '@root/hooks';
import { PostBlockAlert, PostReportAlert, PostUnblockAlert, } from './alerts';
import AccountNameTag from './AccountNameTag';

// store
import { useSetRecoilState, } from 'recoil';
import requireLoginPopupAtom, { RequireLoginPopup, } from '../recoil/requireLoginPopup';

// etc
import { IricomError, NotExistTokenError, Post, PostState, TokenInfo, VoteType, } from '../interfaces';
import { BORDER_RADIUS, } from '../constants/style';
import { getFormattedDateTime, getTokenInfo, } from '../utils';
import '@uiw/react-markdown-preview/markdown.css';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

type Props = {
  post: Post,
  isShowVote: boolean,
  isShowShare: boolean,
  isShowReport: boolean,
  isShowBlock: boolean,
  onChange?: (post: Post) => void,
}

enum ViewState {
  IDLE,
  REQUEST,
}

const PostView = ({
  post,
  isShowVote = false,
  isShowShare = false,
  isShowReport = false,
  isShowBlock = false,
  onChange = () => {},
}: Props) => {
  const isShowFooter: boolean = isShowShare || isShowReport || isShowBlock;

  const iricomAPI = useIricom();
  const toast = useToast();

  const setRequireLoginPopup = useSetRecoilState<RequireLoginPopup>(requireLoginPopupAtom);

  const [viewState, setViewState,] = useState<ViewState>(ViewState.IDLE);
  const [isOpenReport, setOpenReport,] = useState<boolean>(false);
  const [isOpenBlock, setOpenBlock,] = useState<boolean>(false);
  const [isOpenUnblock, setOpenUnblock,] = useState<boolean>(false);

  const onClickUpvote = async () => {
    setViewState(ViewState.REQUEST);

    try {
      const votedPost: Post = await iricomAPI.votePost(post.boardId, post.id, VoteType.UP);
      onChange(votedPost);
    } catch (error) {
      const iricomError: IricomError = error as IricomError;
      toast({
        title: iricomError.message,
        status: 'warning',
        duration: 3000,
      });
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

  const onClickBlockButton = () => {
    setOpenBlock(true);
  };

  const onClickUnBlockButton = () => {
    setOpenUnblock(true);
  };

  const onCloseReport = () => {
    setOpenReport(false);
  };

  const onCloseBlock = async () => {
    setOpenBlock(false);

    try {
      const refreshPost = await iricomAPI.getPost(post.boardId, post.id, PostState.PUBLISH);
      onChange(refreshPost);
    } catch (error) {
      const iricomError: IricomError = error as IricomError;
      toast({
        title: iricomError.message,
        status: 'warning',
        duration: 3000,
      });
    }
  };

  const onCloseUnblock = async () => {
    setOpenUnblock(false);

    try {
      const refreshPost = await iricomAPI.getPost(post.boardId, post.id, PostState.PUBLISH);
      onChange(refreshPost);
    } catch (error) {
      const iricomError: IricomError = error as IricomError;
      toast({
        title: iricomError.message,
        status: 'warning',
        duration: 3000,
      });
    }
  };

  return (
    <>
      <Box>
        <PostViewHeader post={post}/>
        <Divider marginTop='0.8rem' marginBottom='0.8rem'/>
        <Box padding='0.5rem' marginBottom='0.5rem'>
          {post.content && <MarkdownPreview
            source={post.content}
            data-color-mode='light'
            style={{ backgroundColor: '#ffffff00', }}
          />}
          {post.blocked && <Alert status='error' borderRadius={BORDER_RADIUS}>
            <AlertIcon/>
            <AlertDescription>차단된 게시물입니다.</AlertDescription>
          </Alert>}
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
      {isShowFooter && <HStack justifyContent='flex-end' marginTop='1rem'>
        <ButtonGroup variant='outline' size='xs'>
          {isShowBlock && !post.blocked && <Button
            leftIcon={<MdBlock/>}
            onClick={onClickBlockButton}
          >
            차단
          </Button>}
          {isShowBlock && post.blocked && <Button
            leftIcon={<MdBlock/>}
            onClick={onClickUnBlockButton}
          >
            차단 해제
          </Button>}
        </ButtonGroup>
        <Spacer/>
        <ButtonGroup variant='outline' size='xs'>
          {isShowShare && <Button
            leftIcon={<MdShare/>}
            onClick={onClickShareButton}
          >
            공유
          </Button>}
          {isShowReport && <Button
            leftIcon={<MdOutlineReport/>}
            onClick={onClickReportButton}
          >
            신고
          </Button>}
        </ButtonGroup>
      </HStack>}
      <PostReportAlert post={post} isOpen={isOpenReport} onClose={onCloseReport}/>
      <PostBlockAlert post={post} isOpen={isOpenBlock} onClose={onCloseBlock}/>
      <PostUnblockAlert post={post} isOpen={isOpenUnblock} onClose={onCloseUnblock}/>
    </>
  );
};

type HeaderProps = {
  post: Post,
}

const PostViewHeader = ({
  post,
}: HeaderProps) => {
  return <Flex flexDirection='column'>
    <Flex flexDirection='row' justifyContent='space-between'>
      {!post.blocked && <Heading size='lg' fontWeight='medium'>{post.title}</Heading>}
    </Flex>
    <Flex marginTop='1rem'>
      <AccountNameTag account={post.account} isShowSendPersonalMessage={true}/>
      <Spacer/>
      <VStack alignItems='flex-end' spacing='0.2rem'>
        <Text fontSize='0.8rem'>{getFormattedDateTime(post.createDate)}</Text>
        <Text fontSize='0.8rem'>조회수: {post.viewCount}</Text>
      </VStack>
    </Flex>
  </Flex>;
};

export default PostView;
