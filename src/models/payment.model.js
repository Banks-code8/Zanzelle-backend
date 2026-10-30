// // src/models/payment.model.js

// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema(
//   {
//     paymentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Order",
//       required: true,
//     },

//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     provider: {
//       type: String,
//       enum: ["paystack", "stripe"],
//       required: true,
//     },

//     amount: {
//       type: Number,
//       required: true,
//     },

//     currency: {
//       type: String,
//       default: "NGN",
//     },

//     reference: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     status: {
//       type: String,
//       enum: ["pending", "success", "failed"],
//       default: "pending",
//     },

//     gatewayResponse: {
//       type: Object,
//       default: {},
//     },
//   },
//   { timestamps: true },
// );

// export default mongoose.model("Payment", paymentSchema);

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    paymentType: {
      type: String,
      enum: [
        "wallet_funding",
        "purchase",
        "internal_transfer",
        "bank_transfer",
        "withdrawal",
      ],
      required: true,
    },

    provider: {
      type: String,
      enum: ["paystack", "stripe", "wallet", "bill_provider"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    currency: {
      type: String,
      default: "NGN",
      uppercase: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
      index: true,
    },

    purchaseDetails: {
      serviceType: {
        type: String,
        enum: [
          "airtime",
          "data",
          "electricity",
          "cable",
          "recharge_card",
          "other",
        ],
        default: undefined,
      },

      provider: {
        type: String,
        default: null,
      },

      recipient: {
        type: String,
        default: null,
      },

      productCode: {
        type: String,
        default: null,
      },

      providerReference: {
        type: String,
        default: null,
      },
    },

    transferDetails: {
      recipientUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      accountNumber: {
        type: String,
        default: null,
      },

      bankCode: {
        type: String,
        default: null,
      },

      recipientCode: {
        type: String,
        default: null,
      },
    },

    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
