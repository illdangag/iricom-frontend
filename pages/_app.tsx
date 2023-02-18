import './global.scss';
import { ChakraProvider, extendTheme, } from '@chakra-ui/react';
import { RecoilRoot, } from 'recoil';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.100',
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

export default App;
