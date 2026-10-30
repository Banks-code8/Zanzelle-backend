// import * as paymentService from "../services/payment.service.js";

// // ======================Wallet Controller ======================//
// export const wallet = async (req, res, next) => {
//   try {
//     const payment = await paymentService.wallet(req.body, req.user);

//     res.status(200).json({
//       success: true,
//       data: payment,
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ======================TransactionHistory Controller ======================//
// export const transactionHistory = async (req, res, next) => {
//   try {
//     const payment = await paymentService.transactionHistory(req.body, req.user);

//     res.status(200).json({
//       success: true,
//       data: payment,
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// // ======================InterTransfer Controller ======================//
// export const interTransfer = async (req, res, next) => {
//   try {
//     const payment = await paymentService.interTransfer(req.body, req.user);

//     res.status(200).json({
//       success: true,
//       data: payment,
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// // ======================OuterTransfer Controller ======================//
// export const outerTransfer = async (req, res, next) => {
//   try {
//     const payment = await paymentService.outerTransfer(req.body, req.user);

//     res.status(200).json({
//       success: true,
//       data: payment,
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// // ======================Purchace Payment Controller ======================//
// export const purchasePayment = async (req, res, next) => {
//   try {
//     const payment = await paymentService.purchasePayment(req.body, req.user);

//     res.status(200).json({
//       success: true,
//       data: payment,
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }; // ======================Withdrawal Controller ======================//
// export const withdrawal = async (req, res, next) => {
//   try {
//     const payment = await paymentService.withdrawal(req.body, req.user);

//     res.status(200).json({
//       success: true,
//       data: payment,
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// // ======================Reciept Controller ======================//
// export const reciept = async (req, res, next) => {
//   try {
//     const payment = await paymentService.reciept(req.body, req.user);

//     res.status(200).json({
//       success: true,
//       data: payment,
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

import * as paymentService from "../services/payment.service.js";

export const wallet = async (req, res, next) => {
  try {
    const data = await paymentService.wallet(req.body, req.user);

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const purchasePayment = async (req, res, next) => {
  try {
    const data = await paymentService.purchasePayment(req.body, req.user);

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const data = await paymentService.verifyPayment(
      req.params.reference,
      req.user,
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const transactionHistory = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    const data = await paymentService.transactionHistory(userId, req.query);

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const reciept = async (req, res, next) => {
  try {
    const data = await paymentService.reciept(req.params.reference, req.user);

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const interTransfer = async (req, res, next) => {
  try {
    const data = await paymentService.interTransfer(req.body, req.user);

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const outerTransfer = async (req, res, next) => {
  try {
    const data = await paymentService.outerTransfer(req.body, req.user);

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const withdrawal = async (req, res, next) => {
  try {
    const data = await paymentService.withdrawal(req.body, req.user);

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
