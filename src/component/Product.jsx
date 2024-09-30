import React, { useEffect, useState } from 'react'
import Nav from './Nav'; // Importing the navigation component

function Product() {
    // Define state variables
    const [cartCount, setCartCount] = useState(0); // Holds the count of items in the cart
    const [products, setProducts] = useState([]); // Holds the list of products fetched from API
    const [showModal, setShowModal] = useState(false); // Controls visibility of the cart modal
    const [cartItems, setCartItems] = useState([]); // Holds the list of items added to the cart
    const [details, setDetails] = useState(false); // Controls visibility of the details modal
    const [showDetails, setShowDetails] = useState([]); // Holds the list of details fetched from API
    const [showBuyModal, setShowBuyModal] = useState(false); // Controls visibility of the "buy" modal

    const API_URL = 'https://fakestoreapi.com/products'; // API endpoint to fetch products

    // useEffect hook to fetch products from API when the component mounts
    useEffect(() => {
        async function fetchData() {
            // Fetch data from API
            const response = await fetch(API_URL);
            const data = await response.json();
            setProducts(data); // Store fetched products in the state
        }
        fetchData(); // Call the fetchData function
    }, []); // Empty dependency array ensures this runs only once (on mount)

    // Function to handle adding a product to the cart
    const handleAddToCart = (product) => {
        // Check if the product is already in the cart
        const isProductInCart = cartItems.some((item) => item.id === product.id);

        if (!isProductInCart) {
            // If not, increment the cart count and add the product to the cart
            setCartCount(cartCount + 1);
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        } else {
            setCartItems(
                cartItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        }
    };

    const handleShowDetails = (product) => {
        // Set the details modal visibility to true and store the product details in the state
        setDetails(true);
        setShowDetails(product);
    }

    // Function to toggle the visibility of the cart modal
    const handleModalToggle = () => {
        if (cartItems.length > 0) {
            setShowModal(!showModal); // Toggle modal state only if there are items in the cart
        } else {
            alert("Your cart is empty")
        }
    };

    // Function to close the modal
    const handleModalClose = () => {
        setShowModal(false); // Set modal visibility to false (hidden)
    };

    // Function to handle deletion of an item from the cart
    const handleDeleteItem = (index) => {
        // Remove the item at the given index from the cart array
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart); // Update the cart items state
        setCartCount(cartCount - 1); // Decrease the cart count
    };

    const handleRemoveFromCart = (productId) => {
        const productToRemove = cartItems.find(item => item.id === productId);

        if (productToRemove) {
            // Remove the product from the cart
            const updatedCart = cartItems.filter(item => item.id !== productId);

            // Update the cart items and cart count
            setCartItems(updatedCart);
            setCartCount(cartCount - 1);
        }
    };

    // Calculate total price of the cart items
    const calculateTotalAmount = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Function to open the buy modal
    const handleBuy = () => {
        if (cartItems.length > 0) {
            setShowBuyModal(true);
        } else {
            alert("Your cart is empty");
        }
    };

    // Function to close the buy modal
    const handleCloseBuyModal = () => {
        setShowBuyModal(false);
    };


    return (
        <div className='relative'>
            {/* Render the Nav component, passing cartCount and handleModalToggle as props */}
            <Nav cartCount={cartCount} handleModalToggle={handleModalToggle} />

            {/* Products grid */}
            <div className='container grid grid-rows-1 grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto px-10'>
                {/* Map over the products array and display each product */}
                {products.map((product, index) => {
                    // Find if the product is in the cart and its quantity
                    const cartItem = cartItems.find(item => item.id === product.id);
                    const quantity = cartItem ? cartItem.quantity : 0;

                    return (
                        <div key={product.id} className='container p-5'>
                            <div className='border shadow-md rounded p-3 h-full'>
                                {/* Product image */}
                                <img className='h-52 mx-auto' src={product.image} alt={product.title} />

                                {/* Price and Add to Cart button */}
                                <div className='flex flex-wrap justify-center items-center font-semibold my-5 xl:px-5'>
                                    <p>₹&nbsp;{product.price}</p>

                                </div>
                                <div className='flex flex-wrap 2xl:justify-between justify-center gap-y-3 items-center font-medium my-5 xl:px-5 '>
                                    <button className='border bg-slate-700 hover:bg-slate-950 focus:bg-slate-950 text-white rounded p-2 cursor-pointer hover:scale-105' onClick={() => handleAddToCart(product)}>
                                        {/* Add Cart */}
                                        <p className='px-2'>Add to Cart</p>
                                    </button>
                                    <button className='border bg-slate-700 hover:bg-slate-950 focus:bg-slate-950 text-white rounded p-2 cursor-pointer hover:scale-105' onClick={() => handleShowDetails(product)}>
                                        {/* Product Details */}
                                        <p className='px-2'>Details</p>
                                    </button>
                                </div>

                                {/* Product title */}
                                <p className='flex text-wrap justify-center text-center'>{product.title}</p>

                                {/* product count */}
                                <div className={`flex justify-end items-center mt-5 text-sm ${quantity > 0 ? '' : 'hidden'}`}>
                                    <p className='flex font-semibold'>{quantity} in cart - </p>
                                    <button className='underline cursor-pointer' onClick={() => handleRemoveFromCart(product.id)} >Remove</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Conditional rendering of cart modal */}
            {showModal && cartItems.length > 0 && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    {/* Modal content */}
                    <div className="bg-white p-5 rounded-lg shadow-lg w-full md:w-3/6 mx-2 sm:mx-5 md:mx-0 max-h-[500px] overflow-y-auto">
                        {/* Close button */}
                        <button className='border bg-red-500 rounded p-.5 px-2 text-white text-2xl flex ml-auto' onClick={handleModalClose}>
                            X
                        </button>
                        <h2 className="text-2xl mb-4 text-center">Your Cart</h2>



                        {/* Cart items list */}
                        <div className="flex justify-center flex-col">
                            {cartItems.map((item, index) => (
                                <div key={index} className='flex flex-wrap flex-row items-center justify-center gap-5 md:gap-10 shadow p-2 mb-4 w-full'>
                                    {/* Item image */}
                                    <img src={item.image} alt={item.title} className="h-20" />

                                    {/* Item title */}
                                    <p className='flex flex-wrap w-1/4'>{item.title}</p>

                                    {/* Item price */}
                                    <p>₹&nbsp;{item.price * item.quantity}</p>

                                    {/*  quantity */}
                                    <p className='flex gap-5 justify-center items-center'>
                                        <button className='border rounded px-2 py-1 hover:bg-slate-100 focus:bg-slate-100 hover:scale-110 focus:scale-110'
                                            onClick={() => {
                                                const updatedCart = cartItems.map((cartItem, i) =>
                                                    i === index ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                                                );
                                                setCartItems(updatedCart);
                                            }}
                                        >+</button>
                                        {item.quantity}
                                        <button className='border rounded px-2 py-1 hover:bg-slate-100 focus:bg-slate-100 hover:scale-110 focus:scale-110'
                                            onClick={() => {
                                                if (item.quantity > 1) {
                                                    const updatedCart = cartItems.map((cartItem, i) =>
                                                        i === index ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
                                                    );
                                                    setCartItems(updatedCart);
                                                }
                                            }}
                                        >-</button>
                                    </p>

                                    {/* Delete item button */}
                                    <button
                                        className='border py-2 px-4 rounded-md bg-red-400 hover:bg-red-500 focus:bg-red-500 text-white hover:scale-105'
                                        onClick={() => handleDeleteItem(index)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                            }
                            <div className='flex justify-end items-center'>
                                <button className='border px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-500 text-white' onClick={handleBuy}>Buy</button>
                            </div>
                        </div>

                    </div>

                </div>

            )}

            {details && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    {/* Modal content */}
                    <div className="bg-white p-5 rounded-lg shadow-lg w-full md:w-3/6 mx-2 sm:mx-5 md:mx-0 max-h-[500px] overflow-y-auto">
                        {/* Close button */}
                        <button className='border bg-red-500 rounded p-.5 px-2 text-white text-2xl flex ml-auto' onClick={() => setDetails(false)}>
                            X
                        </button>
                        <h2 className="text-2xl mb-4 text-center">Product Details</h2>
                        <div className='flex flex-wrap flex-col items-center justify-center gap-5 md:gap-10 shadow p-2 mb-4 w-full'>
                            {/* Item image */}
                            <img src={showDetails.image} alt={showDetails.title} className="h-64" />

                            {/* Item title */}
                            <p className='flex flex-wrap font-semibold text-2xl'>{showDetails.title}</p>

                            {/* {Item Price} */}
                            <p className='text-2xl'>₹&nbsp;{showDetails.price}</p>

                            {/* {Item Details} */}
                            <p className='px-5 text-justify'>{showDetails.description}</p>
                        </div>
                    </div>
                </div>
            )}

            {showBuyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-full md:w-3/6 mx-2 sm:mx-5 md:mx-0 max-h-[300px]">
                        <button className='border bg-red-500 rounded p-.5 px-2 text-white text-2xl flex ml-auto' onClick={handleCloseBuyModal}>
                            X
                        </button>
                        <h2 className="text-2xl mb-4 text-center">Total Amount</h2>
                        <p className="text-center text-lg line-through">₹&nbsp;{calculateTotalAmount()}</p>
                        <p className="text-center text-xl my-3">10% discount</p>
                        <p className='text-center text-xl font-semibold'>₹&nbsp;{calculateTotalAmount() - (calculateTotalAmount() * 10 / 100)}</p>
                        <div className='flex justify-center mt-5'>
                            <button className='border px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-500 text-white'>Proceed to Payment</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Product;
