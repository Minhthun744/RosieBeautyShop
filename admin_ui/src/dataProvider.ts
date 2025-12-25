import axios from 'axios';
import {
    CreateParams, DataProvider, DeleteManyParams, DeleteParams,
    GetListParams, GetManyParams, GetManyReferenceParams, GetOneParams,
    Identifier, UpdateManyParams, UpdateParams
} from 'react-admin';

const apiUrl = 'http://localhost:8900/api';

// Cấu hình mặc định cho axios
axios.defaults.withCredentials = true;

const httpClient = {
    get: (url: string) => {
        const token = localStorage.getItem('token');
        console.log('Making request to:', url);
        
        return axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
        .then(response => ({ json: { data: response.data } }))
        .catch(error => {
            console.error('Request failed:', error.response || error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return Promise.reject(error);
            }
            throw error;
        });
    },

    post: (url: string, data: any) => {
        const token = localStorage.getItem('token');
        const headers: any = {
            'Authorization': `Bearer ${token}`,
        };

        // Chỉ thêm Content-Type nếu không phải FormData
        if (!(data instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }
        
        return axios.post(url, data, {
            headers,
            withCredentials: true
        })
        .then(response => ({ json: { data: response.data } }))
        .catch(error => {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            throw error;
        });
    },

    put: (url: string, data: any) => {
        const token = localStorage.getItem('token');
        const headers: any = {
            'Authorization': `Bearer ${token}`,
        };

        // Nếu là FormData, đảm bảo không set Content-Type để browser tự thêm boundary
        if (!(data instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        console.log('PUT request:', {
            url,
            data: data instanceof FormData ? 'FormData' : data,
            headers
        });

        return axios.put(url, data, {
            headers,
            withCredentials: true
        })
        .then(response => {
            console.log('PUT response:', response.data);
            return { json: { data: response.data } };
        })
        .catch(error => {
            console.error('PUT error:', error.response || error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            throw error;
        });
    },

    delete: (url: string) => {
        const token = localStorage.getItem('token');

        return axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
        .then(response => ({ json: { data: response.data } }))
        .catch(error => {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            throw error;
        });
    }
};

// Hàm kiểm tra có thể xoá sản phẩm (gọi API backend)
export const canDeleteProduct = async (productId: number): Promise<boolean> => {
    const token = localStorage.getItem('token');
    const url = `${apiUrl}/catalog/admin/products/${productId}/can-delete`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        });
        return response.data === true || response.data === 'true';
    } catch (error) {
        console.error('Lỗi kiểm tra có thể xoá sản phẩm:', error);
        return false;
    }
};

export const dataProvider: DataProvider = {
    getList: (resource: string, params: GetListParams) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        
        let url = `${apiUrl}`;
        
        // Xử lý các resource khác nhau
        switch(resource) {
            case 'products':
                url += '/catalog/products';
                break;
            case 'users':
                url += '/accounts/users';
                break;
            case 'orders':
                url += '/shop/order';
                break;
            case 'reviews':
                url += '/review/recommendations';
                break;
            case 'categories':
                url += '/categories';
                break;
            default:
                url += `/${resource}`;
        }

        // Thêm query parameters nếu cần
        if (params.filter && params.filter.name) {
            url += `?name=${params.filter.name}`;
        }

        return httpClient.get(url)
            .then(({ json }) => ({
                data: json.data,
                total: json.data.length // hoặc json.total nếu API trả về tổng số
            }));
    },

    getOne: (resource: string, params: GetOneParams) => {
        let url = `${apiUrl}`;
        
        switch(resource) {
            case 'products':
                url += `/catalog/products/${params.id}`;
                break;
            case 'users':
                url += `/accounts/users/${params.id}`;
                break;
            case 'orders':
                url += `/shop/order/${params.id}`;
                break;
            case 'categories':
                url += `/categories/${params.id}`;
                break;
            default:
                url += `/${resource}/${params.id}`;
        }

        return httpClient.get(url)
            .then(({ json }) => ({
                data: json.data,
            }));
    },

    create: (resource: string, params: CreateParams) => {
        let url = `${apiUrl}`;
        
        // Xử lý URL đặc biệt cho từng resource
        switch(resource) {
            case 'products':
                url += '/catalog/admin/products';
                break;
            case 'users':
                url += '/accounts/users';
                break;
            case 'categories':
                url += '/categories';
                break;
            default:
                url += `/${resource}`;
        }
        
        if (resource === 'products' && params.data.image) {
            const formData = new FormData();
            const { image, ...productData } = params.data;
            
            // Thêm file hình ảnh vào FormData
            if (image.rawFile) {
                formData.append('image', image.rawFile);
            }
            
            // Thêm các trường dữ liệu sản phẩm (bỏ qua undefined/null)
            Object.entries(productData).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    formData.append(key, String(value));
                }
            });

            return httpClient.post(url, formData)
                .then(({ json }) => ({ data: json.data }));
        }

        return httpClient.post(url, params.data)
            .then(({ json }) => ({ data: json.data }));
    },

    update: (resource: string, params: UpdateParams) => {
        const url = `${apiUrl}/${resource === 'products' ? 'catalog/admin/products' : resource}/${params.id}`;
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {
            'Authorization': `Bearer ${token}`,
        };
        if (!(params.data instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }
        return fetch(url, {
            method: 'PUT',
            headers: headers,
            body: params.data instanceof FormData ? params.data : JSON.stringify(params.data),
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(json => ({ data: json }))
        .catch(error => {
            throw error;
        });
    },

    delete: (resource: string, params: DeleteParams) => {
        let url = `${apiUrl}`;
        
        switch(resource) {
            case 'products':
                url += `/catalog/admin/products/${params.id}`;
                break;
            case 'users':
                url += `/accounts/users/${params.id}`;
                break;
            case 'reviews':
                url += `/review/recommendations/${params.id}`;
                break;
            case 'categories':
                url += `/categories/${params.id}`;
                break;
            default:
                url += `/${resource}/${params.id}`;
        }

        return httpClient.delete(url)
            .then(({ json }) => ({ data: json.data }));
    },

    deleteMany: (resource: string, params: DeleteManyParams) => {
        const promises = params.ids.map(id => 
            dataProvider.delete(resource, { id: id as Identifier })
        );
        return Promise.all(promises)
            .then(() => ({ data: params.ids }));
    },

    getMany: (resource: string, params: GetManyParams) => {
        const promises = params.ids.map(id => 
            dataProvider.getOne(resource, { id: id as Identifier })
        );
        return Promise.all(promises)
            .then(responses => ({
                data: responses.map(response => response.data),
            }));
    },

    getManyReference: (resource: string, params: GetManyReferenceParams) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        
        let url = `${apiUrl}/${resource}?${params.target}=${params.id}`;
        return httpClient.get(url)
            .then(({ json }) => ({
                data: json.data,
                total: json.data.length
            }));
    },

    updateMany: (resource: string, params: UpdateManyParams) => {
        const promises = params.ids.map(id => 
            dataProvider.update(resource, { 
                id: id as Identifier, 
                data: params.data,
            })
        );
        return Promise.all(promises)
            .then(() => ({ data: params.ids }));
    },
};
