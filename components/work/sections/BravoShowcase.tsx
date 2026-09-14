import { ZoomableImage } from '@/components/work/ZoomableImage';
export function BravoShowcase() {
  return (
    <div className="rounded-2xl overflow-hidden">
      <ZoomableImage
        src="/work/bravo/bravo-cashback-showcase.png"
        alt="Examples of the cashback offer card across many campaign configurations"
        className="block w-full h-auto"
      />
    </div>
  );
}
