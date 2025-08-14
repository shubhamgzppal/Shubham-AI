"use client";
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const paypalConfig = {
    clientId: process.env.PAYPAL_CLIENT_ID!,
    currency: 'USD',
    intent: 'capture',
};

export { paypalConfig };
