// src/components/insurance/AddOnsSection.tsx
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AddOn {
  name: string;
  description: string;
  price: string;
}

interface AddOnsSectionProps {
  addOns: AddOn[];
}

const AddOnsSection: React.FC<AddOnsSectionProps> = ({ addOns }) => {
  if (!addOns || addOns.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-[#342d47] mb-6 flex items-center gap-2">
        <PlusCircle className="h-6 w-6 text-[#8cc63f]" /> Optional Add-Ons
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        {addOns.map((addOn, index) => (
          <Card key={index} className="border hover:border-[#8cc63f] transition-colors">
            <CardHeader>
              <CardTitle className="text-xl text-[#342d47]">{addOn.name}</CardTitle>
              <CardDescription>{addOn.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-[#8cc63f]">{addOn.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AddOnsSection;