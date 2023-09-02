// react
import { ReactNode, } from 'react';
import { Box, } from '@chakra-ui/react';
import Header from './Header';
import EmptyLayout from './EmptyLayout';

type Props = {
  children?: ReactNode,
  title?: string,
  headerTitle?: string,
  onMount?: () => void,
}

const MainLayout = ({
  children,
  title,
  headerTitle,
  onMount,
}: Props) => {
  return (
    <EmptyLayout title={title} onMount={onMount}>
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
