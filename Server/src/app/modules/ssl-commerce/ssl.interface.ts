export type IPaymentData = {
    amount: number;
    transactionId: string;
    name: string;
    email: string;

    userId: string;
    contentId: string;
    type: 'MOVIE' | 'SERIES'; 
  };