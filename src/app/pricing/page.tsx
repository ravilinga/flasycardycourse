import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Pricing</h1>
          <p className="text-muted-foreground text-lg">
            Choose the plan that works best for you.
          </p>
        </div>
        <PricingTable />
      </div>
    </div>
  );
}
