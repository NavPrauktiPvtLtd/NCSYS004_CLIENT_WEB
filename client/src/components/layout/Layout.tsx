import * as React from 'react';
import { useEffect } from 'react';

function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // define a custom handler function
    // for the contextmenu event
    const handleContextMenu = (e: MouseEvent) => {
      // prevent the right-click menu from appearing
      e.preventDefault();
    };
    // attach the event listener to
    // the document object
    document.addEventListener('contextmenu', handleContextMenu);
    // clean up the event listener when
    // the component unmounts
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    const handleTouchMove = (event: TouchEvent) => {
      const xDiff = Math.abs(event.touches[0].clientX - event.touches[1].clientX);
      const yDiff = Math.abs(event.touches[0].clientY - event.touches[1].clientY);

      if (xDiff > yDiff) {
        event.preventDefault();
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return <div style={{ position: 'relative', touchAction: 'none' }}>{children}</div>;
}

export default Layout;
