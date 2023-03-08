// react
import { VStack, Card, CardHeader, CardBody, Text, Heading, Flex, Spacer, Box, } from '@chakra-ui/react';
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
        <CardHeader flexDirection='row'>
          <Flex alignItems='center'>
            <Heading size='md' fontWeight='medium'>{post.title}</Heading>
            <Spacer/>
            <Box>
              <Text fontSize='.8rem'>{post.account.nickname}</Text>
            </Box>
          </Flex>
        </CardHeader>
      </Card>
      <Card shadow='none'>
        <CardBody>
          {post.content}
        </CardBody>
      </Card>
    </VStack>
  );
};

export default PostPreview;
