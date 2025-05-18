"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Loader2 } from "lucide-react";
import { IPaymentData } from "@/type/type";
import { createPayment } from "@/service/payement";

interface PaymentComponentProps {
  content: {
    _id: string;
    title: string;
    price: number;
    type: "MOVIE" | "SERIES";
  };
  user: {
    name: string;
    email: string;
    userId: string;
  };
}

export default function Payment({ content, user }: PaymentComponentProps) {
  const [loading, setLoading] = useState(false);

  const handleCreatePayment = async () => {
    setLoading(true);

    const paymentData: IPaymentData = {
      contentId: content._id,
      amount: content.price,
      email: user.email,
      name: user.name,
      type: content.type,
      userId: user.userId,
      transactionId: "", // Backend will generate
    };

    try {
      const result = await createPayment(paymentData);

      if (result?.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        alert("Payment initiation failed!");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      alert(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Buy {content.type === "MOVIE" ? "Movie" : "Series"}: {content.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">Price: ৳{content.price}</p>
        <Button onClick={handleCreatePayment} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Processing...
            </>
          ) : (
            `Pay Now ৳${content.price}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
