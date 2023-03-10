// react
import { Button, ButtonGroup, Card, CardBody, HStack, IconButton, Spacer, Text, VStack, } from '@chakra-ui/react';
import { MdThumbDownOffAlt, MdThumbUpOffAlt, } from 'react-icons/md';
// store
import { useRecoilValue, } from 'recoil';
import { myAccountAtom, } from '../recoil';
// etc
import { Comment, Account, } from '../interfaces';

type Props = {
  commentList: Comment[],
}
const CommentView = ({
  commentList,
}: Props) => {

  const account: Account | null = useRecoilValue<Account | null>(myAccountAtom);

  return (
    <>{commentList.map((comment, index) => <Card key={index} shadow='none'>
      <CardBody>
        <VStack alignItems='stretch'>
          <HStack>
            <VStack spacing='0' alignItems='flex-start'>
              <Text fontSize='.8rem'>{comment.account.nickname}</Text>
              <Text fontSize='.6rem'>{comment.createDate}</Text>
            </VStack>
            <Spacer/>
            {account && account.id === comment.account.id && <ButtonGroup>
              <Button size='xs'>수정</Button>
              <Button size='xs'>삭제</Button>
            </ButtonGroup>}
          </HStack>
          <HStack justifyContent='space-between'>
            <Text fontSize='.8rem'>{comment.content}</Text>
            <ButtonGroup size='xs'>
              <IconButton aria-label='upvote' icon={<MdThumbUpOffAlt/>}/>
              <IconButton aria-label='upvote' icon={<MdThumbDownOffAlt/>}/>
            </ButtonGroup>
          </HStack>
        </VStack>
      </CardBody>
    </Card>)}</>
  );
};

export default CommentView;
