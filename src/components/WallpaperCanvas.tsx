'use client';

export function WallpaperCanvas() {
  return (
    <div
      className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/image.png')" }}
    />
  );
}
