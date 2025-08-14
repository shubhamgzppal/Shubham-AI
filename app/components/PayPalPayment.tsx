"use client";
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { paypalConfig } from '../lib/paypal';
import { useState } from 'react';

export default function PayPalPayment() {
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (_data: Record<string, unknown>) => {
    // Here you can create your order based on your application's needs
    const order = {
      purchase_units: [
        {
          amount: {
            value: "10.00", // Replace with your actual amount
          },
        },
      ],
    };
    
    // PayPal expects an order ID string
    return "TEST-ORDER-ID";
  };

  const onApprove = async (data: { orderID: string }) => {
    try {
      const response = await fetch('/api/subscription/paypal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Something went wrong');
      }

      // Handle successful payment here (e.g., update UI, redirect, etc.)
      console.log('Payment successful!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <PayPalScriptProvider options={paypalConfig}>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </PayPalScriptProvider>
  );
}
