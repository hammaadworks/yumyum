import { Brand } from '@/lib/types';

export function BrandHeader({ brand }: { brand: Brand }) {
  return (
    <header>
      <h1>{brand.name}</h1>
      <p>{brand.description}</p>
    </header>
  );
}
