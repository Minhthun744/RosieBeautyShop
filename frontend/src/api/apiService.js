import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from "./axiosConfig";

// Utility functions to maintain backward compatibility
export const GET_ALL = async (endpoint, params) => {
    const response = await axiosInstance.get(endpoint, { params });
    return response.data;
};

export const GET_ID = async (endpoint, id) => {
    if (endpoint.includes('email')) {
        const response = await axiosInstance.get(endpoint);
        return response.data;
    }
    const response = await axiosInstance.get(`${endpoint}/${id}`);
    return response.data;
};

export const GET_ID_NEW = async (endpoint, method = 'GET') => {
    const response = await axiosInstance({
        method,
        url: endpoint
    });
    return response.data;
};

export const POST_NEW = async (endpoint, data = null) => {
    const response = await axiosInstance.post(endpoint, data);
    return response.data;
};

export const PUT_NEW = async (endpoint, data) => {
    const response = await axiosInstance.put(endpoint, data);
    return response.data;
};

export const DELETE_NEW = async (endpoint) => {
    const response = await axiosInstance.delete(endpoint);
    return response.data;
};

export const PUT_EDIT = async (endpoint, data) => {
    const response = await axiosInstance.put(endpoint, data);
    return response.data;
};

// Thay đổi trạng thái sản phẩm (cho giao diện người dùng)
export const updateProductStatus = async (id, status) => {
  // Có thể cần xác thực nếu API yêu cầu
  try {
    // Ưu tiên endpoint mới nếu có, fallback sang endpoint cũ
    const endpoints = [
      `/catalog/products/${id}/status`,
      `/product-service/products/${id}/status`,
      `/api/catalog/products/${id}/status`
    ];
    for (const endpoint of endpoints) {
      try {
        const response = await axiosInstance.put(endpoint, { status });
        if (response?.data) return response.data;
      } catch (err) {
        if (err?.response?.status && err.response.status !== 404) throw err;
      }
    }
    throw new Error('Không thể cập nhật trạng thái sản phẩm.');
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái sản phẩm:', error);
    throw error;
  }
};

// Product APIs
export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get('/catalog/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
};

// Get single product detail by ID.
// Tries multiple endpoints to support both monolithic catalog-service and dedicated product-service.
export const getProductById = async (id) => {
  if (!id && id !== 0) {
    throw new Error('Không tìm thấy ID sản phẩm hợp lệ');
  }

  // Candidate endpoints in order of preference
  const endpoints = [
    // Legacy /catalog service
    {
      name: 'catalog',
      url: `/catalog/products/${id}`,
    },
    // New microservice path
    {
      name: 'product-service',
      url: `/product-service/products/${id}`,
    },
    // Fallback (sometimes catalogue is exposed behind /api/catalog)
    {
      name: 'api-catalog',
      url: `/api/catalog/products/${id}`,
    },
  ];

  for (const endpoint of endpoints) {
    try {
      console.debug(`[API] getProductById: Trying ${endpoint.name} -> ${endpoint.url}`);
      const response = await axiosInstance.get(endpoint.url, {
        headers: {
          'Cache-Control': 'no-cache',
        },
        timeout: 10000,
      });
      if (response?.data) {
        return response.data;
      }
    } catch (err) {
      // Continue to next endpoint if not found (404) or connection refused; for other errors rethrow
      if (err?.response?.status && err.response.status !== 404) {
        console.error(`[API] getProductById: Error on ${endpoint.name}`, err);
      } else {
        console.warn(`[API] getProductById: ${endpoint.name} not found, trying next...`);
      }
    }
  }

  throw new Error('Không tìm thấy chi tiết sản phẩm.');
};

/**
 * Fetches products by category, trying multiple strategies:
 * 1. First tries to find by category name
 * 2. Falls back to category ID if name lookup fails
 * 3. Tries alternative endpoints if primary ones fail
 */
