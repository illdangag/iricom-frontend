// react
import { useState, } from 'react';
import { Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Flex, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer, Text, VStack, } from '@chakra-ui/react';
import { MdMoreHoriz, MdOutlineReport, MdShare, MdThumbDownOffAlt, MdThumbUpOffAlt, } from 'react-icons/md';
import { useIricomAPI, } from '../hooks';
// etc
import { Post, VoteType, } from '../interfaces';

type Props = {
  post: Post,
  onChange?: (post: Post) => void,
}

enum PageState {
  IDLE,
  REQUEST,
}

const PostView = ({
  post,
  onChange = () => {},
}: Props) => {
  const iricomAPI = useIricomAPI();

  const [pageState, setPageState,] = useState<PageState>(PageState.IDLE);

  const getPostDate = (time: Date): string => {
    const postDate: Date = new Date(time);
    const year: number = postDate.getFullYear();
    const month: number = postDate.getMonth() + 1;
    const date: number = postDate.getDate();
    let hour: number = postDate.getHours();
    const minute: number = postDate.getMinutes();

    return `${year}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date} ${hour >= 10 ? hour : '0' + hour}:${minute}`;
  };

  const onClickUpvote = () => {
    setPageState(PageState.REQUEST);
    void iricomAPI.votePost(post.boardId, post.id, VoteType.UP)
      .then((post) => {
        setPageState(PageState.IDLE);
        onChange(post);
      });
  };

  const onClickDownvote = () => {
    setPageState(PageState.REQUEST);
    void iricomAPI.votePost(post.boardId, post.id, VoteType.DOWN)
      .then((post) => {
        setPageState(PageState.IDLE);
        onChange(post);
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
                <Text fontSize='0.8rem'>{getPostDate(post.createDate)}</Text>
                <Text fontSize='0.8rem'>조회수: {post.viewCount}</Text>
              </VStack>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody>
          {post.content}
        </CardBody>
        <CardFooter justifyContent='center'>
          <ButtonGroup>
            <Button
              rightIcon={<MdThumbUpOffAlt/>}
              onClick={onClickUpvote}
              isDisabled={pageState === PageState.REQUEST}
            >
              {post.upvote}
            </Button>
            <Button
              rightIcon={<MdThumbDownOffAlt/>}
              onClick={onClickDownvote}
              isDisabled={pageState === PageState.REQUEST}
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
