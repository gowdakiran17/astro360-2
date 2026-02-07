
import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Lock, CreditCard, CheckCircle2 } from 'lucide-react';

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { plan, cycle } = location.state || { plan: 'silver', cycle: 'yearly' };

    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState(1);

    const prices = {
        silver: { monthly: 9.99, yearly: 99 },
        gold: { monthly: 19.99, yearly: 199 }
    };

    // @ts-ignore
    const amount = prices[plan]?.[cycle] || 0;
    const planName = plan === 'gold' ? 'Gold Elite' : 'Silver Pack';

    const handlePayment = () => {
        setProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setProcessing(false);
            setStep(2);
        }, 2000);
    };

    if (step === 2) {
        return (
            <MainLayout title="Checkout" breadcrumbs={['Subscription', 'Success']}>
                <div className="max-w-md mx-auto text-center py-20">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Payment Successful!</h1>
                    <p className="text-slate-500 mb-8">
                        Thank you for subscribing to {planName}. Your account has been upgraded instantly.
                    </p>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Checkout" breadcrumbs={['Subscription', 'Checkout']}>
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
                
                {/* Order Summary */}
                <div className="lg:col-span-1 order-2 lg:order-1">
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 sticky top-24">
                        <h3 className="font-bold text-slate-800 mb-6">Order Summary</h3>
                        
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                            <div>
                                <h4 className="font-bold text-slate-900">{planName}</h4>
                                <p className="text-sm text-slate-500 capitalize">{cycle} Plan</p>
                            </div>
                            <span className="font-bold text-slate-900">${amount}</span>
                        </div>

                        <div className="flex justify-between items-center mb-2 text-sm text-slate-500">
                            <span>Subtotal</span>
                            <span>${amount}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 text-sm text-slate-500">
                            <span>Tax (0%)</span>
                            <span>$0.00</span>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-200 mb-8">
                            <span className="font-bold text-slate-900 text-lg">Total</span>
                            <span className="font-bold text-indigo-600 text-2xl">${amount}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400 bg-white p-3 rounded-lg border border-slate-100">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span>Secure 256-bit SSL Encrypted Payment</span>
                        </div>
                    </div>
                </div>

                {/* Payment Form */}
                <div className="lg:col-span-2 order-1 lg:order-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Payment Details</h2>
                            <div className="flex gap-2">
                                <div className="w-10 h-6 bg-slate-100 rounded border border-slate-200"></div>
                                <div className="w-10 h-6 bg-slate-100 rounded border border-slate-200"></div>
                                <div className="w-10 h-6 bg-slate-100 rounded border border-slate-200"></div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Card Holder Name</label>
                                <input 
                                    type="text" 
                                    placeholder="John Doe"
                                    className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Card Number</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full p-4 pl-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
                                    />
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Expiry Date</label>
                                    <input 
                                        type="text" 
                                        placeholder="MM / YY"
                                        className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-center"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">CVC</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            placeholder="123"
                                            className="w-full p-4 pr-10 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-center"
                                        />
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handlePayment}
                                disabled={processing}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all mt-4 flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>Processing...</>
                                ) : (
                                    <>Pay ${amount}</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
};

export default CheckoutPage;
