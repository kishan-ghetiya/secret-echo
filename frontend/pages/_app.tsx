import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../utils/AuthContext';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  );
};

export default App;
