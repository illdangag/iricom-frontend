import { ReactNode, } from 'react';
import Header from './Header';
import EmptyLayout, { LoginState, } from './EmptyLayout';
import { AccountAuth, } from '../interfaces';

type Props = {
  children?: ReactNode,
  title?: string,
  headerTitle?: string,
  loginState?: LoginState,
  auth?: AccountAuth,
}

const MainLayout = ({
  children,
  title,
  headerTitle,
  loginState,
  auth,
}: Props) => {
  return (
    <EmptyLayout title={title} loginState={loginState} auth={auth}>
      <Header title={headerTitle}/>
      {children}
    </EmptyLayout>
  );
};

export { LoginState, };
export default MainLayout;
