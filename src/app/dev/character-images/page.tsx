"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Check, X } from "lucide-react";
import { ALL_27_TYPES, getAllTypeImagePaths } from "@/lib/character-image-mapping";
import { checkImageExists } from "@/lib/character-image-mapping";
import types54Data from "../../../../data/diagnoses/compatibility-54/types.json";
import type { PersonalityType } from "@/lib/types";

interface ImageStatus {
  exists: boolean;
  loading: boolean;
}

export default function CharacterImagesPage() {
  const [imageStatuses, setImageStatuses] = useState<Record<string, ImageStatus>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // 全タイプの画像パスを取得
  const typeImagePaths = getAllTypeImagePaths();

  // タイプコードからタイプ名を取得するマップ
  const typeNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    Object.values(types54Data).forEach((type: PersonalityType) => {
      map[type.type] = type.name;
    });
    return map;
  }, []);

  // 画像の存在確認
  useEffect(() => {
    const checkImages = async () => {
      const statuses: Record<string, ImageStatus> = {};
      
      for (const { typeCode, imagePath } of typeImagePaths) {
        statuses[typeCode] = { exists: false, loading: true };
        setImageStatuses((prev) => ({ ...prev, [typeCode]: { exists: false, loading: true } }));
        
        const exists = await checkImageExists(imagePath);
        statuses[typeCode] = { exists, loading: false };
      }
      
      setImageStatuses(statuses);
    };

    checkImages();
  }, []);

  const handleFileSelect = async (typeCode: string, file: File | null) => {
    if (!file) return;

    setUploading((prev) => ({ ...prev, [typeCode]: true }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("typeCode", typeCode);

      const response = await fetch("/api/upload-character-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("アップロードに失敗しました");
      }

      // 画像の存在確認を再実行
      const imagePath = `/character-images/${typeCode}.png`;
      const exists = await checkImageExists(imagePath);
      setImageStatuses((prev) => ({
        ...prev,
        [typeCode]: { exists, loading: false },
      }));

      alert("画像のアップロードが完了しました");
    } catch (error) {
      console.error("Upload error:", error);
      alert("画像のアップロードに失敗しました");
    } finally {
      setUploading((prev) => ({ ...prev, [typeCode]: false }));
    }
  };

  const handleDragOver = (e: React.DragEvent, typeCode: string) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, typeCode: string) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileSelect(typeCode, file);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">キャラクター画像管理</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              27タイプそれぞれに対応するキャラクター画像をアップロードできます。
              ファイル名は自動的に「タイプコード.png」として保存されます。
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {typeImagePaths.map(({ typeCode, imagePath }) => {
                const status = imageStatuses[typeCode];
                const isUploading = uploading[typeCode] || false;

                return (
                  <Card key={typeCode} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <h3 className="font-semibold text-sm mb-1">{typeNameMap[typeCode] || typeCode}</h3>
                        <p className="text-xs text-muted-foreground mb-1">{typeCode}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {status?.loading ? (
                            <span>確認中...</span>
                          ) : status?.exists ? (
                            <>
                              <Check className="w-4 h-4 text-green-500" />
                              <span className="text-green-600">画像あり</span>
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4 text-red-500" />
                              <span className="text-red-600">画像なし</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 画像プレビューエリア */}
                      <div
                        className="mt-2 aspect-square bg-muted rounded-lg overflow-hidden mb-3 border-2 border-dashed border-border relative cursor-pointer hover:border-primary transition-colors"
                        onDragOver={(e) => handleDragOver(e, typeCode)}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => handleDrop(e, typeCode)}
                        onClick={() => fileInputRefs.current[typeCode]?.click()}
                      >
                        {status?.exists ? (
                          <img
                            src={imagePath}
                            alt={typeCode}
                            className="w-full h-full object-contain"
                            onError={() => {
                              setImageStatuses((prev) => ({
                                ...prev,
                                [typeCode]: { exists: false, loading: false },
                              }));
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground text-xs p-4">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <div className="text-center">
                              <div>画像をドロップ</div>
                              <div className="text-[10px] mt-1">またはクリック</div>
                            </div>
                          </div>
                        )}
                      </div>

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        ref={(el) => {
                          fileInputRefs.current[typeCode] = el;
                        }}
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleFileSelect(typeCode, file);
                        }}
                        className="hidden"
                        id={`file-input-${typeCode}`}
                      />

                      <Button
                        onClick={() => fileInputRefs.current[typeCode]?.click()}
                        disabled={isUploading}
                        className="w-full"
                        size="sm"
                        variant={status?.exists ? "outline" : "default"}
                      >
                        {isUploading
                          ? "アップロード中..."
                          : status?.exists
                          ? "画像を変更"
                          : "画像をアップロード"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
