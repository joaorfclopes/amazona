import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      name: "Joao",
      email: "joaorfclopes@gmail.com",
      password: bcrypt.hashSync("admin", 8),
      isAdmin: true,
    },
    {
      name: "John",
      email: "john@gmail.com",
      password: bcrypt.hashSync("1234", 8),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: "Nike Slim Shirt",
      category: "Shirts",
      image: "/images/p1.jpg",
      price: 1,
      description: "high quality product",
      countInStock: 10,
    },
    {
      name: "Adidas Fit Shirt",
      category: "Shirts",
      image: "/images/p2.jpg",
      price: 100,
      description: "high quality product",
      countInStock: 5,
    },
    {
      name: "Lacoste Free Shirt",
      category: "Shirts",
      image: "/images/p3.jpg",
      price: 220,
      description: "high quality product",
      countInStock: 0,
    },
    {
      name: "Nike Slim Pant",
      category: "Pants",
      image: "/images/p4.jpg",
      price: 78,
      description: "high quality product",
      countInStock: 2,
    },
    {
      name: "Puma Slim Pant",
      category: "Pants",
      image: "/images/p5.jpg",
      price: 65,
      description: "high quality product",
      countInStock: 15,
    },
    {
      name: "Adidas Fit Pant",
      category: "Pants",
      image: "/images/p6.jpg",
      price: 139,
      description: "high quality product",
      countInStock: 23,
    },
  ],
};
export default data;
