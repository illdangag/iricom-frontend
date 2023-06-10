// react
import { Box, Button, Heading, HStack, Link, Text, useMediaQuery, } from '@chakra-ui/react';
import NextLink from 'next/link';
import { MdCreate, } from 'react-icons/md';
// etc
import { Board, } from '../interfaces';
import { MOBILE_MEDIA_QUERY, } from '../constants/style';

type Props = {
  board: Board,
  isShowCreateButton?: boolean,
}

const BoarderHeader = ({
  board,
  isShowCreateButton = false,
}: Props) => {
  const [isMobile,] = useMediaQuery(MOBILE_MEDIA_QUERY, {
    ssr: true,
    fallback: false,
  });

  return (
    <HStack justifyContent='space-between' alignItems='end' marginBottom='1rem'>
      <Box
        marginLeft={isMobile ? '1rem' : '0'}
      >
        <Link as={NextLink} href={`/boards/${board.id}`} _hover={{ textDecoration: 'none', }}>
          <Heading size='md' fontWeight='semibold'>{board.title}</Heading>
        </Link>
        <Text fontSize='xs'>{board.description}</Text>
      </Box>
      {isShowCreateButton && <Link as={NextLink} href={`/boards/${board.id}/posts/create`}>
        <Button
          size='xs'
          variant='outline'
          backgroundColor='white'
          leftIcon={<MdCreate/>}
          marginRight={isMobile ? '1rem' : '0'}
        >
          글 쓰기
        </Button>
      </Link>}
    </HStack>
  );
};

export default BoarderHeader;
