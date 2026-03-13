import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const usePreviousRoute = () => {
  const location = useLocation();
  const previousLocationRef = useRef();

  useEffect(() => {
    previousLocationRef.current = location.pathname;
  }, [location]);

  return previousLocationRef.current;
};
export default usePreviousRoute