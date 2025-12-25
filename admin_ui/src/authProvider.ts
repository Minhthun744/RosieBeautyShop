import axios from 'axios';

interface LoginParams {
    username: string;
    password: string;
}

interface CheckParamsErr {
    status: number;
}

interface UserData {
    userName: string;
    id: number;
    email?: string;
    roles?: string[];
}

export const authProvider = {
    // Được gọi khi người dùng đăng nhập
    login: async ({ username, password }: LoginParams) => {
        try {
            // Gọi API đăng nhập
            const response = await axios.post('http://localhost:8900/api/auth/login', {
                userName: username,
                password: password,
            });

            console.log('Login response:', response.data);

            if (response.data.authToken) {
                const token = response.data.authToken;
                
                try {
                    // Lấy payload từ token
                    const payloadBase64 = token.split('.')[1];
                    // Thêm padding nếu cần thiết
                    const padded = payloadBase64.padEnd(payloadBase64.length + (4 - payloadBase64.length % 4) % 4, '=');
                    const decodedPayload = JSON.parse(atob(padded));
                    
                    // Lấy role từ token (kiểm tra cả 'role' và 'roles')
                    let roles: string[] = [];
                    if (decodedPayload.role) {
                        roles = Array.isArray(decodedPayload.role) 
                            ? decodedPayload.role 
                            : [decodedPayload.role];
                    } else if (decodedPayload.roles) {
                        roles = Array.isArray(decodedPayload.roles) 
                            ? decodedPayload.roles 
                            : [decodedPayload.roles];
                    } else if (decodedPayload.authorities) {
                        roles = Array.isArray(decodedPayload.authorities)
                            ? decodedPayload.authorities
                            : [decodedPayload.authorities];
                    }

                    console.log('Decoded JWT payload:', decodedPayload);
                    console.log('User roles:', roles);

                    // Kiểm tra quyền ADMIN (chấp nhận nhiều định dạng role)
                    const isAdmin = roles.some(role => 
                        String(role).toUpperCase() === 'ROLE_ADMIN' || 
                        String(role).toUpperCase() === 'ADMIN' ||
                        String(role).toUpperCase() === 'ROLE_ADMINISTRATOR' ||
                        String(role).toUpperCase() === 'ADMINISTRATOR'
                    );

                    if (!isAdmin) {
                        return Promise.reject(
                            new Error("Tài khoản của bạn không có quyền truy cập trang quản trị")
                        );
                    }


                    // Lưu thông tin người dùng vào localStorage
                    const userData: UserData = {
                        userName: response.data.userName || username,
                        id: response.data.id,
                        email: response.data.email,
                        roles: roles
                    };

                    localStorage.setItem("user", JSON.stringify(userData));
                    localStorage.setItem("token", token);
                    localStorage.setItem("roles", JSON.stringify(roles));

                    return Promise.resolve();
                } catch (e) {
                    console.error('Lỗi khi xử lý token:', e);
                    return Promise.reject(
                        new Error("Có lỗi xảy ra khi xử lý thông tin đăng nhập")
                    );
                }
            } else {
                return Promise.reject(
                    new Error("Không nhận được thông tin xác thực từ máy chủ")
                );
            }
        } catch (error: any) {
            console.error('Lỗi đăng nhập:', error);
            
            if (error.response) {
                // Xử lý lỗi từ server
                const errorMessage = error.response.data?.message || 
                                   error.response.data?.error || 
                                   "Tên đăng nhập hoặc mật khẩu không đúng";
                return Promise.reject(new Error(errorMessage));
            } else if (error.request) {
                // Không nhận được phản hồi từ server
                return Promise.reject(
                    new Error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.")
                );
            } else {
                // Lỗi khi thiết lập request
                return Promise.reject(
                    new Error("Có lỗi xảy ra khi gửi yêu cầu đăng nhập")
                );
            }
        }
    },

    // Được gọi khi người dùng đăng xuất
    logout: () => {
        // Xóa tất cả dữ liệu người dùng khỏi localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        return Promise.resolve();
    },

    // Được gọi khi có lỗi từ API
    checkError: ({ status }: CheckParamsErr) => {
        if (status === 401 || status === 403) {
            // Tự động đăng xuất nếu nhận được lỗi 401 hoặc 403
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("roles");
            return Promise.reject();
        }
        return Promise.resolve();
    },

    // Kiểm tra xác thực khi điều hướng
    checkAuth: () => {
        const token = localStorage.getItem("token");
        const roles = localStorage.getItem("roles");
        
        if (!token) {
            return Promise.reject();
        }
        
        // Kiểm tra thêm xem có phải admin không
        try {
            if (roles) {
                const userRoles = JSON.parse(roles);
                const isAdmin = userRoles.some((role: string) => 
                    role === 'ROLE_ADMIN' || 
                    role === 'ADMIN' ||
                    role === 'ROLE_ADMINISTRATOR' ||
                    role === 'ADMINISTRATOR'
                );
                
                if (!isAdmin) {
                    localStorage.clear();
                    return Promise.reject();
                }
            }
            
            return Promise.resolve();
        } catch (e) {
            console.error('Lỗi khi kiểm tra quyền:', e);
            localStorage.clear();
            return Promise.reject();
        }
    },

    // Lấy thông tin quyền hạn
    getPermissions: () => {
        const roles = localStorage.getItem("roles");
        if (!roles) {
            return Promise.reject(new Error("Không tìm thấy thông tin quyền hạn"));
        }
        
        try {
            const userRoles = JSON.parse(roles);
            return Promise.resolve(userRoles);
        } catch (e) {
            console.error('Lỗi khi đọc thông tin quyền hạn:', e);
            return Promise.reject(e);
        }
    },

    // Lấy thông tin người dùng hiện tại
    getIdentity: () => {
        try {
            const user = localStorage.getItem("user");
            if (!user) {
                return Promise.reject();
            }
            return Promise.resolve(JSON.parse(user));
        } catch (e) {
            console.error('Lỗi khi lấy thông tin người dùng:', e);
            return Promise.reject(e);
        }
    }
};