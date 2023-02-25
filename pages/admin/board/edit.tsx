// react
import { useState, } from 'react';
import { Container, Heading, VStack, Card, Image, HStack, Spacer, Text, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../../layouts/MainLayout';
import { useIricomAPI, } from '../../../hooks';
// etc
import { AccountAuth, Board, } from '../../../interfaces';
import BoardCard from '../../../components/BoardCard';

const AdminBoardEditPage = () => {
  const iricomApi = useIricomAPI();
  const [boardList, setBoardList,] = useState<Board[] | null>(null);

  const onMount = () => {
    void iricomApi.getBoardList(0, 20, null)
      .then(boardList => {
        setBoardList(boardList.boards);
      });
  };

  const emptyBoardList =
    <Card shadow='sm' padding='1rem'>
      <HStack>
        <Spacer/>
        <Image src='/static/images/empty.png' width='6rem' alt='empty board list'/>
        <Spacer/>
      </HStack>
      <Text marginTop='1rem' fontSize='lg'>게시판이 존재하지 않습니다.</Text>
    </Card>;

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.SYSTEM_ADMIN} onMount={onMount}>
      <VStack>
        <Container width='100%' maxWidth='none' margin='0' padding='0'>
          <Heading as='h1' size='sm'>게시판 수정</Heading>
        </Container>
        {boardList && boardList.length === 0 && emptyBoardList}
        {boardList && boardList.map((board, index) => <BoardCard board={board} key={index}/>)}
      </VStack>
    </MainLayout>
  );
};

export default AdminBoardEditPage;