export const getProductsByCategory = async (categoryIdentifier) => {
  if (!categoryIdentifier) {
    console.warn('[API] No category identifier provided');
    return [];
  }

  const logError = (type, error) => {
    console.warn(`[API] ${type} - ${error.message}`, {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
  };

  // Try different endpoints in sequence
  const endpoints = [
    // Try direct category name match first
    {
      name: 'category-by-name',
      url: `/api/catalog/products/category/name/${encodeURIComponent(categoryIdentifier)}`,
      transform: (data) => data?.content || data || []
    },
    // Try category ID if the first attempt fails
    {
      name: 'category-by-id',
      url: `/api/catalog/categories/${categoryIdentifier}/products`,
      transform: (data) => data?.content || data || []
    },
    // Fallback to search if direct methods fail
    {
      name: 'search-by-category',
      url: `/api/catalog/products/search?category=${encodeURIComponent(categoryIdentifier)}`,
      transform: (data) => data?.content || data || []
    }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`[API] Trying endpoint: ${endpoint.name} - ${endpoint.url}`);
      const response = await axiosInstance.get(endpoint.url, {
        timeout: 10000,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      const result = endpoint.transform(response.data);
      if (result && result.length > 0) {
        console.log(`[API] Successfully fetched ${result.length} products using ${endpoint.name}`);
        return result;
      }
    } catch (error) {
      logError(`Failed ${endpoint.name}`, error);
      // Continue to next endpoint if this one fails
    }
  }

  // If all endpoints failed, try a direct search as last resort
  try {
    console.log('[API] Trying direct search as last resort');
    const allProducts = await getAllProducts();
    if (Array.isArray(allProducts)) {
      // Try to filter products by category name or ID
      const filtered = allProducts.filter(product => 
        product.categoryId?.toString() === categoryIdentifier.toString() ||
        product.category?.id?.toString() === categoryIdentifier.toString() ||
        product.category?.name?.toLowerCase() === categoryIdentifier.toString().toLowerCase()
      );
      if (filtered.length > 0) {
        return filtered;
      }
    }
  } catch (error) {
    logError('Failed direct search fallback', error);
  }

  console.warn('[API] Could not find any products for category:', categoryIdentifier);
  return [];
};

export const addProduct = async (productData) => {
    const response = await axiosInstance.post('/catalog/admin/products', productData);
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await axiosInstance.put(`/catalog/admin/products/${id}`, productData);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await axiosInstance.delete(`/catalog/admin/products/${id}`);
    return response.data;
};


// Category APIs

export const getAllCategories = async () => {
    try {
        console.log('Fetching categories from API...');
        // Gọi đúng endpoint gateway /api/categories
        const response = await axiosInstance.get('/categories', {
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
            timeout: 10000
        });
        console.log('Categories API response from /categories:', response);

        // Xử lý dữ liệu trả về
        const responseData = response?.data;
        if (!responseData) {
            console.warn('No data in categories response');
            return [];
        }

        let categories = [];
        if (Array.isArray(responseData)) {
            categories = responseData;
        } else if (responseData.content && Array.isArray(responseData.content)) {
            categories = responseData.content;
        } else if (typeof responseData === 'object') {
            categories = [responseData];
        }

        // Chuẩn hóa cấu trúc danh mục
        const processedCategories = categories.map(category => ({
            id: category.id || Math.random().toString(36).substr(2, 9),
            name: category.name || 'Unnamed Category',
            slug: category.slug || String(category.name || 'category').toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
            description: category.description || '',
            productCount: category.productCount || category.product_count || 0,
            image: category.image || null
        }));

        console.log(`Processed ${processedCategories.length} categories`);
        return processedCategories;
    } catch (error) {
        console.error('Error in getAllCategories:', {
            message: error.message,
            status: error.response?.status,
            url: error.config?.url,
            method: error.config?.method,
            response: error.response?.data
        });
        // Trả về mảng rỗng để không làm crash UI
        console.warn('Returning empty categories array due to error');
        return [];
    }
};

export const getCategoryById = async (id) => {
    try {
        console.log('Fetching category by ID from:', `/api/categories/${id}`);
        const response = await axiosInstance.get(`/api/categories/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
            timeout: 10000 // 10 seconds timeout
        });

        console.log('Category API response:', response);
        
        if (!response.data) {
            throw new Error('No data received from category API');
        }

        return response.data;
    } catch (error) {
        console.error(`Error fetching category ${id}:`, {
            message: error.message,
            status: error.response?.status,
            url: error.config?.url,
            method: error.config?.method,
            responseData: error.response?.data
        });
        throw new Error(`Không thể tải danh mục: ${error.message}`);
    }
};

export const addCategory = async (categoryData) => {
    try {
        const response = await axiosInstance.post('/api/catalog/admin/categories', categoryData);
        return response.data;
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        const response = await axiosInstance.put(`/api/catalog/admin/categories/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error(`Error updating category ${id}:`, error);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/catalog/admin/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting category ${id}:`, error);
        throw error;
    }
};

// User APIs
export const getAllUsers = async () => {
    const response = await axiosInstance.get('/accounts/users');
    return response.data;
};

export const getUserById = async (id) => {
    try {
        const response = await axiosInstance.get(`/accounts/users/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        throw error;
    }
};

export const getUserByName = async (name) => {
    const response = await axiosInstance.get(`/accounts/users?name=${name}`);
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await axiosInstance.put(`/accounts/users/${id}`, userData);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axiosInstance.delete(`/accounts/users/${id}`);
    return response.data;
};

export const addAddress = async (userId, addressData) => {
    try {
        const response = await axiosInstance.post(`/accounts/users/${userId}/addresses`, addressData);
        return response.data;
    } catch (error) {
        console.error('Error adding new address:', error);
        throw error;
    }
};

// Hàm tiện ích để xử lý cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const setCookie = (name, value, path = '/') => {
  // Xóa cookie cũ
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
  // Set cookie mới
  document.cookie = `${name}=${value}; path=${path}`;
};

// Cart APIs
export const getCart = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No authentication token found');
      throw new Error('Vui lòng đăng nhập để xem giỏ hàng');
    }

    console.log('Fetching cart with token:', token);
    
    // Lấy thông tin người dùng từ token
    let userId = '';
    let username = '';
    let decoded;
    
    try {
      // Giải mã token
      decoded = jwtDecode(token);
      console.log('Decoded token data:', decoded);
      
      // Lấy userId và username từ token
      userId = decoded.id || decoded.userId || '';
      username = decoded.sub || decoded.username || decoded.preferred_username || '';
      
      console.log('Extracted from token - username:', username, 'userId:', userId);
      
      // Nếu không có username nhưng có userId, thử gọi API lấy thông tin user
      if ((!username || username === '') && userId) {
        try {
          console.log('Trying to fetch user info from API...');
          const userInfo = await getUserById(userId);
          console.log('User info from API:', userInfo);
          
          // Cập nhật username từ API response
          if (userInfo) {
            username = userInfo.username || userInfo.userName || userInfo.email || '';
            console.log('Updated username from API:', username);
            
            // Lưu vào localStorage để dùng cho lần sau
            if (username) {
              localStorage.setItem('currentUsername', username);
            }
          }
        } catch (userErr) {
          console.error('Error fetching user info:', userErr);
          // Thử lấy từ localStorage nếu gọi API thất bại
          const savedUsername = localStorage.getItem('currentUsername');
          if (savedUsername) {
            username = savedUsername;
            console.log('Using username from localStorage:', username);
          }
        }
      } else if (username) {
        // Nếu có username từ token, lưu vào localStorage
        localStorage.setItem('currentUsername', username);
      }
    } catch (e) {
      console.error('Lỗi khi decode token:', e);
      throw new Error('Token không hợp lệ. Vui lòng đăng nhập lại.');
    }

    if (!username) {
      console.error('Không tìm thấy username trong token');
      throw new Error('Không thể xác định tên người dùng. Vui lòng đăng nhập lại.');
    }

    // Tạo danh sách các cách thử gọi API
    const attempts = [];
    
    // Thêm các cách thử dựa trên thông tin có sẵn
    if (username) {
      // Cách 1: Gọi API với username trong cả URL và header (cách tốt nhất)
      attempts.push({
        name: 'Sử dụng username trong cả URL và header',
        config: {
          url: '/shop/cart',
          method: 'get',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-Username': username
          },
          withCredentials: true,
          params: {
            username: username
          }
        }
      });

      // Cách 2: Chỉ dùng username trong URL
      attempts.push({
        name: 'Chỉ sử dụng username trong URL',
        config: {
          url: `/shop/cart?username=${encodeURIComponent(username)}`,
          method: 'get',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          withCredentials: true
        }
      });
    }
    
    // Thêm cách thử với userId nếu có
    if (userId) {
      attempts.push({
        name: 'Sử dụng userId',
        config: {
          url: '/shop/cart',
          method: 'get',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-User-Id': userId
          },
          withCredentials: true,
          params: {
            userId: userId
          }
        }
      });
    }
    
    // Thêm cách thử cuối cùng với fetch nếu cần
    if (username) {
      attempts.push({
        name: 'Sử dụng fetch với URL đầy đủ',
        fetch: true,
        url: `http://localhost:8900/api/shop/cart?username=${encodeURIComponent(username)}`,
        options: {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-Username': username
          },
          credentials: 'include'
        }
      });
    }

    // Chỉ thử 1 cách duy nhất: gọi đúng endpoint GET /shop/cart, không truyền username/userId
    try {
      const token = localStorage.getItem('authToken');
      const response = await axiosInstance.get('/shop/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error?.response?.data || error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('authToken');
        window.dispatchEvent(new Event('authChange'));
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      throw error;
    }
  } catch (error) {
    console.error('Error fetching cart:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.config?.headers
    });
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear invalid token
      localStorage.removeItem('authToken');
      window.dispatchEvent(new Event('authChange'));
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    
    throw error;
  }
}

