import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { notificationApi } from '../services/api';
import { Bell, Mail, ShoppingBag } from 'lucide-react';

const VivaDemo = () => {
  const [loadingWelcome, setLoadingWelcome] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);

  // Mock Payloads for Beddings.lk
  const welcomePayload = {
    email: "demo@beddings.lk",
    name: "Viva Evaluator"
  };

  const orderPayload = {
    orderId: "VIVA-2026-001",
    userEmail: "demo@beddings.lk",
    totalAmount: 15000,
    items: [
      {
        productName: "Luxury Silk Pillowcase - Midnight Navy",
        quantity: 2,
        price: 7500
      }
    ],
    shippingAddress: {
      street: "123 Evaluation Avenue",
      city: "Colombo",
      country: "LK"
    }
  };

  const handleWelcomeClick = async () => {
    setLoadingWelcome(true);
    try {
      await notificationApi.sendWelcome(welcomePayload);
      toast.success('Welcome Notification Dispatched Successfully!', { icon: '✉️' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to dispatch Welcome notification. Check ALB connection.');
    } finally {
      setLoadingWelcome(false);
    }
  };

  const handleOrderClick = async () => {
    setLoadingOrder(true);
    try {
      await notificationApi.sendOrderPlaced(orderPayload);
      toast.success('Order Confirmation Dispatched Successfully!', { icon: '📦' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to dispatch Order notification. Check ALB connection.');
    } finally {
      setLoadingOrder(false);
    }
  };

  return (
    <div className="container page">
      <div className="page-header text-center mb-3 mt-2">
        <h1 className="flex-center gap-1 mb-2"><Bell className="text-primary" size={40} /> Viva Evaluation Demo</h1>
        <p>Live trigger dashboard for the Beddings.lk Notification Microservice</p>
      </div>

      <div className="features">
        <div className="card feature-card">
          <div className="flex-center mb-2">
            <Mail size={48} className="text-primary" />
          </div>
          <h3 className="feature-title">Welcome Email Trigger</h3>
          <p className="feature-desc mb-2">
            Triggers <code>POST /api/notifications/welcome</code> via AWS ALB.
            Simulates a successful user registration.
          </p>
          <div className="text-left mb-3 p-3 bg-gray-900 rounded-sm" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
            <pre className="text-muted">{JSON.stringify(welcomePayload, null, 2)}</pre>
          </div>
          <button 
            className="btn btn-primary w-full flex-center gap-1"
            onClick={handleWelcomeClick}
            disabled={loadingWelcome}
          >
            {loadingWelcome ? 'Dispatching...' : 'Dispatch Welcome Mail'}
          </button>
        </div>

        <div className="card feature-card">
          <div className="flex-center mb-2">
            <ShoppingBag size={48} className="text-success" />
          </div>
          <h3 className="feature-title">Order Confirmation Trigger</h3>
          <p className="feature-desc mb-2">
            Triggers <code>POST /api/notifications/order-placed</code> via AWS ALB.
            Simulates a Beddings.lk checkout.
          </p>
          <div className="text-left mb-3 p-3 bg-gray-900 rounded-sm" style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
            <pre className="text-muted">{JSON.stringify(orderPayload, null, 2)}</pre>
          </div>
          <button 
            className="btn btn-primary w-full flex-center gap-1"
            onClick={handleOrderClick}
            disabled={loadingOrder}
            style={{ background: 'var(--color-success)', boxShadow: '0 0 20px rgba(67, 217, 173, 0.25)' }}
          >
            {loadingOrder ? 'Dispatching...' : 'Dispatch Order Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VivaDemo;
