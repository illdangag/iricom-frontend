import { Card, CardBody, CardHeader, Heading, Image, Flex, Spacer, Stack, Input, Button, Container, } from '@chakra-ui/react';
import { MdLogin, } from 'react-icons/md';

const LoginPage = () => {
  return (
    <Flex flexDirection='column' height='100%'>
      <Spacer/>
      <Container>
        <Card maxWidth='32rem'>
          <CardHeader>
            <Flex alignItems='flex-end'>
              <Image src='/static/images/login_logo.png' width='4rem' alt='login logo'/>
              <Spacer/>
              <Heading size='md' color='gray.600'>관리자 로그인</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <Stack spacing={6}>
              <Stack spacing={2}>
                <Input placeholder='아이디' size='md'/>
                <Input type='password' placeholder='비밀번호' size='md'/>
              </Stack>
              <Button isDisabled={true} leftIcon={<MdLogin/>}>로그인</Button>
            </Stack>
          </CardBody>
        </Card>
      </Container>
      <Spacer/>
    </Flex>
  );
};

export default LoginPage;
