import { Heading, VStack, Container, Card, Input, FormControl, FormLabel, FormHelperText, Checkbox, Textarea, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../../layouts/MainLayout';
import { AccountAuth, } from '../../../interfaces';

const AdminBoardCreatePage = () => {
  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.SYSTEM_ADMIN}>
      <VStack paddingLeft='0.8rem' paddingRight='0.8rem'>
        <Container width='100%' padding='0'>
          <Heading as='h1' size='sm'>게시판 생성</Heading>
        </Container>
        <Card width='100%' padding='0.8rem' shadow='none'>
          <VStack spacing='1.8rem'>
            <FormControl isRequired>
              <FormLabel>제목</FormLabel>
              <Input autoFocus/>
            </FormControl>
            <FormControl>
              <FormLabel>설명</FormLabel>
              <Textarea placeholder='설명을 입력해주세요.'/>
            </FormControl>
            <FormControl>
              <Checkbox defaultChecked>활성화</Checkbox>
              <FormHelperText>비활성화 게시판은 사용자에게 나타나지 않으며, 게시물 작성 및 댓글 작성이 불가능합니다.</FormHelperText>
            </FormControl>
          </VStack>
        </Card>
      </VStack>
    </MainLayout>
  );
};

export default AdminBoardCreatePage;
