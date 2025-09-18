import React, { useState } from 'react';
import { CreditCard, Briefcase, TrendingUp, Rocket, Crown } from 'lucide-react';
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentError } from './components/PaymentError';
import { useRazorpay } from './hooks/useRazorpay';
import { RazorpayResponse, PaymentFormData } from './types/razorpay';

type PaymentState = 'form' | 'success' | 'error';

function App() {
  const [paymentState, setPaymentState] = useState<PaymentState>('form');
  const [paymentData, setPaymentData] = useState<RazorpayResponse | null>(null);
  const { initiatePayment, isLoading, error } = useRazorpay();
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  const plans = [
    { id: 'starter', title: 'Starter', cap: 'Up to ₹13 Lakh', amount: 3500, description: 'Starter monthly plan', icon: <Briefcase className="w-10 h-10" />, color: 'bg-teal-500' },
    { id: 'growth', title: 'Growth', cap: 'Up to ₹25 Lakh', amount: 5000, description: 'Growth monthly plan', icon: <TrendingUp className="w-10 h-10" />, color: 'bg-green-500' },
    { id: 'pro', title: 'Pro', cap: 'Up to ₹50 Lakh', amount: 8000, description: 'Pro monthly plan', icon: <Rocket className="w-10 h-10" />, color: 'bg-orange-500' },
    { id: 'elite', title: 'Elite', cap: 'Up to ₹1 Crore', amount: 10000, description: 'Elite monthly plan', icon: <Crown className="w-10 h-10" />, color: 'bg-yellow-500' },
  ];

  const handlePlanPay = async (plan: { id: string; amount: number; description: string }) => {
    setActivePlanId(plan.id);
    const formData: PaymentFormData = {
      amount: plan.amount,
      name: '',
      email: '',
      contact: '',
      description: plan.description,
    };

    const planCode = plan.id || 'custom';
    const keyId = 'rzp_test_RDoRzN5gpmXr2V';

    try {
      await initiatePayment(
        formData,
        planCode,
        keyId,
        (response: RazorpayResponse) => {
          setPaymentData(response);
          setPaymentState('success');
        },
        (errorMessage: string) => {
          console.error('Payment failed:', errorMessage);
          setPaymentState('error');
        }
      );
    } finally {
      setActivePlanId(null);
    }
  };

  const handleNewPayment = () => {
    setPaymentState('form');
    setPaymentData(null);
  };

  const handleRetry = () => {
    setPaymentState('form');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Pricing</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful tools designed to make strategic investing accessible to every investor.
          </p>
        </div>

        {/* Pricing */}
        {paymentState === 'form' && (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex flex-col justify-between bg-white rounded-lg p-0 shadow-none border border-gray-200 overflow-hidden"
                >
                  {/* Icon & Title Section */}
                  <div className={`flex flex-col items-center justify-center p-6 rounded-t-lg text-white ${plan.color}`}>
                    {plan.icon}
                    <h4 className="text-xl font-semibold mt-2">{plan.title}</h4>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    {/* Cap */}
                    <p className="text-base text-gray-600 text-center mb-2">{plan.cap}</p>

                    {/* Price */}
                    <div className="text-4xl font-bold text-gray-900 text-center mb-1">₹{plan.amount.toLocaleString()}</div>
                    <p className="text-sm text-gray-500 text-center mb-6">+Taxex/Month</p>

                    {/* Features */}
                    <ul className="text-sm text-gray-700 space-y-2 mb-6 flex-grow">
                      {plan.id === 'starter' && (
                        <>
                          <li><span className="text-green-500">✔</span> Access to pre-defined strategies</li>
                          <li><span className="text-green-500">✔</span> Live performance dashboard</li>
                          <li><span className="text-green-500">✔</span> Quarterly performance reports</li>
                        </>
                      )}
                      {plan.id === 'growth' && (
                        <>
                          <li><span className="text-green-500">✔</span> All Starter features</li>
                          <li><span className="text-green-500">✔</span> Portfolio rebalancing twice a year</li>
                          <li><span className="text-green-500">✔</span> Enhanced market insights</li>
                        </>
                      )}
                      {plan.id === 'pro' && (
                        <>
                          <li><span className="text-green-500">✔</span> All Growth features</li>
                          <li><span className="text-green-500">✔</span> Strategy updates</li>
                          <li><span className="text-green-500">✔</span> Advanced risk management tools</li>
                        </>
                      )}
                      {plan.id === 'elite' && (
                        <>
                          <li><span className="text-green-500">✔</span> All Pro features</li>
                          <li><span className="text-green-500">✔</span> Dedicated strategy manager</li>
                          <li><span className="text-green-500">✔</span> Priority support</li>
                        </>
                      )}
                    </ul>

                    {/* Button */}
                    <button
                      disabled={isLoading && activePlanId === plan.id}
                      onClick={() => handlePlanPay(plan as any)}
                      className={`mt-auto w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold text-white transition ${
                        isLoading && activePlanId === plan.id ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      <span>{isLoading && activePlanId === plan.id ? 'Processing...' : `Choose ${plan.title}`}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {paymentState === 'success' && paymentData && (
          <div className="max-w-md mx-auto">
            <PaymentSuccess paymentData={paymentData} onNewPayment={handleNewPayment} />
          </div>
        )}

        {paymentState === 'error' && (
          <div className="max-w-md mx-auto">
            <PaymentError error={error || 'Unknown error occurred'} onRetry={handleRetry} />
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Powered by <span className="font-semibold text-indigo-600">Razorpay</span> • Trusted by millions of businesses worldwide
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;


