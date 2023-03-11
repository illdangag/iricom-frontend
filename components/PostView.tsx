// react
import { VStack, Card, CardHeader, CardBody, Text, Heading, Flex, Spacer, CardFooter, ButtonGroup, IconButton, Menu, MenuButton, MenuList,
  MenuItem, Button, } from '@chakra-ui/react';
import { MdThumbUpOffAlt, MdThumbDownOffAlt, MdMoreHoriz, MdShare, MdOutlineReport, } from 'react-icons/md';
// etc
import { Post, } from '../interfaces';

type Props = {
  post: Post,
}

const PostView = ({
  post,
}: Props) => {

  const getPostDate = (time: Date): string => {
    const postDate: Date = new Date(time);
    const year: number = postDate.getFullYear();
    const month: number = postDate.getMonth() + 1;
    const date: number = postDate.getDate();
    let hour: number = postDate.getHours();
    const minute: number = postDate.getMinutes();

    return `${year}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date} ${hour >= 10 ? hour : '0' + hour}:${minute}`;
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
              <Text fontSize='0.8rem'>{getPostDate(post.createDate)}</Text>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody>
          {post.content}
        </CardBody>
        <CardFooter justifyContent='center'>
          <ButtonGroup>
            <Button rightIcon={<MdThumbUpOffAlt/>}>{post.upvote}</Button>
            <Button rightIcon={<MdThumbDownOffAlt/>}>{post.downvote}</Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </VStack>
  );
};

export default PostView;
