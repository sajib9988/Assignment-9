// app/watch/access/[mediaId]/page.tsx
import { getMediaById } from "@/service/media";
import React from "react";


interface MediaData {
  id: string;
  title: string;
  videoUrl: string;
  description: string;
}

const WatchPage = async ({ params }: { params: { mediaId: string } }) => {
  const media: MediaData = await getMediaById(params.mediaId);

  if (!media || !media.videoUrl) {
    return <div className="p-6 text-red-500">Media not found or failed to load.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{media.title}</h1>
      <video
        src={media.videoUrl}
        controls
        className="w-full rounded-lg shadow-lg"
      />
      <p className="mt-4 text-gray-600">{media.description}</p>
    </div>
  );
};

export default WatchPage;
