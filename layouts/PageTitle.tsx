import { Box, Heading, HStack, Text, } from '@chakra-ui/react';

type Props = {
  title: string,
  descriptions?: string[],
};

const PageTitle = ({
  title,
  descriptions = [],
}: Props) => {
  return (<HStack justifyContent='space-between' alignItems='end' marginBottom='1rem'>
    <Box
      marginLeft={{ base: '1rem', md: '0', }}
    >
      <Heading size='md' fontWeight='semibold'>{title}</Heading>
      {descriptions.map((description, index) => <Text key={index} fontSize='xs'>{description}</Text>)}
    </Box>
  </HStack>);
};

export default PageTitle;
