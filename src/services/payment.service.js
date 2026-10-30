// // src/services/payment.service.js

// import * as paystack from "../config/paystack.js";
// import Order from "../models/order.model.js";
// import { v4 as uuidv4 } from "uuid";
// import User from "../models/user.model.js";
// import Payment from "../../../src/models/payment.model.js";

// // ======================Wallet ======================//

// export const wallet = async () => {
//   const dbUser = await User.findById(user.id);

//   if (!dbUser) {
//     throw new Error("User not found");
//   }
//   const reference = `PAY-${uuidv4()}`;
//   const amountInKobo = Math.round(payment.totalPrice * 100);

//   const createWallet = await Payment.create({
//     userId: dbUser._id,
//     provider: "paystack",
//     amount: payment.totalPrice,
//     reference,
//   });

//   return {
//     ...paymentData,
//     reference,
//   };
// };
// // ======================Transaction History ======================//

// export const transactionHistory = async (reference) => {
//   const payment = await Payment.findOne(reference);

//   if (!payment) {
//     throw new Error("Payment not found");
//   }

//   const verification = await paystack.verifyPayment(reference);

//   if (verification.status !== "success") {
//     await Payment.findOneAndUpdate(
//       { reference },
//       {
//         status: "failed",
//         gatewayResponse: verification,
//       },
//       { new: true },
//     );

//     throw new Error("Payment failed");
//   }

//   // Mark payment successful
//   await paymentRepo.updatePaymentRepo(reference, {
//     status: "success",
//     gatewayResponse: verification,
//   });

//   // Update Transaction
//   await Order.findByIdAndUpdate(payment.orderId, {
//     paymentStatus: "paid",
//     orderStatus: "processing",
//   });

//   return {
//     success: true,
//     message: "Payment verified successfully",
//   };
// };

// // ======================Inter Bank Transfer ======================//

// export const interTransfer = async () => {
//   const dbUser = await User.findById(user.id);

//   if (!dbUser) {
//     throw new Error("User not found");
//   }
//   const reference = `PAY-${uuidv4()}`;
//   const amountInKobo = Math.round(payment.totalPrice * 100);

//   const createWallet = await Payment.create({
//     userId: dbUser._id,
//     provider: "paystack",
//     amount: payment.totalPrice,
//     reference,
//   });

//   return {
//     ...paymentData,
//     reference,
//   };
// };

// // ======================Outer Bank Transfer ======================//

// export const outerTransfer = async () => {
//   const dbUser = await User.findById(user.id);

//   if (!dbUser) {
//     throw new Error("User not found");
//   }
//   const reference = `PAY-${uuidv4()}`;
//   const amountInKobo = Math.round(payment.totalPrice * 100);

//   const createWallet = await Payment.create({
//     userId: dbUser._id,
//     provider: "paystack",
//     amount: payment.totalPrice,
//     reference,
//   });

//   return {
//     ...paymentData,
//     reference,
//   };
// };

// // ======================Withdrawal ======================//

// export const withdrawal = async () => {
//   const dbUser = await User.findById(user.id);

//   if (!dbUser) {
//     throw new Error("User not found");
//   }
//   const reference = `PAY-${uuidv4()}`;
//   const amountInKobo = Math.round(payment.totalPrice * 100);

//   const createWallet = await Payment.create({
//     userId: dbUser._id,
//     provider: "paystack",
//     amount: payment.totalPrice,
//     reference,
//   });

//   return {
//     ...paymentData,
//     reference,
//   };
// };

// // ======================Purchase Payment ======================//

// export const purchasePayment = async () => {
//   const dbUser = await User.findById(user.id);

//   if (!dbUser) {
//     throw new Error("User not found");
//   }
//   const reference = `PAY-${uuidv4()}`;
//   const amountInKobo = Math.round(payment.totalPrice * 100);

//   const createWallet = await Payment.create({
//     userId: dbUser._id,
//     provider: "paystack",
//     amount: payment.totalPrice,
//     reference,
//   });

//   return {
//     ...paymentData,
//     reference,
//   };
// };

// // ======================Reciept ======================//

// export const reciept = async () => {
//   const dbUser = await User.findById(user.id);

//   if (!dbUser) {
//     throw new Error("User not found");
//   }
//   const reference = `PAY-${uuidv4()}`;
//   const amountInKobo = Math.round(payment.totalPrice * 100);

//   const createWallet = await Payment.create({
//     userId: dbUser._id,
//     provider: "paystack",
//     amount: payment.totalPrice,
//     reference,
//   });

//   return {
//     ...paymentData,
//     reference,
//   };
// };

import * as paystack from "../config/paystack.js";
import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import { v4 as uuidv4 } from "uuid";

// ======================
// Helpers
// ======================

const getUserId = (user) => {
  const userId = user?._id || user?.id;

  if (!userId) {
    throw new Error("Authentication required");
  }

  return userId;
};

const validateAmount = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Enter a valid amount");
  }

  return value;
};

// ======================
// Initialize a Paystack Payment
// ======================

