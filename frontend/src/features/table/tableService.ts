import axios from "axios";

const API = "http://localhost:3000/api/tables";

const getToken = () => localStorage.getItem("accessToken");

export const getTables = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const createTable = async (nomor_meja: number) => {

  const res = await axios.post(
    API,
    { nomor_meja },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  return res.data;
};

export const updateTable = async (
  id: number,
  status: string
) => {

  const res = await axios.put(
    `${API}/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  return res.data;
};

export const deleteTable = async (id: number) => {

  const res = await axios.delete(
    `${API}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  return res.data;
};