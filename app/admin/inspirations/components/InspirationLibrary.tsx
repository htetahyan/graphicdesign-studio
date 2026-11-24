import React from "react";
import Image from "next/image";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Row = {
  id: string;
  industryId: string;
  name: string;
  imageUrl: string;
  uploadthingKey: string | null;
  designData: any;
  createdAt: string;
};

interface InspirationLibraryProps {
  rows: Row[];
  onDelete: (id: string) => void;
}

export function InspirationLibrary({ rows, onDelete }: InspirationLibraryProps) {
  return (
    <Card className="bg-gray-900 border-gray-800 xl:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-gray-100 text-sm">LIBRARY ({rows.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="text-center text-gray-500 font-bold py-12">EMPTY</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rows.map((r) => (
              <div key={r.id} className="rounded-xl border border-gray-800 bg-gray-950 overflow-hidden group relative">
                <div className="aspect-[4/3] bg-black flex items-center justify-center relative">
                  {r.imageUrl ? (
                    <Image src={r.imageUrl} alt={r.name} fill className="object-contain" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div className="p-3 space-y-1">
                  <div className="text-xs font-bold text-gray-100 truncate">{r.name}</div>
                  <div className="text-[10px] text-gray-500">{r.industryId}</div>
                  <div className="text-[10px] text-gray-600">{new Date(r.createdAt).toLocaleString()}</div>
                </div>
                <button
                  onClick={() => onDelete(r.id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete inspiration"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
