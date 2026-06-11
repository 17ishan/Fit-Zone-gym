import { useState } from "react";
import { CreditCard, CheckCircle2, X } from "lucide-react";

interface PaymentFlowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPurchase: () => void;
    planName: string;
    planPrice: string;
    customerName: string;
    isProcessing: boolean;
}

export default function PaymentFlowModal({
    isOpen,
    onClose,
    onPurchase,
    planName,
    planPrice,
    customerName,
    isProcessing,
}: PaymentFlowModalProps) {
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handlePurchase = () => {
        setPaymentSuccess(true);
        setTimeout(() => {
            onPurchase();
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl">
                {/* Header */}
                <div className="border-b border-gray-800 p-6 flex justify-between items-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#FFFADC]">
                        Payment <span className="text-[#FF0000]">Checkout</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-[#FF0000] transition-colors"
                        aria-label="Close modal"
                        disabled={isProcessing}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Order Summary */}
                    <div className="bg-black/50 border border-gray-700 rounded-lg p-5 space-y-3">
                        <h3 className="text-lg font-semibold text-[#FFFADC] mb-3">Order Summary</h3>
                        <div className="flex justify-between text-gray-300">
                            <span>Customer:</span>
                            <span className="text-[#FFFADC] font-medium">{customerName}</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Plan:</span>
                            <span className="text-[#FFFADC] font-medium">{planName}</span>
                        </div>
                        <div className="border-t border-gray-700 pt-3 mt-3 flex justify-between text-lg font-bold">
                            <span className="text-[#FFFADC]">Total Amount:</span>
                            <span className="text-[#FF0000]">{planPrice}</span>
                        </div>
                    </div>

                    {/* Payment Method (Demo) */}
                    <div className="bg-black/50 border border-gray-700 rounded-lg p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <CreditCard className="w-6 h-6 text-[#FF0000]" />
                            <h3 className="text-lg font-semibold text-[#FFFADC]">Payment Method</h3>
                        </div>
                        <div className="bg-gradient-to-r from-[#FF0000]/20 to-[#AF0404]/20 border border-[#FF0000]/30 rounded-lg p-4">
                            <p className="text-[#FFFADC] text-sm">
                                <span className="font-semibold">Demo Mode:</span> This is a simulated payment flow.
                                No real payment will be processed.
                            </p>
                        </div>
                    </div>

                    {/* Success Message */}
                    {paymentSuccess && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3 animate-pulse">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                            <p className="text-green-400 font-semibold">Payment Successful! Saving details...</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isProcessing || paymentSuccess}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 text-[#FFFADC] py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handlePurchase}
                            disabled={isProcessing || paymentSuccess}
                            className="flex-1 bg-[#FF0000] hover:bg-[#AF0404] text-[#FFFADC] py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-[#FFFADC] border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : paymentSuccess ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    Success!
                                </>
                            ) : (
                                "Complete Purchase"
                            )}
                        </button>
                    </div>

                    {/* Info Note */}
                    <p className="text-xs text-gray-500 text-center">
                        By completing this purchase, you agree to our terms and conditions.
                    </p>
                </div>
            </div>
        </div>
    );
}
