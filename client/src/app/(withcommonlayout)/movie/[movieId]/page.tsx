import MediaDetails from "@/module/detailsPage/MediaDetailsPage";
import { getMediaById } from "@/service/media";
import { hasPaidForMedia } from "@/service/watch";




const MediaDetailsPage = async ({
  params,
}: {
  params: Promise<{ mediaId: string }>;
}) => {
  const { mediaId } = await params;

  const { data: media } = await getMediaById(mediaId);
  const response = await hasPaidForMedia() as any;
  const hasPurchased = response && 'data' in response ? response.data : false;

  return (

     
   <div>
 
 <MediaDetails media={media} hasPurchased={hasPurchased} />
   </div>
 
     

  );
};

export default MediaDetailsPage;
