// react
import { ReactNode, } from 'react';
import { Box, } from '@chakra-ui/react';
import Header from './Header';
import EmptyLayout, { LoginState, } from './EmptyLayout';
// etc
import { AccountAuth, } from '../interfaces';

type Props = {
  children?: ReactNode,
  title?: string,
  headerTitle?: string,
  loginState?: LoginState,
  auth?: AccountAuth,
  onMount?: () => void,
}

const MainLayout = ({
  children,
  title,
  headerTitle,
  loginState,
  auth,
  onMount,
}: Props) => {
  return (
    <EmptyLayout title={title} loginState={loginState} auth={auth} onMount={onMount}>
      <Box padding='.6rem'>
        <Header title={headerTitle}/>
        <Box marginTop='.6rem'>
          {children}
        </Box>
      </Box>
    </EmptyLayout>
  );
};

export { LoginState, };
export default MainLayout;
