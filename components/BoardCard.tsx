// react
import NextLink from 'next/link';
import { LinkBox, Card, CardBody, Heading, VStack, Text, Tag, LinkOverlay, } from '@chakra-ui/react';
import { Board, } from '../interfaces';

type Props = {
  board: Board,
};

const BoardCard = ({
  board,
}: Props) => {
  return (
    <LinkBox width='100%'>
      <Card>
        <CardBody>
          <VStack alignItems='flex-start'>
            <Heading size='sm'>
              <LinkOverlay as={NextLink} href='#'>
                {board.title}
              </LinkOverlay>
            </Heading>
            <Text>{board.description}</Text>
            <Tag colorScheme={board.enabled ? 'blue' : 'gray'}>
              {board.enabled ? '활성화' : '비활성화'}
            </Tag>
          </VStack>
        </CardBody>
      </Card>
    </LinkBox>
  );
};

export default BoardCard;
