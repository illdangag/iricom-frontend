// react
import { Heading, VStack, Text, Tag, } from '@chakra-ui/react';
import { Board, } from '../interfaces';

type Props = {
  board: Board,
};

const BoardView = ({
  board,
}: Props) => {
  return (
    <VStack alignItems='flex-start'>
      <Heading size='sm'>{board.title}</Heading>
      <Text>{board.description}</Text>
      <Tag colorScheme={board.enabled ? 'blue' : 'gray'}>
        {board.enabled ? '활성화' : '비활성화'}
      </Tag>
    </VStack>
  );
};

export default BoardView;
