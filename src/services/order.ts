import axios from "axios";
import { UpdateTask, Cart, Product } from "../types/types";

export const getProducts = async (): Promise<Product[]> => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      url: `${import.meta.env.VITE_REACT_API_URL}products`,
    };
    const res = await axios(config);
    return res.data.detail;
  } catch (err: any) {
    return err.response.data;
  }
};

export const getCarts = async (
  page: number,
  size: number
): Promise<CartRes> => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      url: `${import.meta.env.VITE_REACT_API_URL}carts?page=${page}&size=${size}`,
    };
    const res = await axios(config);
    return res.data.detail;
  } catch (err: any) {
    return err.response.data;
  }
};

export const createOrder = async (body: Cart[]) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      url: `${import.meta.env.VITE_REACT_API_URL}carts`,
      data: body,
    };
    const res = await axios(config);
    return res.data;
  } catch (err: any) {
    return err.response.data;
  }
};

