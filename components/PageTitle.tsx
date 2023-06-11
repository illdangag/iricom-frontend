import { Box, Heading, HStack, Text, useMediaQuery, } from '@chakra-ui/react';
import { MOBILE_MEDIA_QUERY, } from '../constants/style';

type Props = {
  title: string,
  descriptions?: string[],
};

const PageTitle = ({
  title,
  descriptions = [],
}: Props) => {
  const [isMobile,] = useMediaQuery(MOBILE_MEDIA_QUERY, { ssr: true, fallback: false, });

  return (<HStack justifyContent='space-between' alignItems='end' marginBottom='1rem'>
    <Box marginLeft={isMobile ? '1rem' : '0'}>
      <Heading size='md' fontWeight='semibold'>{title}</Heading>
      {descriptions.map(description => <Text fontSize='xs'>{description}</Text>)}
    </Box>
  </HStack>);
};

export default PageTitle;
