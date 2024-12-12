/* eslint-disable react-hooks/exhaustive-deps */
import { useSubmitTaps } from '@/api/gameplay';
import { VITE_SEND_DELAY } from '@/env/env';
import useBoundStore from '@/store/store';
import { TUpgradeOverall } from '@/type/TUpgrade';
import errorHandler from '@/utils/error';
import { useEffect, useState } from 'react';

const useTaps = (
  startInterval: () => void,
  stopInterval: () => void,
  upgrade?: TUpgradeOverall,
) => {
  const [clickCount, setClickCount] = useState<number>(0);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );
  const [sendTimer, setSendTimer] = useState<number>(); // Timer for sending data

  const resetErrorToast = useBoundStore.use.resetErrorToast();
  const setErrorToast = useBoundStore.use.setErrorToast();
  const addBalance = useBoundStore.use.addBalance();
  const decrementEnergy = useBoundStore.use.decrementEnergy();
  const energy = useBoundStore.use.user().game_states.energy;

  const tapsMutate = useSubmitTaps({
    successSideEffect: () => {
      resetErrorToast();
      setClickCount(0);
      startInterval();
    },
    onError: err => {
      errorHandler({
        error: err,
        axiosErrorHandlerFn: errMsg => {
          setErrorToast({ isOpen: true, message: errMsg || '' });
        },
        generalErrorHandlerFn: err => {
          setErrorToast({ isOpen: true, message: err.message || '' });
        },
      });
    },
  });

  // Function to reset the timer
  const resetSendTimer = (clickCount: number) => {
    // Clear the existing timer if it exists
    if (sendTimer) {
      clearTimeout(sendTimer);
    }

    stopInterval();

    // Start a new timer
    const timer = setTimeout(() => {
      //   sendDataToServer(); // Send the accumulated clicks to the server
      const now = new Date();
      tapsMutate.mutate({
        taps: clickCount,
        time: now.toISOString(),
      });
    }, VITE_SEND_DELAY);

    setSendTimer(timer); // Update the timer state
  };

  useEffect(() => {
    if (clickCount <= 0) {
      return;
    }

    resetSendTimer(clickCount);
  }, [clickCount]);

  const handleClick = (e: React.MouseEvent) => {
    const newClick = {
      id: Date.now(),
      x: e.pageX,
      y: e.pageY,
    };

    if (!upgrade) {
      return;
    }

    if (energy <= 0) {
      return;
    }

    if (energy - upgrade?.upgrade.level < 0) {
      return;
    }

    setClicks(prev => [...prev, newClick]);
    setClickCount(state => state + 1);
    addBalance(upgrade?.upgrade.level || 1);
    decrementEnergy(upgrade?.upgrade.level || 1);
  };

  const handleAnimationEnd = (id: number) => () => {
    setClicks(prev => prev.filter(click => click.id !== id));
  };

  return {
    clicks,
    handleClick,
    handleAnimationEnd,
  };
};

export default useTaps;
