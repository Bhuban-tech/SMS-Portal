"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Filter,
  Upload,
  X,
  Wallet,
  CreditCard,
  Phone,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import { toast, Toaster } from "sonner";

export default function BalanceReportPage() {
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);


  const data = [
    {
      sn: 3,
      date: "2025-07-24",
      particular: "SINGLE SMS",
      dr: "-2",
      cr: "-",
      balance: "398.00",
      attachment: "-",
      user: "Aadim National College",
      sourceRemark: "-",
    },
  ];

  const filteredData = data.filter((row) => {
    const matchDate = filterDate ? row.date === filterDate : true;
    const matchType = filterType
      ? row.particular.toLowerCase().includes(filterType.toLowerCase())
      : true;
    return matchDate && matchType;
  });

  const quickAmounts = [100, 500, 1000, 2000, 5000];
  const paymentMethods = [
    {
      id: "esewa",
      name: "eSewa",
      icon: CreditCard,
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: "khalti",
      name: "Khalti",
      icon: Phone,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const getAuthToken = () => localStorage.getItem("token") || "";

  const handlePaymentSelect = (methodId) => {
    setSelectedPayment(methodId);
    setShowAmountInput(true);
  };

  const handleBackToPaymentMethod = () => {
    setShowAmountInput(false);
    setTopUpAmount("");
  };

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount);
    if (!topUpAmount || isNaN(amount) || amount < 100) {
      toast.error("Please enter a valid amount (minimum Rs. 100)", {
        duration: 4000,
      });
      return;
    }

    setIsProcessing(true);

    const token = getAuthToken();
    if (!token) {
      toast.error("You are not logged in. Please login first.");
      setIsProcessing(false);
      return;
    }

    try {
      const amountInPaisa = Math.round(amount * 100);

      const requestBody = {
        amount: amountInPaisa,
        purchase_order_id: `TOPUP_${Date.now()}`,
        purchase_order_name: "SMS Balance Top Up",
        return_url: `${window.location.origin}/balance-report`,
        website_url: window.location.origin,
        amount_breakdown: [
          { label: "SMS Balance Top Up", amount: amountInPaisa },
        ],
        product_details: [
          {
            identity: `TOPUP_${Date.now()}`,
            name: "SMS Balance Top Up",
            total_price: amountInPaisa,
            quantity: 1,
            unit_price: amountInPaisa,
          },
        ],
        customer_info: {
          name: "Aadim National College",
          email: "admin@aadim.edu.np",
          phone: "9800000000",
        },
      };

      const response = await fetch("http://localhost:8080/api/khalti/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      let result;
      if (response.headers.get("content-type")?.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON: ${text}`);
      }

      if (!response.ok) {
        throw new Error(
          result.message || result.error || `Server error (${response.status})`
        );
      }

      if (result.payment_url) {
        window.location.href = result.payment_url;
      } else {
        throw new Error(result.message || "No payment URL received");
      }
    } catch (err) {
      console.error("Payment initiation failed:", err);
      toast.error(
        err.message.includes("Failed to fetch")
          ? "Network error. Please check your internet connection."
          : err.message || "Failed to start payment. Please try again.",
        { duration: 5000 }
      );
    } finally {
      setIsProcessing(false);
    }
  };

 const verifyPayment = async (pidx) => {
  setIsVerifying(true);

  try {
    const token = getAuthToken();
    if (!token) throw new Error("token expired.Please login again.");

    const response = await fetch("http://localhost:8080/api/khalti/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ pidx }),
    });

    let data;
    if (response.headers.get("content-type")?.includes("application/json")) {
      data = await response.json();
    } else {
      throw new Error("Invalid server response");
    }

    if (!response.ok) {
      throw new Error(data.message || "Verification failed");
    }

    if (data.status === "Completed") {
      toast.success("Payment Successful! Your balance has been updated.");
      
      
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      throw new Error(data.message || "Payment not completed");
    }
  } catch (err) {
    console.error("Payment verification failed:", err);
    toast.error(
      err.message.includes("Failed to fetch")
        ? "Network error during verification."
        : err.message || "Could not verify payment. Please contact support.",
      { duration: 5000 }
    );
  } finally {
    setIsVerifying(false);
  }
};

 useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get("status");
  const pidx = urlParams.get("pidx");

  if (!verified && status === "Completed" && pidx) {
    verifyPayment(pidx);
    setVerified(true); 
  } else if (status === "Failed" || status === "User canceled") {
    toast.error("Payment was not successful. Please try again.");
  }
}, [verified]);


  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowTopUp(false);
        setShowAmountInput(false);
        setSelectedPayment("");
        setTopUpAmount("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Toast Container */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: {
            borderRadius: "12px",
            background: "#333",
            color: "#fff",
          },
        }}
      />

      <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6">
        <header className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Balance Report</h1>
          <p className="text-gray-600 text-sm">Track your SMS balance and transactions</p>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
         

     
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border">
                <Calendar className="w-5 h-5 text-gray-500" />
                <input
                  type="date"
                  className="outline-none text-sm"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  className="outline-none text-sm"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="bulk">Bulk SMS</option>
                  <option value="group">Group SMS</option>
                  <option value="single">Single SMS</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowTopUp(true)}
                className="flex-1 sm:flex-none bg-teal-600 hover:bg-teal-700 px-4 py-2.5 text-white rounded-xl shadow transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Wallet size={18} />
                Top Up
              </button>
              <button className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 shadow-sm flex items-center justify-center gap-2">
                <Upload size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Top-Up Modal */}
          {showTopUp && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl">
                <div className="sticky top-0 bg-linear-to-r from-teal-600 to-teal-700 border-b p-5 rounded-t-2xl z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Top Up Balance</h2>
                        <p className="text-sm text-teal-100">
                          {!showAmountInput
                            ? "Choose payment method"
                            : `Pay with ${selectedPayment === "esewa" ? "eSewa" : "Khalti"}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowTopUp(false);
                        setShowAmountInput(false);
                        setSelectedPayment("");
                        setTopUpAmount("");
                      }}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                  {!showAmountInput ? (
                    <>
                      <div className="bg-linear-to-r from-teal-50 to-teal-100 p-5 rounded-xl border border-teal-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">Current Balance</span>
                          <span className="text-2xl font-bold text-teal-700">Rs. 398.00</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Select Payment Method
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          {paymentMethods.map((method) => {
                            const Icon = method.icon;
                            return (
                              <button
                                key={method.id}
                                onClick={() => handlePaymentSelect(method.id)}
                                className="p-6 rounded-xl border-2 transition-all border-gray-200 hover:border-teal-500 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-300"
                              >
                                <div className="flex flex-col items-center gap-3">
                                  <div className={`${method.color} p-4 rounded-xl`}>
                                    <Icon className={`w-8 h-8 ${method.iconColor}`} />
                                  </div>
                                  <span className="font-semibold text-lg">{method.name}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Instant & Secure</p>
                          <p className="text-blue-700">
                            Use eSewa or Khalti for fast and reliable top-up.
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-linear-to-r from-teal-50 to-teal-100 p-5 rounded-xl border border-teal-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">Current Balance</span>
                          <span className="text-2xl font-bold text-teal-700">Rs. 398.00</span>
                        </div>
                      </div>

                      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          {(() => {
                            const method = paymentMethods.find((m) => m.id === selectedPayment);
                            const Icon = method?.icon;
                            return (
                              <>
                                <div className={`${method?.color} p-3 rounded-lg`}>
                                  {Icon && <Icon className={`w-6 h-6 ${method?.iconColor}`} />}
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Selected Method</p>
                                  <p className="font-semibold text-lg">{method?.name}</p>
                                </div>
                              </>
                            );
                          })()}
                          <button
                            onClick={handleBackToPaymentMethod}
                            className="ml-auto text-teal-600 hover:text-teal-700 text-sm font-medium"
                          >
                            Change
                          </button>
                        </div>
                      </div>

                      {isVerifying && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                          <Loader className="w-5 h-5 animate-spin text-blue-600" />
                          <p className="text-blue-800">Verifying payment...</p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Amount (Min. Rs. 100)
                        </label>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {quickAmounts.map((amount) => (
                            <button
                              key={amount}
                              type="button"
                              onClick={() => setTopUpAmount(amount.toString())}
                              className={`p-3 rounded-lg border transition-all ${
                                topUpAmount === amount.toString()
                                  ? "border-teal-500 bg-teal-50 text-teal-700 font-semibold"
                                  : "border-gray-200 hover:border-teal-300"
                              }`}
                            >
                              Rs. {amount}
                            </button>
                          ))}
                        </div>

                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                          <input
                            type="number"
                            placeholder="Custom amount"
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                            min="100"
                          />
                        </div>
                      </div>

                      {topUpAmount && parseFloat(topUpAmount) >= 100 && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Top-up Amount</span>
                              <span className="font-semibold">Rs. {topUpAmount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Service Charge</span>
                              <span>Rs. 0.00</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                              <div className="flex justify-between font-bold text-lg">
                                <span>Total Payable</span>
                                <span className="text-teal-700">Rs. {topUpAmount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white p-5 flex gap-3 border-t z-10">
                  {!showAmountInput ? (
                    <button
                      onClick={() => {
                        setShowTopUp(false);
                        setSelectedPayment("");
                      }}
                      className="w-full py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleBackToPaymentMethod}
                        className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                        disabled={isProcessing || isVerifying}
                      >
                        Back
                      </button>
                      <button
                        onClick={handleTopUp}
                        disabled={
                          !topUpAmount ||
                          parseFloat(topUpAmount) < 100 ||
                          isProcessing ||
                          isNaN(parseFloat(topUpAmount)) ||
                          isVerifying
                        }
                        className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Pay Rs. ${topUpAmount || "0"}`
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-linear-to-r from-teal-600 to-teal-700 text-white">
                  <tr>
                    <th className="p-3 text-left font-medium">S.N</th>
                    <th className="p-3 text-left font-medium">Date</th>
                    <th className="p-3 text-left font-medium">Particular</th>
                    <th className="p-3 text-left font-medium">Dr</th>
                    <th className="p-3 text-left font-medium">Cr</th>
                    <th className="p-3 text-left font-medium">Balance</th>
                    <th className="p-3 text-left font-medium">Attachment</th>
                    <th className="p-3 text-left font-medium">User</th>
                    <th className="p-3 text-left font-medium">Source Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row) => (
                    <tr key={row.sn} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="p-3">{row.sn}</td>
                      <td className="p-3">{row.date}</td>
                      <td className="p-3 font-medium">{row.particular}</td>
                      <td className="p-3 text-red-600 font-medium">{row.dr}</td>
                      <td className="p-3 text-green-600 font-medium">{row.cr}</td>
                      <td className="p-3 font-semibold">{row.balance}</td>
                      <td className="p-3">{row.attachment}</td>
                      <td className="p-3">{row.user}</td>
                      <td className="p-3">{row.sourceRemark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-4">No transactions found</p>
              <button
                onClick={() => {
                  setFilterDate("");
                  setFilterType("");
                }}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}