export const addToCart = async (productId, quantity = 1) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
    // Lấy cartId từ cookie nếu có (nếu backend cần)
    let cartId = '';
    try {
      cartId = document.cookie.split('; ').find(row => row.startsWith('cartId='))?.split('=')[1] || '';
    } catch (e) {}

    const headers = {
      'Authorization': token,
      'Accept': 'application/json'
    };

    // Gửi productId, quantity qua query string (params)
    const response = await axiosInstance.post('/shop/cart', null, {
      headers,
      params: { productId, quantity },
      withCredentials: true
    });

    window.dispatchEvent(new Event('cartUpdated'));
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error, error?.response?.data);
    alert('Lỗi thêm vào giỏ hàng: ' + (error?.response?.data?.message || JSON.stringify(error?.response?.data) || error.message));
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('authToken');
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    throw error;
  }
};

export const updateCartItem = async (productId, quantity) => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  const cartId = getCookie('cartId');
  if (!cartId) {
    throw new Error('Không tìm thấy cartId');
  }

  const response = await axiosInstance.put(
    `/shop/cart?productId=${productId}&quantity=${quantity}`,
    null,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cookie': `cartId=${cartId}`
      },
      withCredentials: true
    }
  );
  return response.data;
};

export const removeFromCart = async (productId) => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  const cartId = getCookie('cartId');
  if (!cartId) {
    throw new Error('Không tìm thấy cartId');
  }

  const response = await axiosInstance.delete(
    `/shop/cart?productId=${productId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cookie': `cartId=${cartId}`
      },
      withCredentials: true
    }
  );
  return response.data;
};

// Order APIs
export const createOrder = async (userId) => {
    const response = await axiosInstance.post(`/shop/order/${userId}`);
    return response.data;
};

export const getOrder = async (orderId) => {
    const response = await axiosInstance.get(`/shop/order/${orderId}`);
    return response.data;
};

export const getAllOrders = async () => {
    const response = await axiosInstance.get('/shop/order/');
    return response.data;
};

export const getOrdersByUserName = async (userName) => {
    const response = await axiosInstance.get(`/shop/order/user?name=${userName}`);
    return response.data;
};

export const cancelOrder = async (orderId) => {
  try {
    // Thử các endpoint POST truyền thống
    const endpoints = [
      `/shop/order/${orderId}/cancel`,
      `/shop/orders/cancel/${orderId}`
    ];
    for (const endpoint of endpoints) {
      try {
        const response = await axiosInstance.post(endpoint);
        if (response?.data) return response.data;
      } catch (err) {
        if (err?.response?.status && err.response.status !== 404) throw err;
      }
    }
    // Thử PUT /shop/order/{id}/status
    try {
        console.log(`[cancelOrder] Thử PUT /shop/order/${orderId}/status với body { status: 'CANCELLED' }`);
        const putResponse1 = await axiosInstance.put(`/shop/order/${orderId}/status`, { status: "CANCELLED" });
        console.log(`[cancelOrder] Kết quả PUT /shop/order/${orderId}/status:`, putResponse1?.status, putResponse1?.data);
        if (putResponse1?.data) return putResponse1.data;
    } catch (err) {
        if (err?.response) {
            console.error(`[cancelOrder] Lỗi PUT /shop/order/${orderId}/status:`, err.response.status, err.response.data);
        } else {
            console.error(`[cancelOrder] Lỗi PUT /shop/order/${orderId}/status (không có response):`, err);
        }
    }
    // Thử PUT /shop/order/{id}
    try {
        console.log(`[cancelOrder] Thử PUT /shop/order/${orderId} với body { status: 'CANCELLED' }`);
        const putResponse2 = await axiosInstance.put(`/shop/order/${orderId}`, { status: "CANCELLED" });
        console.log(`[cancelOrder] Kết quả PUT /shop/order/${orderId}:`, putResponse2?.status, putResponse2?.data);
        if (putResponse2?.data) return putResponse2.data;
    } catch (err) {
        if (err?.response) {
            console.error(`[cancelOrder] Lỗi PUT /shop/order/${orderId}:`, err.response.status, err.response.data);
        } else {
            console.error(`[cancelOrder] Lỗi PUT /shop/order/${orderId} (không có response):`, err);
        }
    }
    throw new Error('Không thể hủy đơn hàng.');
  } catch (error) {
    console.error('Lỗi khi hủy đơn hàng:', error);
    throw error;
  }
};

export const addProductReview = async (userId, productId, rating, comment = '') => {
    const response = await axiosInstance.post(
        `/review/${userId}/recommendations/${productId}?rating=${rating}&comment=${encodeURIComponent(comment)}`
    );
    return response.data;
};

export const getProductReviews = async (productName) => {
    const response = await axiosInstance.get(`/review/recommendations?name=${encodeURIComponent(productName)}`);
    return response.data;
};

export const deleteProductReview = async (reviewId) => {
    const response = await axiosInstance.delete(`/review/recommendations/${reviewId}`);
    return response.data;
};

// Xóa đơn hàng (cho người dùng)
export const deleteOrder = async (orderId) => {
    console.log(`[deleteOrder] Bắt đầu xoá đơn hàng: ${orderId}`);
    
    // Thử DELETE /shop/order/{id}
    try {
        console.log(`[deleteOrder] Thử DELETE /shop/order/${orderId}`);
        const deleteResponse = await axiosInstance.delete(`/shop/order/${orderId}`);
        console.log(`[deleteOrder] Kết quả DELETE /shop/order/${orderId}:`, deleteResponse?.status, deleteResponse?.data);
        if (deleteResponse?.status === 204 || deleteResponse?.status === 200) {
            console.log(`[deleteOrder] Xoá thành công với DELETE /shop/order/${orderId}`);
            return deleteResponse?.data || true;
        }
    } catch (err) {
        if (err?.response) {
            console.warn(`[deleteOrder] Lỗi DELETE /shop/order/${orderId}:`, err.response.status, err.response.data);
        } else {
            console.warn(`[deleteOrder] Lỗi DELETE /shop/order/${orderId} (không có response):`, err);
        }
    }

    // Thử PUT /shop/order/{id}/status
    try {
        console.log(`[deleteOrder] Thử PUT /shop/order/${orderId}/status với body { status: 'CANCELLED' }`);
        const putResponse1 = await axiosInstance.put(`/shop/order/${orderId}/status`, { status: "CANCELLED" });
        console.log(`[deleteOrder] Kết quả PUT /shop/order/${orderId}/status:`, putResponse1?.status, putResponse1?.data);
        if (putResponse1?.status === 200 || putResponse1?.status === 204) {
            return putResponse1.data || true;
        }
    } catch (err) {
        if (err?.response) {
            console.warn(`[deleteOrder] Lỗi PUT /shop/order/${orderId}/status:`, err.response.status, err.response.data);
        } else {
            console.warn(`[deleteOrder] Lỗi PUT /shop/order/${orderId}/status (không có response):`, err);
        }
    }

    // Thử PUT /shop/order/{id}
    try {
        console.log(`[deleteOrder] Thử PUT /shop/order/${orderId} với body { status: 'CANCELLED' }`);
        const putResponse2 = await axiosInstance.put(`/shop/order/${orderId}`, { status: "CANCELLED" });
        console.log(`[deleteOrder] Kết quả PUT /shop/order/${orderId}:`, putResponse2?.status, putResponse2?.data);
        if (putResponse2?.status === 200 || putResponse2?.status === 204) {
            return putResponse2.data || true;
        }
    } catch (err) {
        if (err?.response) {
            console.warn(`[deleteOrder] Lỗi PUT /shop/order/${orderId}:`, err.response.status, err.response.data);
        } else {
            console.warn(`[deleteOrder] Lỗi PUT /shop/order/${orderId} (không có response):`, err);
        }
    }

    // Thử POST /shop/order/cancel/{id}
    try {
        console.log(`[deleteOrder] Thử POST /shop/order/cancel/${orderId}`);
        const postResponse = await axiosInstance.post(`/shop/order/cancel/${orderId}`);
        console.log(`[deleteOrder] Kết quả POST /shop/order/cancel/${orderId}:`, postResponse?.status, postResponse?.data);
        if (postResponse?.status === 200 || postResponse?.status === 204) {
            return postResponse.data || true;
        }
    } catch (err) {
        if (err?.response) {
            console.warn(`[deleteOrder] Lỗi POST /shop/order/cancel/${orderId}:`, err.response.status, err.response.data);
        } else {
            console.warn(`[deleteOrder] Lỗi POST /shop/order/cancel/${orderId} (không có response):`, err);
        }
    }

    // Nếu tất cả đều thất bại
    const errorMsg = `[deleteOrder] Không thể xoá/huỷ đơn hàng ${orderId} bằng bất kỳ phương án nào!`;
    console.error(errorMsg);
    throw new Error(errorMsg);
};

// Tính trung bình đánh giá
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};

// Auth APIs
export const LOGIN = async (credentials, role) => {
    try {
        const requestBody = { ...credentials };
        if (role) {
            requestBody.role = role;
        }
        const response = await axiosInstance.post('/auth/login', requestBody);
        return response.data;
    } catch (error) {
        console.error('Lỗi đăng nhập:', error.response?.data || error.message);
        throw error;
    }
};

export const REGISTER = async (userData) => {
    try {
        const response = await axiosInstance.post('/accounts/users', userData);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const LOGOUT = async () => {
    try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('rememberedEmail');
        await axiosInstance.post('/auth/logout');
        window.location.href = '/login';
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('rememberedEmail');
        window.location.href = '/login';
        throw error;
    }
};

// Get current authenticated user (via token or API)
export const getAuthUser = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  try {
    // Gửi kèm header Authorization nếu có token
    const response = await axiosInstance.get('/accounts/users/me', {
      headers: { Authorization: 'Bearer ' + token }
    });
    return response.data;
  } catch (err) {
    // Nếu lỗi xác thực (400/401/403) thì tự động xóa token và trả về null
    if (err.response && [400, 401, 403].includes(err.response.status)) {
      localStorage.removeItem('authToken');
      return null;
    }
    // Fallback: decode token locally (nếu backend không hỗ trợ /me)
    try {
      const { jwtDecode } = await import('jwt-decode');
      const decoded = jwtDecode(token);
      return { userName: decoded?.sub };
    } catch (e) {
      console.error('getAuthUser fallback decode error', e);
      localStorage.removeItem('authToken');
      return null;
    }
  }
};

export const searchProducts = async (params = {}) => {
  try {
    const searchParams = new URLSearchParams();
    if (params.name) searchParams.append('name', params.name);
    if (params.categoryId || params.category) searchParams.append('categoryId', params.categoryId || params.category);
    if (params.minPrice) searchParams.append('minPrice', params.minPrice);
    if (params.maxPrice) searchParams.append('maxPrice', params.maxPrice);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection);
    if (params.page) searchParams.append('page', params.page);
    if (params.size) searchParams.append('size', params.size);

    const response = await axiosInstance.get(`/catalog/products/search?${searchParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export const getSearchSuggestions = async (query) => {
  try {
    const response = await axiosInstance.get(`/api/catalog/products/search/suggestions?q=${encodeURIComponent(query)}`);
    return response.data || [];
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return [];
  }
};