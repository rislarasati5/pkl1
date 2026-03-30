const pool = require('../config/db');

const createOrder = async (orderData) => {
  const { nama_pemesan, nomor_meja, total_harga, items } = orderData;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const orderQuery = `
      INSERT INTO orders (nama_pemesan, nomor_meja, total_harga) 
      VALUES ($1, $2, $3) RETURNING id
    `;

    const res = await client.query(orderQuery, [nama_pemesan, nomor_meja, total_harga]);
    const orderId = res.rows[0].id;

    const itemQuery = `
      INSERT INTO order_items (order_id, post_id, qty, subtotal) 
      VALUES ($1, $2, $3, $4)
    `;

    for (const item of items) {

      const hargaSatuan = parseInt(item.isi.replace(/\D/g, ""));
      const kuantitas = item.qty || 1;
      const subtotalPerItem = hargaSatuan * kuantitas;

      await client.query(itemQuery, [orderId, item.id, kuantitas, subtotalPerItem]);

    }

    await client.query('COMMIT');
    return orderId;

  } catch (err) {

    await client.query('ROLLBACK');
    throw err;

  } finally {

    client.release();

  }
};

const getAllOrders = async () => {
  const query = `
    SELECT 
      o.id, 
      o.nama_pemesan, 
      o.nomor_meja, 
      o.total_harga, 
      o.status, 
      o.created_at,
      json_agg(
        json_build_object(
          'id', oi.post_id,
          'judul', p.judul,
          'qty', oi.qty,
          'subtotal', oi.subtotal
        )
      ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN posts p ON oi.post_id = p.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  return pool.query(query);
};

const deleteOrder = async (id) => {

  const client = await pool.connect();

  try {

    await client.query('BEGIN');

    await client.query(`DELETE FROM order_items WHERE order_id = $1`, [id]);

    const result = await client.query(
      `DELETE FROM orders WHERE id = $1 RETURNING *`,
      [id]
    );

    await client.query('COMMIT');

    return result;

  } catch (err) {

    await client.query('ROLLBACK');
    throw err;

  } finally {

    client.release();

  }
};

const updateOrderStatus = async (id, status) => {

  const query = `
    UPDATE orders 
    SET status = $1 
    WHERE id = $2 
    RETURNING *
  `;

  return pool.query(query, [status, id]);

};

/* ============================= */
/* TAMBAHAN UNTUK MIDTRANS */
/* ============================= */

const updatePaymentStatus = async (midtrans_order_id, payment_status, payment_method) => {

  const query = `
    UPDATE orders
    SET payment_status = $1,
        payment_method = $2,
        paid_at = NOW()
    WHERE midtrans_order_id = $3
    RETURNING *
  `;

  return pool.query(query, [payment_status, payment_method, midtrans_order_id]);

};

module.exports = { 
  createOrder, 
  getAllOrders,
  deleteOrder, 
  updateOrderStatus,
  updatePaymentStatus
};