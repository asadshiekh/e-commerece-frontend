"use client";

import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    in_stock: true,
  });

  // custom filter
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStock, setFilterStock] = useState("");

//  custom pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch("http://localhost/e-commerce-backend/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const submitProduct = async (e) => {
    e.preventDefault();

    await fetch("http://localhost/e-commerce-backend/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    window.location.reload();
  };


//   my filter logic start from here
  const filteredProducts = products.filter((p) => {
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterCategory ? p.category === filterCategory : true) &&
      (filterStock ? String(p.in_stock) === filterStock : true)
    );
  });

// pagniation logic 
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Product Management
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">

        <input
          type="text"
          placeholder="Search by name..."
          className="border border-gray-300 rounded-lg px-4 py-2"
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          className="border border-gray-300 rounded-lg px-4 py-2"
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Categories</option>
          {[...new Set(products.map((p) => p.category))].map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          className="border border-gray-300 rounded-lg px-4 py-2"
          onChange={(e) => {
            setFilterStock(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Stock Status</option>
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>
      </div>


      <div className="bg-white shadow-md rounded-lg p-6 mb-10 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Product</h2>

        <form
          onSubmit={submitProduct}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <input
            type="text"
            placeholder="Product Name"
            className="border border-gray-300 rounded-lg px-4 py-2"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="number"
            placeholder="Price"
            className="border border-gray-300 rounded-lg px-4 py-2"
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            type="text"
            placeholder="Category"
            className="border border-gray-300 rounded-lg px-4 py-2"
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <select
            className="border border-gray-300 rounded-lg px-4 py-2"
            onChange={(e) =>
              setForm({ ...form, in_stock: e.target.value === "true" })
            }
          >
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Stock</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{p.name}</td>
                <td className="px-6 py-3">AED {p.price}</td>
                <td className="px-6 py-3">{p.category}</td>
                <td className="px-6 py-3">
                  {p.in_stock ? (
                    <span className="text-green-600 font-semibold">In Stock</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages || totalPages === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>

      <p className="text-center mt-4 text-gray-600">
        Page {currentPage} of {totalPages || 1}
      </p>
    </div>
  );
}
