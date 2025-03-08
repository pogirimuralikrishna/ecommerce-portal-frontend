import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/context";
import "./index.css";
import Cookies from "js-cookie";

const ProductList = () => {
    const apiUrl = useContext(UserContext);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [newProduct, setNewProduct] = useState({ storeName: "", productName: "", productPrice: "", discount: "", productDescription: "" });
    const jwtToken = Cookies.get("jwtToken");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${apiUrl}/all-products`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const productsData = await response.json();
                setProducts(productsData);
                setFilteredProducts(productsData);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [apiUrl, jwtToken]);

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = products.filter((product) =>
            product.productName.toLowerCase().includes(query) || 
            product.storeName.toLowerCase().includes(query)
        );
        setFilteredProducts(filtered);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
    };

    const addProduct = async () => {
        try {
            const response = await fetch(`${apiUrl}/add-product`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`
                },
                body: JSON.stringify(newProduct),
            });

            if (!response.ok) {
                throw new Error("Failed to add product");
            }

            const addedProduct = await response.json();
            setProducts([...products, addedProduct]);
            setFilteredProducts([...filteredProducts, addedProduct]);
            setNewProduct({ storeName: "", productName: "", productPrice: "", discount: "", productDescription: "" });
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const deleteProduct = async (productId) => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/delete-product/${productId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${jwtToken}` }
            });

            if (!response.ok) {
                throw new Error("Failed to delete product");
            }

            setProducts(products.filter((product) => product._id !== productId));
            setFilteredProducts(filteredProducts.filter((product) => product._id !== productId));
            setSelectedProduct(null);
        } catch (error) {
            console.error("Error deleting product:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input
                type="search"
                placeholder="Search by Product Name or Store Name..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-bar"
            />
            
            <h1>Products List</h1>

            <div className="add-product-form">
                <h2>Add Product</h2>
                <input type="text" name="storeName" placeholder="Store Name" value={newProduct.storeName} onChange={handleInputChange} />
                <input type="text" name="productName" placeholder="Product Name" value={newProduct.productName} onChange={handleInputChange} />
                <input type="text" name="productPrice" placeholder="Product Price" value={newProduct.productPrice} onChange={handleInputChange} />
                <input type="text" name="discount" placeholder="Discount" value={newProduct.discount} onChange={handleInputChange} />
                <textarea name="productDescription" placeholder="Product Description" value={newProduct.productDescription} onChange={handleInputChange}></textarea>
                <button onClick={addProduct}>Add Product</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Store Name</th>
                        <th>Product Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((each) => (
                            <tr key={each._id}>
                                <td>{each.storeName}</td>
                                <td>{each.productName}</td>
                                <td>
                                    <button onClick={() => setSelectedProduct(each)}>View</button>
                                    <button onClick={() => deleteProduct(each._id)} disabled={loading}>{loading ? "Deleting..." : "Delete"}</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No products found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {selectedProduct && (
                <div className="detail-view">
                    <h3>Product Details</h3>
                    <p>Product Description: {selectedProduct.productDescription}</p>
                    <p>Discount: {selectedProduct.discount}</p>
                    <p>Product Price: {selectedProduct.productPrice}</p>
                    <button onClick={() => setSelectedProduct(null)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default ProductList;