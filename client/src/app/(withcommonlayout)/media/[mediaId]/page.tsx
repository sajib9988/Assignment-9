
import MediaDetails from "@/module/detailsPage/MediaDetails";
import { getMediaById } from "@/service/media";
import { hasPaidForMedia } from "@/service/watch";

interface MediaDetailsPageProps {
  params: {
    mediaId: string;
  };
}

const MediaDetailsPage = async ({ params }: MediaDetailsPageProps) => {
  const { mediaId } = params;

  const res = await getMediaById(mediaId);

  // console.log('res', res)


  


  const hasPurchased = await hasPaidForMedia(mediaId);

// console.log("hahh",hasPurchased)
  return (
    <div className="mt-5">
      <MediaDetails media={res.data} hasPurchased={hasPurchased} />
    </div>
  );
};
export default MediaDetailsPage;
