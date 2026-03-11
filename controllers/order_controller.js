const Order = require('../models/order');

exports.checkout = async (req, res) => {
  try {
    const orderId = await Order.createOrder(req.body);
    res.status(201).json({
      success: true,
      message: "Pesanan berhasil diproses",
      orderId: orderId
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.getAllOrders();
    // Mengembalikan rows yang sudah mengandung array 'items'
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

// Tambahkan fungsi ini di file order_controller.js
exports.updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body; // Mengambil status dari body request

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