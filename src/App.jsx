import { useRef } from 'react';
import CinematicBackground from './components/ui/CinematicBackground';
import ScrollOverlay from './components/ui/ScrollOverlay';

function App() {
  const scrollOverlayRef = useRef(null);

  return (
    <div className="site-shell">
      <CinematicBackground scrollTarget={scrollOverlayRef} />
      <ScrollOverlay ref={scrollOverlayRef} />
    </div>
  );
}

export default App;
