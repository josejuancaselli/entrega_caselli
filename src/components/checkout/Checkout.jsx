import { useForm } from "react-hook-form";
import { useCart } from "../../context/CartContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/configFirebase";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./checkout.css"
import Loading from "../loading/Loading"


const Checkout = () => {
    const { emptyCart, cart, getTotalPrice } = useCart();
    const [order, setOrder] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [clientName, setClientName] = useState("");
    const [loading, setLoading] = useState(false)


    const pagar = (data) => {
        const pedido = {
            cliente: data,
            productos: cart,
            total: getTotalPrice(),
        };
        setLoading(true)
        const pedidosRef = collection(db, "pedidos");
        addDoc(pedidosRef, pedido)
            .then((doc) => {
                setOrder(doc.id);
                setClientName(`${data.nombre} ${data.apellido}`);
                emptyCart();
            }).catch((error) => {
                console.error("Error al realizar el pedido:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (

        <div className="checkout-container">
            {loading && <Loading />}
            {order ? (
                <div className="saludo-container">
                    <h1 className="saludo-title">¡Gracias por tu compra {clientName}!</h1>
                    <p className="saludo-order-number">Tu ID de pedido es: {order}</p>
                    <p>Puedes seguir comprando <Link to="/">aquí</Link></p>
                </div>
            ) : (
                <>
                    <h1 className="checkout-title">Checkout</h1>
                    {cart.length === 0 && <p> El carrito esta vacío</p>}
                    <form onSubmit={handleSubmit(pagar)} className="checkout-form">

                        <label className="form-label">Nombre:</label>
                        <input className="form-input" type="text" placeholder="Tus nombres"{...register("nombre", { required: true })} />
                        {errors.nombre && <p className="error">El nombre es obligatorio.</p>}

                        <label className="form-label">Apellido:</label>
                        <input className="form-input" type="text" placeholder="Tu apellido" {...register("apellido", { required: true })} />
                        {errors.apellido && <p className="error">El apellido es obligatorio.</p>}

                        <label className="form-label">Correo:</label>
                        <input className="form-input" type="email" placeholder="tucorreo@correo.com" {...register("email", { required: true })} />
                        {errors.email && <p className="error">El correo es obligatorio.</p>}

                        <label className="form-label">Dirección:</label>
                        <input className="form-input" type="address" placeholder="Tu dirección" {...register("direccion", { required: true })} />
                        {errors.direccion && <p className="error">La dirección es obligatoria.</p>}

                        <label className="form-label">Teléfono:</label>
                        <input className="form-input" type="phone" placeholder="Tu teléfono" {...register("telefono", { required: true })} />
                        {errors.telefono && <p className="error">El teléfono es obligatorio.</p>}

                        <ul className="cart-list">
                            {cart.map((producto, index) => (
                                <li key={index} className="cart-item-summary">
                                    <img src={producto.img} alt={producto.nombre} className="thumbnail" />
                                    <p>{producto.nombre} {producto.descripcion} - ${producto.precio.toLocaleString('es-AR')} x {producto.quantity}</p>
                                </li>
                            ))}
                        </ul>
                        <p className="total-price">Total: ${getTotalPrice().toLocaleString('es-AR')}</p>
                        <div className="checkout-buttons">
                            <button type="submit" className="btn-pay">Pagar</button>
                            <Link to="/carrito"><button type="button" className="btn-cancel" onClick={() => { emptyCart(); }}>Cancelar compra</button></Link>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default Checkout;
