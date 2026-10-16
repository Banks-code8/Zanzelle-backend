// import axios from "axios";
// const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
// // const testPaystackConnection = async () => {
// //   try {
// //     const response = await axios.get("https://api.paystack.co/bank", {
// //       headers: {
// //         Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
// //       },
// //     });

// //     console.log("✅ Paystack authentication works");
// //     return response.data;
// //   } catch (error) {
// //     console.error(
// //       "❌ Paystack authentication failed:",
// //       error.response?.data || error.message,
// //     );
// //   }
// // };
// // testPaystackConnection();
// if (!PAYSTACK_SECRET_KEY) {
//   throw new Error("PAYSTACK_SECRET_KEY is not configured");
// }

// export const initializePaystackPayment = async ({
//   email,
//   amount,
//   reference,
// }) => {
//   try {
//     console.log("===== PAYSTACK INITIALIZE =====");
//     console.log("Email:", email);
//     console.log("Amount received:", amount);
//     console.log("Amount sent:", Math.round(Number(amount) * 100));
//     console.log("Reference:", reference);

//     const response = await axios.post(
//       "https://api.paystack.co/transaction/initialize",
//       {
//         email,
//         amount: Math.round(Number(amount) * 100),
//         reference,
//         callback_url: `${process.env.CLIENT_URL}/payment/success`,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//       },
//     );

//     console.log("Paystack initialize response:", response.data);

//     return response.data.data;
//   } catch (error) {
//     console.error(
//       "❌ Paystack initialize failed:",
//       error.response?.data || error.message,
//     );

//     throw error;
//   }
// };

// export const verifyPaystackPayment = async (reference) => {
//   const response = await axios.get(
//     `https://api.paystack.co/transaction/verify/${reference}`,
//     {
//       headers: {
//         Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
//         "Content-Type": "application/json",
//       },
//     },
//   );

//   return response.data.data;
// };
