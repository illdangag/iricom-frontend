// react
import React, { ReactNode, } from 'react';
import { Box, useMediaQuery, } from '@chakra-ui/react';
import { MAX_WIDTH, MOBILE_MEDIA_QUERY, } from '../constants/style';

type Props = {
  children?: ReactNode,
};

const PageBody = ({
  children,
}: Props) => {
  const [isMobile,] = useMediaQuery(MOBILE_MEDIA_QUERY, {
    ssr: true,
    fallback: false,
  });

  return (
    <Box
      marginLeft={isMobile ? '0' : 'auto'}
      marginRight={isMobile ? '0' : 'auto'}
      paddingLeft={isMobile ? '0' : '1rem'}
      paddingRight={isMobile ? '0' : '1rem'}
      maxWidth={MAX_WIDTH}
    >
      {children}
    </Box>
  );
};

export default PageBody;
