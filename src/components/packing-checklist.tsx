'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Package, Download } from 'lucide-react';

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

  const handleDownload = () => {
    const listContent = packingList.join('\n');
    const blob = new Blob([listContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'packing-list.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Package />
          What to Pack
        </CardTitle>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download List
        </Button>
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
