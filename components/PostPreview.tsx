// react
import { VStack, Card, CardHeader, CardBody, Text, Heading, Flex, Spacer, CardFooter, ButtonGroup, IconButton, Menu, MenuButton, MenuList,
  MenuItem, } from '@chakra-ui/react';
import { MdThumbUpOffAlt, MdThumbDownOffAlt, MdMoreHoriz, MdShare, MdOutlineReport, } from 'react-icons/md';
// etc
import { Post, } from '../interfaces';

type Props = {
  post: Post,
}

const PostPreview = ({
  post,
}: Props) => {

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
              <Text fontSize='0.8rem'>{post.createDate}</Text>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody>
          {post.content}
        </CardBody>
        <CardFooter justifyContent='center'>
          <ButtonGroup>
            <IconButton aria-label='upvote' icon={<MdThumbUpOffAlt/>}/>
            <IconButton aria-label='upvote' icon={<MdThumbDownOffAlt/>}/>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </VStack>
  );
};

export default PostPreview;
