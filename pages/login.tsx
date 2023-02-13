import { Flex, Spacer, Container, Card, CardHeader, CardBody, Image, Center, Heading, VStack, Button, } from '@chakra-ui/react';
import { FcGoogle, } from 'react-icons/fc';
import { FirebaseProperties, } from '../interfaces';

const LoginPage = () => {
  const firebaseProperties: FirebaseProperties = process.env.firebase as unknown as FirebaseProperties;
  console.log(firebaseProperties);
  return (
    <Flex flexDirection='column' height='100%'>
      <Spacer/>
      <Container>
        <Card maxWidth='32rem'>
          <CardHeader>
            <Flex flexDirection='column' align='center'>
              <Image src='/static/images/login_logo.png' width='8rem' alt='login logo'/>
              <Heading size='xl' color='gray.600'>이리콤</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <Center>
              <Button leftIcon={<FcGoogle/>}>Google 계정으로 계속하기</Button>
            </Center>
          </CardBody>
        </Card>
      </Container>
      <Spacer/>
    </Flex>
  );
};

export default LoginPage;
