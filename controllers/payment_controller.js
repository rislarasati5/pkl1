import snap from "../config/midtrans.js";
import Order from "../models/order.js";

export const createPayment = async (req, res) => {
  try {

    const { nama_pemesan, nomor_meja, items, total_harga } = req.body;

    const orderId = "ORDER-" + Date.now();

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: total_harga
      },
      customer_details: {
        first_name: nama_pemesan
      },
      enabled_payments: [
        "qris",
        "gopay",
        "shopeepay",
        "bank_transfer"
      ]
    };

    const transaction = await snap.createTransaction(parameter);

    res.json({
      success: true,
      token: transaction.token,
      order_id: orderId,
      data: {
        nama_pemesan,
        nomor_meja,
        items,
        total_harga
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const midtransNotification = async (req, res) => {

  try {

    const { order_id, transaction_status, payment_type } = req.body;

    let paymentStatus = "pending";

    if (transaction_status === "settlement") {
      paymentStatus = "paid";
    }

    if (transaction_status === "expire") {
      paymentStatus = "expired";
    }

    if (transaction_status === "cancel") {
      paymentStatus = "cancel";
    }

    // update status pembayaran di database
    await Order.updatePaymentStatus(
      order_id,
      paymentStatus,
      payment_type
    );

    res.status(200).json({
      success: true,
      message: "Payment status updated"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};