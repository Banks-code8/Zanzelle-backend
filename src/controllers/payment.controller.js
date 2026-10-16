// // src/controllers/payment.controller.js

// import * as paymentService from "../services/payment.service.js";

// export const initializePayment = async (req, res, next) => {
//   try {
//     const payment = await paymentService.initializePaymentService(
//       req.body.orderId,
//       req.user,
//     );

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

// export const verifyPayment = async (req, res, next) => {
//   try {
//     const result = await paymentService.verifyPaymentService(
//       req.params.reference,
//     );

//     res.status(200).json(result);
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
