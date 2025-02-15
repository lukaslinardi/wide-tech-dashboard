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

  const [taskTab, setTaskTab] = useState(1);
  const [offset, setOffset] = useState(0);

  const { data: cartsList } = useQuery({
    queryKey: ["cart-list", offset],
    queryFn: () => getCarts(offset, FETCH_LIMIT),
  });

  const pageCount = useMemo(() => {
    if (cartsList && cartsList !== undefined) {
      return Math.ceil(cartsList.totalElements / FETCH_LIMIT);
    } else {
      return 0;
    }
  }, [cartsList]);

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
            value={taskTab}
            onChange={(_, newValue: number) => setTaskTab(newValue)}
          >
            <Tab label="Carts" value={1} />
            <Tab label="Purchased List" value={2} />
          </Tabs>
          <button
            className="py-2 px-5 bg-blue-500 text-white font-bold rounded-md"
            onClick={() => setIsModalOpen(true)}
          >
            Buy Stuff
          </button>
        </div>
        {carts.length === 0 ? (
          <div className="flex m-3 justify-center">
            <p>tidak ada cart</p>
          </div>
        ) : (
          <div className={taskTab === 2 ? `hidden` : ""}>
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
            </div>
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
        <div className={taskTab === 1 ? `hidden` : ""}>
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
            <div className="flex justify-center">
              <Pagination
                count={pageCount}
                onChange={(_, value) => setOffset(value)}
              />
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
