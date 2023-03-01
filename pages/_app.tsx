// react
import './global.scss';
import { useEffect, } from 'react';
import { ChakraProvider, extendTheme, } from '@chakra-ui/react';
// store
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

// TODO main layout, empty layout을 여기서 처리?
const App = ({ Component, pageProps, }) => {
  useEffect(() => {
    console.log('APP');
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <RecoilRoot>
        <Component {...pageProps}/>
      </RecoilRoot>
    </ChakraProvider>
  );
};

export default App;
