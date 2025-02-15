import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableContainer,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Paper,
  Tab,
  Pagination,
  Tabs,
} from "@mui/material";

import { getCarts, createOrder } from "../services/order";
import { Cart } from "../types/types";

const FETCH_LIMIT = 10;

type Props = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  carts: Cart[];
  setCarts: React.Dispatch<React.SetStateAction<Cart[]>>;
};

const OrderList = (props: Props) => {
  const { setIsModalOpen, carts, setCarts } = props;
  const queryClient = useQueryClient();

  const [tab, setTab] = useState(1);
  const [offset, setOffset] = useState(0);

  const { data: cartsList } = useQuery({
    queryKey: ["cart-list", offset],
    queryFn: () => getCarts(offset, FETCH_LIMIT),
  });

  const { mutate: mutateCreateCarts } = useMutation({
    mutationFn: createOrder,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["cart-list"],
      });
      setCarts([]);
    },
  });

  return (
    <div className="flex justify-center">
      <div className="w-[100%]">
        <div className="flex justify-between items-center">
          <Tabs
            value={tab}
            onChange={(_, newValue: number) => setTab(newValue)}
          >
            <Tab label="Carts" value={1} />
            <Tab label="Purchased List" value={2} />
          </Tabs>
          {tab === 1 ? (
            <button
              className="py-2 px-5 bg-blue-500 text-white font-bold rounded-md"
              onClick={() => setIsModalOpen(true)}
            >
              Buy Stuff
            </button>
          ) : null}
        </div>
        <div className={tab === 2 ? `hidden` : ""}>
          {carts.length === 0 ? (
            <div className="flex m-3 justify-center">
              <p>tidak ada cart</p>
            </div>
          ) : (
            <div>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Name</TableCell>
                      <TableCell align="center">Type</TableCell>
                      <TableCell align="center">Price</TableCell>
                      <TableCell align="center">Qty</TableCell>
                      <TableCell align="center">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {carts.map((cart, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {cart.productName}
                        </TableCell>
                        <TableCell align="center">{cart.type}</TableCell>
                        <TableCell align="center">
                          Rp. {cart.price.toLocaleString()}
                        </TableCell>
                        <TableCell align="center">{cart.quantity}</TableCell>
                        <TableCell align="center">
                          Rp. {(cart.price * cart.quantity).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className="flex justify-end mr-5 my-3">
                <p>
                  Total : Rp.{" "}
                  {carts
                    .reduce((acc, product) => {
                      return acc + product.quantity * product.price;
                    }, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="flex justify-end mr-5">
                <button
                  className="py-2 px-5 bg-blue-500 text-white font-bold rounded-md"
                  onClick={() => mutateCreateCarts(carts)}
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>
        <div className={tab === 1 ? `hidden` : ""}>
          <div>
            {cartsList && cartsList !== undefined ? (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Name</TableCell>
                      <TableCell align="center">Type</TableCell>
                      <TableCell align="center">Price</TableCell>
                      <TableCell align="center">Qty</TableCell>
                      <TableCell align="center">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartsList.content?.map((cart: Cart, index: number) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {cart.productName}
                        </TableCell>
                        <TableCell align="center">{cart.type}</TableCell>
                        <TableCell align="center">
                          Rp. {cart.price.toLocaleString()}
                        </TableCell>
                        <TableCell align="center">{cart.quantity}</TableCell>
                        <TableCell align="center">
                          Rp. {(cart.price * cart.quantity).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null}
          </div>
          {cartsList && cartsList !== undefined ? (
            <div className="flex justify-center mt-3">
              <Pagination
                count={cartsList.totalPages}
                onChange={(_, value) => setOffset(value)}
                color="primary"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
