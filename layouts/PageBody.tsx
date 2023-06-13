// react
import React, { ReactNode, } from 'react';
import { Box, } from '@chakra-ui/react';
import { MAX_WIDTH, } from '../constants/style';

type Props = {
  children?: ReactNode,
};

const PageBody = ({
  children,
}: Props) => {

  return (
    <Box
      marginLeft={{ base: 'none', md: 'auto', }}
      marginRight={{ base: 'none', md: 'auto', }}
      paddingLeft={{ base: 'none', md: '1rem', }}
      paddingRight={{ base: 'none', md: '1rem', }}
      maxWidth={MAX_WIDTH}
    >
      {children}
    </Box>
  );
};

export default PageBody;
