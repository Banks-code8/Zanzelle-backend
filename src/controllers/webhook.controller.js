await paymentQueue.add(
  "process-payment",
  {
    webhookEventId: webhookEvent._id.toString(),
    event: event.event,
    data: event.data,
  },
  {
    jobId: `paystack-${eventId}`,
  },
);

return res.status(200).send("Webhook received");