const initializeTransaction = async ({
  user,
  amount,
  paymentType,
  purchaseDetails = {},
}) => {
  const userId = getUserId(user);
  const validAmount = validateAmount(amount);

  const dbUser = await User.findById(userId);

  if (!dbUser) {
    throw new Error("User not found");
  }

  if (!dbUser.email) {
    throw new Error("Your account must have an email address");
  }

  const reference = `ZAN-${uuidv4()}`;

  const payment = await Payment.create({
    userId: dbUser._id,
    paymentType,
    provider: "paystack",
    amount: validAmount,
    currency: "NGN",
    reference,
    status: "pending",
    ...(paymentType === "purchase" && { purchaseDetails }),
  });

  try {
    const result = await paystack.initializePayment({
      email: dbUser.email,
      amount: Math.round(validAmount * 100),
      reference,
    });

    // Supports either a normalized result or a Paystack
    // transaction object, depending on your config implementation.
    const paymentData = result.data ?? result;

    return {
      success: true,
      message: "Payment initialized successfully",
      reference,
      amount: validAmount,
      currency: "NGN",
      authorizationUrl: paymentData.authorization_url,
      accessCode: paymentData.access_code,
    };
  } catch (error) {
    await Payment.findOneAndUpdate(
      { reference, status: "pending" },
      {
        $set: {
          status: "failed",
          gatewayResponse: { message: error.message },
        },
      },
    );

    throw error;
  }
};

// ======================
// Wallet Funding
// ======================

export const wallet = async (data, user) => {
  return initializeTransaction({
    user,
    amount: data.amount,
    paymentType: "wallet_funding",
  });
};

// ======================
// Purchase Airtime, Data, Bills, etc.
// ======================

export const purchasePayment = async (data, user) => {
  const { serviceType, provider, recipient, productCode, amount } = data;

  const supportedServices = [
    "airtime",
    "data",
    "electricity",
    "cable",
    "recharge_card",
    "other",
  ];

  if (!supportedServices.includes(serviceType)) {
    throw new Error("Unsupported digital service");
  }

  if (!provider || !recipient || !productCode) {
    throw new Error("Provider, recipient, and product code are required");
  }

  return initializeTransaction({
    user,
    amount,
    paymentType: "purchase",
    purchaseDetails: {
      serviceType,
      provider,
      recipient,
      productCode,
    },
  });
};

// ======================
// Verify Paystack Payment
// ======================

export const verifyPayment = async (reference, user) => {
  const userId = getUserId(user);

  const payment = await Payment.findOne({
    reference,
    userId,
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "success") {
    return {
      success: true,
      message: "Payment already verified",
      reference,
      status: payment.status,
    };
  }

  if (payment.status !== "pending") {
    throw new Error("This payment cannot be verified");
  }

  const result = await paystack.verifyPayment(reference);
  const verification = result.data ?? result;

  if (
    verification.status !== "success" ||
    verification.reference !== reference
  ) {
    throw new Error("Payment verification failed");
  }

  const expectedAmount = Math.round(payment.amount * 100);

  if (Number(verification.amount) !== expectedAmount) {
    throw new Error("Payment amount does not match");
  }

  const updatedPayment = await Payment.findOneAndUpdate(
    {
      _id: payment._id,
      status: "pending",
    },
    {
      $set: {
        status: "success",
        gatewayResponse: result,
      },
    },
    { new: true },
  );

  if (!updatedPayment) {
    throw new Error("Payment status changed; check the latest transaction");
  }

  // IMPORTANT:
  // Wallet funding must now credit the wallet through an atomic,
  // idempotent wallet ledger operation.
  //
  // Digital purchases must now be fulfilled through your selected
  // airtime/bill provider. Do not report the service as delivered
  // merely because Paystack payment succeeded.
  //
  // Those integrations must be added before using this flow in
  // production.

  return {
    success: true,
    message: "Payment verified successfully",
    reference,
    status: updatedPayment.status,
    paymentType: updatedPayment.paymentType,
    amount: updatedPayment.amount,
  };
};

// ======================
// Transaction History
// ======================

export const transactionHistory = async (userId, query = {}) => {
  const filter = { userId };

  if (query.status) {
    const allowedStatuses = ["pending", "success", "failed"];

    if (!allowedStatuses.includes(query.status)) {
      throw new Error("Invalid transaction status");
    }

    filter.status = query.status;
  }

  if (query.paymentType) {
    const allowedTypes = [
      "wallet_funding",
      "purchase",
      "internal_transfer",
      "bank_transfer",
      "withdrawal",
    ];

    if (!allowedTypes.includes(query.paymentType)) {
      throw new Error("Invalid transaction type");
    }

    filter.paymentType = query.paymentType;
  }

  return Payment.find(filter)
    .sort({ createdAt: -1 })
    .select("-gatewayResponse");
};

// ======================
// Receipt
// ======================

export const reciept = async (reference, user) => {
  const userId = getUserId(user);

  const payment = await Payment.findOne({
    reference,
    userId,
  }).select("-gatewayResponse");

  if (!payment) {
    throw new Error("Transaction not found");
  }

  if (payment.status !== "success") {
    throw new Error("Receipt is available only for successful transactions");
  }

  return payment;
};

// ======================
// Internal Transfer
// ======================

export const interTransfer = async () => {
  throw new Error(
    "Internal transfers require a wallet ledger and atomic balance transfer implementation",
  );
};

// ======================
// External Bank Transfer
// ======================

export const outerTransfer = async () => {
  throw new Error(
    "Bank transfers require Paystack transfer recipient and payout integration",
  );
};

// ======================
// Withdrawal
// ======================

export const withdrawal = async () => {
  throw new Error(
    "Withdrawals require wallet balance validation and payout integration",
  );
};
