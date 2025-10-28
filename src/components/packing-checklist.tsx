'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Package } from 'lucide-react';

type PackingChecklistProps = {
  packingList: string[];
};

export default function PackingChecklist({ packingList }: PackingChecklistProps) {
  if (!packingList || packingList.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>No packing list was generated for this trip.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Package />
          What to Pack
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          {packingList.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Checkbox id={`item-${index}`} />
              <label
                htmlFor={`item-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
