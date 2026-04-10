import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Innovation from '@/components/Innovation';
import Advantages from '@/components/Advantages';
import ComparisonTable from '@/components/ComparisonTable';
import Collection from '@/components/Collection';
import SplashScreen from '@/components/SplashScreen';
import FreeShippingBanner from '@/components/FreeShippingBanner';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden selection:bg-neon-pink/30">
      <SplashScreen />
      <FreeShippingBanner />
      <Header />
      <Hero />
      <Innovation />
      <Advantages />
      <ComparisonTable />
      <Collection />
    </main>
  );
}
