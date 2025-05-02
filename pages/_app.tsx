// react
import './global.scss';
import { ChakraProvider, extendTheme, } from '@chakra-ui/react';
import { GetServerSidePropsContext, } from 'next/types';
// store
import { RecoilRoot, } from 'recoil';

// theme
import { cardTheme, } from '@root/themes';
import { Account, PersonalMessageList, PersonalMessageStatus, TokenInfo, } from '@root/interfaces';
import { getTokenInfoByCookies, } from '@root/utils';
import iricomAPI from '@root/utils/iricomAPI';

const theme = extendTheme({
  fonts: {
    heading: '\'Noto Sans KR\', Roboto, sans-serif',
    body: '\'Noto Sans KR\', Roboto, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.100',
      },
    },
  },
  breakpoints: {
    sm: '30rem', // 480px
    md: '48rem', // 768px
    lg: '62rem', // 992px
    xl: '80rem', // 1280px
    '2xl': '96rem', // 1536px
  },
  components: {
    Card: cardTheme,
    Button: {
      variants: {
        solid: {
          backgroundColor: '#9775fa',
          color: '#f8f9fa',
          _hover: {
            background: '#845ef7',
            color: '#f8f9fa',
            _disabled: {
              background: '#b197fc',
              color: '#f8f9fa',
            },
          },
          _active: {
            background: '#7950f2',
            color: '#f8f9fa',
          },
          _disabled: {
            background: '#b197fc',
            color: '#f8f9fa',
          },
        },
        outline: {
          borderColor: '#b197fc',
          color: '#9775fa',
        },
      },
    },
  },
});

const App = ({ Component, pageProps, }) => {
  return (
    <ChakraProvider theme={theme}>
      <RecoilRoot>
        <Component {...pageProps}/>
      </RecoilRoot>
    </ChakraProvider>
  );
};

App.getInitialProps = async (nextPageContext) => {
  const context: GetServerSidePropsContext = nextPageContext.ctx as GetServerSidePropsContext;
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  const responseList: PromiseSettledResult<any>[] = await Promise.allSettled([
    iricomAPI.getMyAccount(tokenInfo),
    iricomAPI.getReceivePersonalMessageList(tokenInfo, PersonalMessageStatus.UNREAD, 0, 1),
  ]);

  const accountResponse = responseList[0] as PromiseFulfilledResult<Account>;
  const unreadPersonalMessageListResponse = responseList[1] as PromiseFulfilledResult<PersonalMessageList>;

  const account: Account = accountResponse.status === 'fulfilled' && accountResponse.value || null;
  const unreadPersonalMessageList: PersonalMessageList = unreadPersonalMessageListResponse.status === 'fulfilled' && unreadPersonalMessageListResponse.value || new PersonalMessageList();

  nextPageContext.ctx.req.data = {
    tokenInfo,
    account,
  };

  return {
    pageProps: {
      account,
      unreadPersonalMessageList: JSON.parse(JSON.stringify(unreadPersonalMessageList)),
    },
  };
};

export default App;
