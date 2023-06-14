// react
import NextLink from 'next/link';
import { Box, Button, Heading, HStack, Link, Text, } from '@chakra-ui/react';
import { MdCreate, } from 'react-icons/md';
// etc
import { Board, } from '../interfaces';

type Props = {
  board: Board,
  isShowCreateButton?: boolean,
}

const BoarderHeader = ({
  board,
  isShowCreateButton = false,
}: Props) => {

  return (
    <HStack justifyContent='space-between' alignItems='end' marginBottom='1rem'>
      <Box
        marginLeft={{ base: '1rem', md: '0', }}
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
          marginRight={{ base: '1rem', md: '0', }}
        >
          글 쓰기
        </Button>
      </Link>}
    </HStack>
  );
};

export default BoarderHeader;
