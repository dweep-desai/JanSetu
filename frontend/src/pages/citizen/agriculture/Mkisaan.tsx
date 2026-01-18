import { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, MapPin, Phone, Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';

interface Product {
  product_id: string;
  mkisan_citizen_id: string;
  product_name: string;
  product_type: string;
  category: string;
  quantity: string;
  price_per_unit: number;
  location?: string;
  description?: string;
  seller_name: string;
  seller_phone?: string;
  created_at: string;
  updated_at: string;
}

interface SellerStatus {
  has_kisan_id: boolean;
  is_registered_as_seller: boolean;
  kisan_id?: string;
}

const Mkisaan = () => {
  const { user } = useAuth();
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [sellerStatus, setSellerStatus] = useState<SellerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const categories = ['all', 'Cereals', 'Vegetables', 'Fruits', 'Oilseeds', 'Pulses', 'Livestock'];

  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    land_area: '',
    land_unit: 'Hectares',
    primary_crop: '',
    district: '',
    state: ''
  });

  // Product form state
  const [productForm, setProductForm] = useState({
    product_name: '',
    product_type: 'Cereals',
    category: '',
    quantity: '',
    price_per_unit: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    checkSellerStatus();
  }, []);

  const checkSellerStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/mkisan/check-kisan-id');
      setSellerStatus(response.data);
      if (response.data.is_registered_as_seller) {
        fetchMyProducts();
      }
    } catch (err: any) {
      console.error('Error checking seller status:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to load mKisan data';
      setError(errorMessage);
      // Set default seller status if API fails
      setSellerStatus({
        has_kisan_id: false,
        is_registered_as_seller: false
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProducts = async () => {
    try {
      const response = await api.get('/mkisan/my-products');
      setMyProducts(response.data);
    } catch (err: any) {
      console.error('Error fetching my products:', err);
    }
  };

  const handleRegisterSeller = async () => {
    try {
      await api.post('/mkisan/register-seller', {
        land_area: registerForm.land_area ? parseFloat(registerForm.land_area) : null,
        land_unit: registerForm.land_unit || null,
        primary_crop: registerForm.primary_crop || null,
        district: registerForm.district || null,
        state: registerForm.state || null
      });
      setShowRegisterForm(false);
      await checkSellerStatus();
      setRegisterForm({
        land_area: '',
        land_unit: 'Hectares',
        primary_crop: '',
        district: '',
        state: ''
      });
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to register as seller');
    }
  };

  const handleCreateProduct = async () => {
    try {
      if (editingProductId) {
        // Update existing product (we'll use PUT/PATCH if available, otherwise POST will need to handle both)
        await api.put(`/mkisan/products/${editingProductId}`, {
          product_name: productForm.product_name,
          product_type: productForm.product_type,
          category: productForm.category,
          quantity: productForm.quantity,
          price_per_unit: parseFloat(productForm.price_per_unit),
          location: productForm.location || null,
          description: productForm.description || null
        });
        setEditingProductId(null);
      } else {
        // Create new product
        await api.post('/mkisan/products', {
          product_name: productForm.product_name,
          product_type: productForm.product_type,
          category: productForm.category,
          quantity: productForm.quantity,
          price_per_unit: parseFloat(productForm.price_per_unit),
          location: productForm.location || null,
          description: productForm.description || null
        });
      }
      setShowProductForm(false);
      setProductForm({
        product_name: '',
        product_type: 'Cereals',
        category: '',
        quantity: '',
        price_per_unit: '',
        location: '',
        description: ''
      });
      await fetchMyProducts();
    } catch (err: any) {
      alert(err.response?.data?.detail || (editingProductId ? 'Failed to update product' : 'Failed to create product'));
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.product_id);
    setProductForm({
      product_name: product.product_name,
      product_type: product.product_type,
      category: product.category,
      quantity: product.quantity,
      price_per_unit: product.price_per_unit.toString(),
      location: product.location || '',
      description: product.description || ''
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/mkisan/products/${productId}`);
      await fetchMyProducts();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete product');
    }
  };


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading mKisan data...</p>
        </div>
      </div>
    );
  }

  // Show error message if there's an error but still allow user to see the page
  if (error && !sellerStatus) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading mKisan</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={checkSellerStatus}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mkisaan - Buyer and Seller Platform</h1>
        <p className="text-gray-600">Connect farmers with buyers</p>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            <strong>Warning:</strong> {error}
          </p>
        </div>
      )}

      {/* Registration Notice */}
      {!sellerStatus?.has_kisan_id && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            <strong>Register as a Farmer:</strong> To sell products on Mkisaan, you need a Kisan ID. 
            Please add your Kisan ID in your <a href="/citizen/profile" className="underline font-semibold">Profile</a> first.
          </p>
        </div>
      )}

      {sellerStatus?.has_kisan_id && !sellerStatus.is_registered_as_seller && !showRegisterForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
          <p className="text-blue-800">
            <strong>Ready to sell?</strong> Register as a seller to start listing your products.
          </p>
          <button
            onClick={() => setShowRegisterForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register as Seller
          </button>
        </div>
      )}

      {/* Registration Form */}
      {showRegisterForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Register as Seller</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Land Area</label>
              <input
                type="number"
                value={registerForm.land_area}
                onChange={(e) => setRegisterForm({ ...registerForm, land_area: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Land Unit</label>
              <select
                value={registerForm.land_unit}
                onChange={(e) => setRegisterForm({ ...registerForm, land_unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option>Hectares</option>
                <option>Acres</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Crop</label>
              <input
                type="text"
                value={registerForm.primary_crop}
                onChange={(e) => setRegisterForm({ ...registerForm, primary_crop: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Wheat"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <input
                type="text"
                value={registerForm.district}
                onChange={(e) => setRegisterForm({ ...registerForm, district: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., New Delhi"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                value={registerForm.state}
                onChange={(e) => setRegisterForm({ ...registerForm, state: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Delhi"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleRegisterSeller}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Register
            </button>
            <button
              onClick={() => setShowRegisterForm(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Product Button */}
      {sellerStatus?.is_registered_as_seller && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowProductForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            List New Product
          </button>
        </div>
      )}

      {/* Product Form */}
      {showProductForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{editingProductId ? 'Edit Product' : 'List New Product'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={productForm.product_name}
                onChange={(e) => setProductForm({ ...productForm, product_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Wheat"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
              <select
                value={productForm.product_type}
                onChange={(e) => setProductForm({ ...productForm, product_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <input
                type="text"
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Cereals"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="text"
                value={productForm.quantity}
                onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 100 Quintals"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit (₹) *</label>
              <input
                type="number"
                value={productForm.price_per_unit}
                onChange={(e) => setProductForm({ ...productForm, price_per_unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 2100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={productForm.location}
                onChange={(e) => setProductForm({ ...productForm, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Delhi"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                placeholder="Additional details about the product..."
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreateProduct}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              List Product
            </button>
            <button
              onClick={() => {
                setShowProductForm(false);
                setEditingProductId(null);
                setProductForm({
                  product_name: '',
                  product_type: 'Cereals',
                  category: '',
                  quantity: '',
                  price_per_unit: '',
                  location: '',
                  description: ''
                });
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* My Products Grid */}
      {sellerStatus?.is_registered_as_seller && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">My Listed Products</h2>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myProducts.length > 0 ? (
          myProducts.map((product) => (
            <div key={product.product_id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  For Sale
                </span>
                <button
                  onClick={() => handleDeleteProduct(product.product_id)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-bold text-lg text-gray-900 mb-2">{product.product_name}</h3>
              <p className="text-sm text-gray-500 mb-3">{product.category}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <ShoppingCart className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Quantity: <span className="font-medium">{product.quantity}</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-lg text-gray-900">₹{product.price_per_unit}</span>
                  <span className="text-gray-500">per unit</span>
                </div>
                {product.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{product.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{product.seller_name}</span>
                </div>
              </div>

              <button
                onClick={() => handleEditProduct(product)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit Product
              </button>
            </div>
          ))
        ) : sellerStatus?.is_registered_as_seller ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>You haven't listed any products yet. Click "List New Product" to get started.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Mkisaan;
