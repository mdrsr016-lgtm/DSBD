
import { TopBar } from './components/common/TopBar';
import { HeroBanner } from './components/common/HeroBanner';

function App() {
  return (
    <div>
      <TopBar />
      <HeroBanner />
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Welcome to Classified</h2>
        <p>Environment successfully built and running.</p>
      </div>
    </div>
  );
}

export default App;
