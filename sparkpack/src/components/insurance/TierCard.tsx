import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import React from "react";

interface Tier {
  name: string;
  premiumRange: string;
  coverageLimit: string;
  benefits: string[];
  details: string[]; // Might not use all these if benefits are detailed enough
}

interface TierCardProps {
  tier: Tier;
  isPopular?: boolean; // For highlighting the middle tier or a recommended one
}

const TierCard: React.FC<TierCardProps> = ({ tier, isPopular = false }) => {
  const premiumStart = tier.premiumRange.split(' - ')[0];

  return (
    <Card className={`border-2 transition-colors ${isPopular ? "border-[#8cc63f] shadow-lg scale-105" : "hover:border-[#8cc63f]"}`}>
      <CardHeader>
        {isPopular && <span className="absolute top-0 right-0 mt-4 mr-4 px-3 py-1 bg-[#8cc63f] text-white text-xs font-semibold rounded-full">Recommended</span>}
        <CardTitle className="text-[#342d47] text-2xl mb-2">{tier.name}</CardTitle>
        <CardDescription>Coverage up to {tier.coverageLimit}</CardDescription>
        <div className="text-3xl font-bold text-[#8cc63f] mt-4">
          Starting from {premiumStart}<span className="text-sm text-gray-500">/year</span>
        </div>
      </CardHeader>
      <CardContent>
        <h4 className="font-semibold text-lg text-gray-700 mb-3">Key Benefits:</h4>
        <ul className="space-y-3 mb-6">
          {tier.benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-2 text-gray-600">
              <CheckCircle className="h-4 w-4 text-[#8cc63f] flex-shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <Button className="w-full mt-6 bg-[#8cc63f] hover:bg-[#7eb238]">Choose Plan</Button>
      </CardContent>
    </Card>
  );
};

export default TierCard;