import { getMediaById } from "@/service/media";




const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ mediaId: string }>;
}) => {
  const { mediaId } = await params;

  const { data: media } = await getMediaById(mediaId);

  return (

     
   <div>
 <ProductDetails media={media} />
   </div>
 
     

  );
};

export default ProductDetailsPage;
