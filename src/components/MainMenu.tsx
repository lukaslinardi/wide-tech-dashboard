import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
} from "@mui/material";

import OrderList from "./OrderList";
import { getProducts } from "../services/order";
import { Cart, Product } from "../types/types";


const MainMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reqBody, setReqBody] = useState<Cart>({
    productName: "",
    type: 1,
    price: 0,
    quantity: 0,
  });

  const [carts, setCarts] = useState<Cart[]>([]);

  const { data: products } = useQuery({
    queryKey: ["product-list"],
    queryFn: () => getProducts(),
  });


  return (
    <div>
      <div className="flex justify-center items-center mt-[110px] w-full">
        <p className="font-bold text-blue-500 text-[50px]">Order List</p>
      </div>
      <div className="flex justify-center">
        <div className="border border-black w-[50%] p-3 rounded-md">
          <OrderList setIsModalOpen={setIsModalOpen} carts={carts} setCarts={setCarts}/>
        </div>
      </div>
      <Dialog
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setReqBody({
            productName: "",
            type: 1,
            price: 0,
            quantity: 0,
          });
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Buy Order</DialogTitle>
        <DialogContent>
          <div className="m-3">
            <TextField
              label="Product Name"
              fullWidth
              value={reqBody.productName}
              onChange={(e) => {
                setReqBody((prevValue) => ({
                  ...prevValue,
                  productName: e.target.value,
                }));
              }}
            />
            {products && products !== undefined ? (
              <FormControl fullWidth sx={{ marginY: 2 }}>
                <InputLabel>Type</InputLabel>
                <Select value={reqBody.type} label="Age">
                  {products.map((product: Product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            <TextField
              sx={{ marginBottom: 2 }}
              label="Price"
              fullWidth
              value={reqBody.price}
              onChange={(e) => {
                setReqBody((prevValue) => ({
                  ...prevValue,
                  price: Number(e.target.value),
                }));
              }}
            />
            <TextField
              sx={{ marginBottom: 2 }}
              label="Quantity"
              fullWidth
              value={reqBody.quantity}
              onChange={(e) => {
                setReqBody((prevValue) => ({
                  ...prevValue,
                  quantity: Number(e.target.value),
                }));
              }}
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <button
            className="py-2 px-5 font-bold rounded-md border border-black w-full"
            onClick={() => {
              setIsModalOpen(false);
              setReqBody({
                productName: "",
                type: 1,
                price: 0,
                quantity: 0,
              });
            }}
          >
            Cancel
          </button>
          <button
            className="py-2 px-5 bg-blue-500 text-white font-bold rounded-md w-full"
            onClick={() => {
              setCarts((prevValue) => [...prevValue, reqBody]);
              setIsModalOpen(false);
              setReqBody({
                productName: "",
                type: 1,
                price: 0,
                quantity: 0,
              });
            }}
          >
            Add Cart
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MainMenu;
