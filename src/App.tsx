import React, { useState } from 'react';
import { CreditCard, Briefcase, TrendingUp, Rocket, Crown, Check, Star, Shield, Zap } from 'lucide-react';
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
    { 
      id: 'starter', 
      title: 'Starter', 
      cap: 'Up to ₹13 Lakh', 
      amount: 3500, 
      description: 'Starter monthly plan', 
      icon: <Briefcase className="w-12 h-12" />, 
      color: 'from-teal-400 to-teal-600',
      borderColor: 'border-teal-200',
      popular: false,
      savings: null
    },
    { 
      id: 'growth', 
      title: 'Growth', 
      cap: 'Up to ₹25 Lakh', 
      amount: 5000, 
      description: 'Growth monthly plan', 
      icon: <TrendingUp className="w-12 h-12" />, 
      color: 'from-green-400 to-green-600',
      borderColor: 'border-green-200',
      popular: false,
      // savings: '30% OFF'
    },
    { 
      id: 'pro', 
      title: 'Pro', 
      cap: 'Up to ₹50 Lakh', 
      amount: 8000, 
      description: 'Pro monthly plan', 
      icon: <Rocket className="w-12 h-12" />, 
      color: 'from-orange-400 to-orange-600',
      borderColor: 'border-orange-200',
      popular: false,
      // savings: '25% OFF'
    },
    { 
      id: 'elite', 
      title: 'Elite', 
      cap: 'Up to ₹1 Crore', 
      amount: 10000, 
      description: 'Elite monthly plan', 
      icon: <Crown className="w-12 h-12" />, 
      color: 'from-yellow-400 to-yellow-600',
      borderColor: 'border-yellow-200',
      popular: false,
      // savings: '20% OFF'
    },
  ];

  const handlePlanPay = async (plan: { id: string; amount: number; description: string }) => {
    setActivePlanId(plan.id);
    const formData: PaymentFormData = {
      amount: plan.amount,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
      <div className="container mx-auto px-4 py-16 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
            Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Powerful tools designed to make strategic investing accessible to every investor.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 mt-8">
            <div className="flex items-center space-x-2 text-gray-500">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Bank-grade Security</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">Real-time Analytics</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">4.9/5 Rating</span>
            </div>
          </div>
        </div>

        {/* Pricing */}
        {paymentState === 'form' && (
          <div className="max-w-8xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between bg-white rounded-2xl shadow-xl border-2 ${plan.borderColor} overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                    plan.popular ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        <Star className="w-4 h-4 inline mr-1" />
                        MOST POPULAR
                      </div>

                    </div>
                  )}

                  {/* Savings Badge */}
                  {plan.savings && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {plan.savings}
                      </div>
                    </div>
                  )}

                  {/* Icon & Title Section */}
                  <div className={`flex flex-col items-center justify-center p-8 bg-gradient-to-r ${plan.color} text-white relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                    <div className="relative z-10">
                      {plan.icon}
                      <h4 className="text-2xl font-bold mt-3">{plan.title}</h4>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    {/* Cap */}
                    <p className="text-lg text-gray-600 text-center mb-4 font-medium">{plan.cap}</p>

                    {/* Price */}
                    <div className="text-center mb-8">
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        ₹{plan.amount.toLocaleString()}
                      </div>
                      <p className="text-gray-500 font-medium">+Taxes/Month</p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8 flex-grow">
                      {plan.id === 'starter' && (
                        <>
                          <li className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Access to pre-defined strategies</span>
                          </li>
                          <li className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Live performance dashboard</span>
                          </li>
                          <li className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Quarterly performance reports</span>
                          </li>
                        </>
                      )}
                      {plan.id === 'growth' && (
                        <>
                          <li className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">All Starter features</span>
                          </li>
                          <li className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Portfolio rebalancing twice a year</span>
                          </li>
                          <li className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Enhanced market insights</span>
                          </li>
                        </>
                      )}
                      {plan.id === 'pro' && (
                        <>
                          <li className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">All Growth features</span>
                          </li>
                          <li className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Strategy updates</span>
                          </li>
                          <li className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Advanced risk management tools</span>
                          </li>
                        </>
                      )}
                      {plan.id === 'elite' && (
                        <>
                          <li className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">All Pro features</span>
                          </li>
                          <li className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Dedicated strategy manager</span>
                          </li>
                          <li className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Priority support</span>
                          </li>
                        </>
                      )}
                    </ul>

                    {/* Button */}
                    <button
                      disabled={isLoading && activePlanId === plan.id}
                      onClick={() => handlePlanPay(plan as any)}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                          : isLoading && activePlanId === plan.id
                          ? 'bg-gray-400 text-white'
                          : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white shadow-lg'
                      }`}
                    >
                      {isLoading && activePlanId === plan.id ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <CreditCard className="w-5 h-5" />
                          <span>Choose {plan.title}</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Features Section */}
            <div className="mt-20 text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-12">Why Choose Our Platform?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h4>
                  <p className="text-gray-600">Bank-grade security with 99.9% uptime guarantee</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Real-time Data</h4>
                  <p className="text-gray-600">Live market data and instant portfolio updates</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Expert Support</h4>
                  <p className="text-gray-600">24/7 customer support from trading experts</p>
                </div>
              </div>
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
        <div className="text-center mt-16">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
            <p className="text-gray-600 mb-2">
              Powered by <span className="font-bold text-indigo-600">Razorpay</span>
            </p>
            <p className="text-sm text-gray-500">
              Trusted by millions of businesses worldwide
            </p>
          </div>
        </div>
      </div>

 
    </div>
  );
}

export default App;


