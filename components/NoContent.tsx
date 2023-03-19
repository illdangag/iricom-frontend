// react
import { HStack, Image, Spacer, Text, VStack, } from '@chakra-ui/react';

type Props = {
  message?: string;
}

const NoContent = ({
  message = '',
}: Props) => {
  return (
    <VStack alignItems='center'>
      <HStack>
        <Spacer/>
        <Image src='/static/images/empty.png' width='6rem' alt='empty image'/>
        <Spacer/>
      </HStack>
      <Text marginTop='1rem' fontSize='lg'>{message}</Text>
    </VStack>
  );
};

export default NoContent;
