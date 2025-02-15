export type Product = {
    id: number;
    type: number;
}

export type Cart = {
    productName: string;
    type: number;
    price: number;
    quantity: number;
}

export type CartRes = {
    totalElements: number;
    content: Cart[];
    totalPages: number;
}
