import SwapPage from './SwapPage';
import useSwapDesktop from '@/hooks/useSwapDesktop';

const SwapPageDesktop = () => {
  const swapFunc = useSwapDesktop();
  return <SwapPage swapFunc={swapFunc} />;
};

export default SwapPageDesktop;
