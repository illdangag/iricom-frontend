// react
import { ReactNode, } from 'react';
import { Box, } from '@chakra-ui/react';
import Header from './Header';
import EmptyLayout from './EmptyLayout';

type Props = {
  children?: ReactNode,
  title?: string,
  headerTitle?: string,
}

const MainLayout = ({
  children,
  title,
  headerTitle,
}: Props) => {
  return (
    <EmptyLayout title={title}>
      <Box>
        <Header title={headerTitle}/>
        <Box marginTop='1rem'>
          {children}
        </Box>
      </Box>
    </EmptyLayout>
  );
};

export default MainLayout;
