import { Button } from '@/components/ui/button';

export const VisualDemoSection = () => {
  return (
    <section className="py-20 bg-[#FEF3E2]">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#0B0B0B]">See It In Action</h2>
        <p className="text-muted-foreground mt-2">
          Experience the seamless ordering process.
        </p>
        <div className="mt-12 p-4 border rounded-lg bg-white">
          {/* Placeholder for interactive demo */}
          <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
        </div>
        <Button variant="link" className="mt-4 text-[#FAB12F]">
          View Sample Menu
        </Button>
      </div>
    </section>
  );
};
