"use client";

import { useUser } from "@/context/userContext";
import Payment from "@/module/payment/Payment";
import { getMediaById } from "@/service/media"; // replace getAllMedia
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
;
import { getPaymentStatus } from "@/service/payement";

const CartPage = () => {
  const { user } = useUser();
  const [content, setContent] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const params = useParams();
  const mediaId = params?.mediaId as string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMediaById(mediaId);
        setContent(response?.data);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    if (mediaId) {
      fetchData();
    }
  }, [mediaId]);

useEffect(()=>{
  const fetchPaymentStatus = async () => {
    try {
      const response = await getPaymentStatus(mediaId);
      setStatus(response);
      console.log("Payment status:", response);
    } catch (error) {
      console.error("Error fetching payment status:", error);
    }
  };

  if (mediaId) {
    fetchPaymentStatus();
  }
},[mediaId])



  if (!user || !content) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-1/2 mx-auto mt-10">
      <Payment content={content} user={user} status={status} />
    </div>
  );
};

export default CartPage;
