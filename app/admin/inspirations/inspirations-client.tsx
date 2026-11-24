"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { UploadDropzone } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INDUSTRIES } from "@/app/(authenticated)/brand/new/constants";
import { analyzeAndInsertInspirationTemplate } from "@/app/actions/admin-inspirations";
import { uploadFromUrl } from "@/app/actions/upload-url";
import { InspirationLibrary } from "./components/InspirationLibrary";

type Row = {
  id: string; industryId: string; name: string; imageUrl: string;
  uploadthingKey: string | null; designData: any; createdAt: string;
};

export function InspirationsClient({ initialRows }: { initialRows: Row[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [industryId, setIndustryId] = useState<string>("education");
  const [pinterestUrl, setPinterestUrl] = useState<string>("");
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [uploadedKey, setUploadedKey] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isFetchingUrl, setIsFetchingUrl] = useState<boolean>(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      if ((await fetch(`/api/admin/inspirations/${id}`, { method: "DELETE" })).ok) {
        setRows(prev => prev.filter(r => r.id !== id));
        router.refresh();
      } else throw new Error();
    } catch { alert("Failed to delete"); }
  };

  const handleFetchAndSave = async () => {
    if (!pinterestUrl || !industryId) return;
    setIsFetchingUrl(true);
    try {
      const urls = pinterestUrl.split(",").map(url => url.trim()).filter(Boolean);
      if (urls.length === 0) throw new Error("No valid URLs found");

      const results = await Promise.all(urls.map(async (url, idx) => {
        try {
          const uploadRes = await uploadFromUrl(url);
          const finalName = `${industryLabel} ${new Date().toLocaleTimeString()} #${idx + 1}`;
          const row = await analyzeAndInsertInspirationTemplate({
            industryId, name: finalName, imageUrl: uploadRes.url, uploadthingKey: uploadRes.key,
          });
          return { success: true, row, url };
        } catch (err: any) {
          return { success: false, error: err?.message || String(err), url };
        }
      }));

      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (successful.length > 0) {
        const newRows = successful.map(s => s.row).filter((r): r is Row => r !== undefined);
        setRows((prev) => [...newRows, ...prev]);
        router.refresh();
      }

      setPinterestUrl(""); setUploadedUrl(""); setUploadedKey("");

      if (failed.length > 0) {
        alert(`Successfully uploaded ${successful.length} inspirations.\nFailed: ${failed.map(f => f.url).join(", ")}`);
      } else {
        alert(`Successfully uploaded ${successful.length} inspirations!`);
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const canSave = Boolean(industryId && uploadedUrl && !isSaving);
  const industryLabel = useMemo(() => INDUSTRIES.find((x) => x.id === industryId)?.label ?? industryId, [industryId]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 font-mono">
      <header className="flex items-center justify-between mb-8 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-red-500 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            INSPIRATIONS
          </h1>
          <p className="text-gray-500 text-sm mt-1">Upload → Analyze → Save to Supabase</p>
        </div>
        <a href="/admin" className="text-xs font-bold text-gray-400 hover:text-gray-200 underline underline-offset-4">BACK_TO_DASHBOARD→</a>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800 xl:col-span-1">
          <CardHeader className="pb-3"><CardTitle className="text-gray-100 text-sm">UPLOAD_NEW</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Industry</label>
              <select value={industryId} onChange={(e) => setIndustryId(e.target.value)} className="w-full h-9 rounded-md bg-gray-950 border border-gray-800 text-white text-sm px-3">
                {INDUSTRIES.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Pinterest / Image URL</label>
              <div className="flex gap-2">
                <Input value={pinterestUrl} onChange={(e) => setPinterestUrl(e.target.value)} placeholder="https://i.pinimg.com/... (comma separated)" className="bg-gray-950 border-gray-800 text-white flex-1" onKeyPress={(e) => e.key === "Enter" && pinterestUrl && !isFetchingUrl && handleFetchAndSave()} />
                <Button variant="outline" size="sm" disabled={!pinterestUrl || isFetchingUrl} onClick={handleFetchAndSave} className="border-gray-800 text-xs">
                  {isFetchingUrl ? <Loader2 className="w-3 h-3 animate-spin" /> : "BATCH FETCH & SAVE"}
                </Button>
              </div>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-800" /></div>
              <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-gray-900 px-2 text-gray-500">or upload file</span></div>
            </div>

            <div className="hidden space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Image Upload (UploadThing)</label>
              <UploadDropzone
                endpoint="inspirationImageUploader"
                onClientUploadComplete={(res) => {
                  const file = res?.[0];
                  if (!file) return;
                  setUploadedUrl((file as any).serverData?.url || (file as any).ufsUrl || "");
                  setUploadedKey((file as any).serverData?.key || (file as any).key || "");
                }}
                onUploadError={(err: Error) => alert(err.message)}
                className="ut-button:bg-red-600 ut-button:ut-readying:bg-red-600/70 ut-button:ut-uploading:bg-red-600/70 ut-label:text-gray-200 ut-allowed-content:text-gray-500"
              />
              {uploadedUrl && (
                <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                  <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Preview</div>
                  <img src={uploadedUrl} alt="uploaded" className="w-full max-h-[260px] object-contain rounded-md bg-black" />
                  <div className="mt-2 text-[10px] text-gray-500 break-all">{uploadedUrl}</div>
                </div>
              )}
            </div>

            <div className="hidden">
              <Button
                disabled={!canSave}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                onClick={async () => {
                  setIsSaving(true);
                  try {
                    const finalName = `${industryLabel} ${new Date().toLocaleTimeString()}`;
                    const row = (await analyzeAndInsertInspirationTemplate({
                      industryId, name: finalName, imageUrl: uploadedUrl, uploadthingKey: uploadedKey || null,
                    })) as any;
                    setRows((prev) => [row, ...prev]);
                    setUploadedUrl(""); setUploadedKey("");
                    router.refresh();
                  } finally {
                    setIsSaving(false);
                  }
                }}
              >
                {isSaving ? <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />ANALYZING...</span> : "ANALYZE_&_SAVE"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <InspirationLibrary rows={rows} onDelete={handleDelete} />
      </div>
    </div>
  );
}
