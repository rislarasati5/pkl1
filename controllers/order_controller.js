const Order = require('../models/order');
const midtransClient = require('midtrans-client');

// KONFIGURASI MIDTRANS
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

exports.checkout = async (req, res) => {
  try {

    const { nama_pemesan, nomor_meja, total_harga, items } = req.body;

    // SIMPAN ORDER KE DATABASE
    const orderId = await Order.createOrder(req.body);

    res.status(201).json({
      success: true,
      message: "Pesanan berhasil diproses",
      orderId: orderId
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.getAllOrders();

    res.status(200).json(orders.rows);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }
};

exports.deleteOrder = async (req, res) => {
  try {

    const id = req.params.id;

    const result = await Order.deleteOrder(id);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Pesanan tidak ditemukan"
      });
    }

    res.json({
      success: true,
      message: "Pesanan berhasil dihapus"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

exports.updateStatus = async (req, res) => {
  try {

    const id = req.params.id;
    const { status } = req.body;

    const result = await Order.updateOrderStatus(id, status);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Pesanan tidak ditemukan"
      });
    }

    res.json({
      success: true,
      message: `Status pesanan berhasil diubah menjadi ${status}`,
      data: result.rows[0]
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};