import { ReactNode, } from 'react';

enum LoginState {
  LOGIN,
  LOGOUT,
  ANY,
}

type Props = {
  children?: ReactNode,
  loginState?: LoginState,
};

const EmptyLayout = ({
  children,
  loginState = LoginState.ANY,
}: Props) => {
  return (
    <div>{children}</div>
  );
};

export { LoginState, };
export type { Props, };
export default EmptyLayout;
