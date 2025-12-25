import { Create, Datagrid, DeleteButton, Edit, List, NumberField, NumberInput, SimpleForm, TextField, TextInput, useRecordContext, useNotify, useRedirect, required, minValue, minLength, ReferenceInput, SelectInput, ReferenceField, useRefresh, useDataProvider } from "react-admin";
import {Link as RouterLink} from "react-router-dom";
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import { useParams } from "react-router-dom";

const CustomEditButton = () => {
    const record = useRecordContext();
    const navigate = useNavigate();

    const handleEdit = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (record) {
            console.log('Edit button clicked for product:', record.id);
            navigate(`/products/${record.id}/edit`);
        }
    };

    return (
        <Button onClick={handleEdit} variant="contained" color="primary">
            Sửa
        </Button>
    );
};

const CustomImageField = ({ source }:{source:string}) => {
    const record = useRecordContext();
 
    if (!record || !record[source]) {
        return <span>Không có hình ảnh</span>;
    }
   console.log('Record:', record);
   // Sử dụng trực tiếp tên file từ imageUrl
   const imageUrl = `http://localhost:8900/api/catalog/images/${record[source]}`;
   
   return (
    <RouterLink to={`/products/${record.id}/update-image`}>
        <img src={imageUrl} alt={record.productName} style={{ width: '100px', height: 'auto' }} />
    </RouterLink>
   );
};

const postFilters = [
    <TextInput key="search" source="productName" label="Tìm kiếm theo tên" alwaysOn />,
    <TextInput key="category" source="category" label="Danh mục" />
];

export const ProductList = () => (
    <List filters={postFilters}>
        <Datagrid rowClick="edit">
            <TextField source="id" label="ID" />
            <TextField source="productName" label="Tên sản phẩm" />
            <ReferenceField source="categoryId" reference="categories" label="Danh mục">
                <TextField source="name" />
            </ReferenceField>
            <CustomImageField source="imageUrl" />
            <TextField source="description" label="Mô tả" />
            <NumberField source="availability" label="Số lượng" />
            <NumberField source="price" label="Giá" options={{ style: 'currency', currency: 'VND' }}/>
            <CustomEditButton />
            <CustomDeleteButton />
        </Datagrid>
    </List>
);

import { canDeleteProduct } from '../dataProvider';

const CustomDeleteButton = () => {
    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    const handleDelete = async (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!record) return;
        try {
            // Gọi hàm kiểm tra có thể xoá sản phẩm
            const canDelete = await canDeleteProduct(record.id);
            if (!canDelete) {
                notify('Không thể xóa: sản phẩm đã được đặt hàng hoặc đang sử dụng', { type: 'warning' });
                return;
            }
            await dataProvider.delete('products', { id: record.id });
            notify('Đã xóa sản phẩm', { type: 'success' });
            refresh();
        } catch (error) {
            notify('Lỗi khi xóa sản phẩm', { type: 'error' });
        }
    };

    return (
        <Button variant="contained" color="error" onClick={handleDelete}>
            Xóa
        </Button>
    );
};

export const ProductCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    
    const transform = (data: any) => {
        if (!imageFile) {
            throw new Error('Vui lòng chọn hình ảnh sản phẩm');
        }
        return {
            ...data,
            image: {
                rawFile: imageFile
            },
            categoryId: data.categoryId ? Number(data.categoryId) : undefined,
            category: undefined
        };
    };

    const onSuccess = () => {
        notify('Thêm sản phẩm thành công');
        redirect('list', 'products');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            const file = files[0];
            if (file.size > 5 * 1024 * 1024) { // 5MB
                alert('Kích thước file không được vượt quá 5MB');
                return;
            }
            
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                alert('Chỉ chấp nhận file JPG, PNG hoặc GIF');
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            if (fileInputRef.current) {
                fileInputRef.current.files = files;
                const event = new Event('change', { bubbles: true });
                fileInputRef.current.dispatchEvent(event);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const ImageInput = () => (
        <div style={{ marginBottom: '1rem' }}>
            <label 
                htmlFor="product-image-input"
                style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    fontWeight: 'bold',
                    color: '#666'
                }}
            >
                Hình ảnh sản phẩm *
            </label>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                    border: '2px dashed #ccc',
                    padding: '20px',
                    borderRadius: '4px',
                    textAlign: 'center',
                    backgroundColor: '#fafafa',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginBottom: '10px'
                }}
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        fileInputRef.current?.click();
                    }
                }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="product-image-input"
                    name="product-image"
                    aria-label="Chọn hình ảnh sản phẩm"
                />
                {!imageFile ? (
                    <>
                        <div style={{ 
                            fontSize: '40px', 
                            color: '#999',
                            marginBottom: '10px' 
                        }}>
                            +
                        </div>
                        <div style={{ color: '#666' }}>
                            Click hoặc kéo thả hình ảnh vào đây
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ 
                            color: 'green',
                            margin: '0 0 10px 0',
                            fontSize: '0.9em'
                        }}>
                            ✓ Đã chọn: {imageFile.name}
                        </p>
                        {imagePreview && (
                            <img 
                                src={imagePreview} 
                                alt={`Preview của ${imageFile.name}`}
                                style={{ 
                                    maxWidth: '200px', 
                                    maxHeight: '200px',
                                    objectFit: 'contain',
                                    margin: '0 auto',
                                    display: 'block',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }} 
                            />
                        )}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage();
                            }}
                            style={{
                                marginTop: '10px',
                                padding: '5px 10px',
                                border: '1px solid #ff4444',
                                borderRadius: '4px',
                                backgroundColor: 'white',
                                color: '#ff4444',
                                cursor: 'pointer'
                            }}
                            aria-label="Xóa hình ảnh đã chọn"
                        >
                            Xóa hình ảnh
                        </button>
                    </div>
                )}
            </div>
            {!imageFile && (
                <p style={{ 
                    color: '#666', 
                    fontSize: '0.8em',
                    margin: '5px 0 0 0' 
                }}>
                    Chấp nhận các định dạng: JPG, PNG, GIF (tối đa 5MB)
                </p>
            )}
        </div>
    );

    return (
        <Create mutationOptions={{ onSuccess }} transform={transform}>
            <SimpleForm>
                <TextInput 
                    source="productName" 
                    label="Tên sản phẩm" 
                    validate={[required(), minLength(3)]}
                />
                <TextInput 
                    source="description" 
                    label="Mô tả" 
                    multiline 
                    rows={3}
                    validate={[required(), minLength(6)]}
                />
                <ReferenceInput source="categoryId" reference="categories" label="Danh mục">
                    <SelectInput optionText="name" optionValue="id" validate={required()} parse={(v: any) => v ? Number(v) : undefined} />
                </ReferenceInput>
                <TextInput
                    source="availability"
                    label="Số lượng"
                    type="number"
                    validate={[required(), minValue(0)]}
                />
                <TextInput
                    source="price"
                    label="Giá"
                    type="number"
                    validate={[required(), minValue(0)]}
                />
                <ImageInput />
            </SimpleForm>
        </Create>
    );
};

export const ProductEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { id } = useParams();
    const record = useRecordContext();

    console.log('ProductEdit rendered with record:', record, 'id from params:', id);

    const handleSubmit = async (values: any) => {
        console.log('Form submitted with values:', values);
        try {
            const formData = new FormData();
            
            // Sử dụng id từ useParams
            formData.append('id', String(id));

            // Thêm các trường dữ liệu
            formData.append('productName', String(values.productName || ''));
            formData.append('price', String(values.price || 0));
            formData.append('description', String(values.description || ''));
            if (values.categoryId != null) {
                formData.append('categoryId', String(values.categoryId));
            }
            formData.append('availability', String(values.availability || 0));

            // Thêm file ảnh nếu có
            if (imageFile) {
                formData.append('image', imageFile);
            }

            // Log FormData content
            const formDataEntries: Record<string, any> = {};
            formData.forEach((value, key) => {
                formDataEntries[key] = value instanceof File ? value.name : value;
            });
            console.log('FormData entries:', formDataEntries);

            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8900/api/catalog/admin/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Server error response:', errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Update success:', result);
            notify('Cập nhật sản phẩm thành công', { type: 'success' });
            redirect('list', 'products');
        } catch (error) {
            console.error('Update error:', error);
            notify('Có lỗi xảy ra khi cập nhật sản phẩm', { type: 'error' });
        }
    };

    const validateImage = (file: File) => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        
        if (!allowedTypes.includes(file.type)) {
            return 'Chỉ chấp nhận file ảnh JPG, PNG hoặc GIF';
        }
        if (file.size > maxSize) {
            return 'Kích thước file không được vượt quá 5MB';
        }
        return undefined;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            const file = files[0];
            const error = validateImage(file);
            if (error) {
                notify(error, { type: 'error' });
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            const file = files[0];
            const error = validateImage(file);
            if (error) {
                notify(error, { type: 'error' });
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    // Load hình ảnh hiện tại khi component mount
    React.useEffect(() => {
        if (record?.imageUrl) {
            setImagePreview(`http://localhost:8900/api/catalog/images/${record.imageUrl}`);
        }
    }, [record]);

    const ImageUploadField = () => (
        <div>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                    border: '2px dashed #ccc',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginBottom: '10px'
                }}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
            >
                {imagePreview ? (
                    <div>
                        <img 
                            src={imagePreview} 
                            alt="Preview" 
                            style={{ maxWidth: '200px', maxHeight: '200px', marginBottom: '10px' }} 
                        />
                        <p>Click hoặc kéo thả để thay đổi hình ảnh</p>
                    </div>
                ) : (
                    <p>Kéo thả hình ảnh vào đây hoặc click để chọn file</p>
                )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
        </div>
    );

    return (
        <Edit>
            <SimpleForm onSubmit={handleSubmit}>
                <TextInput source="productName" label="Tên sản phẩm" validate={required()} />
                <TextInput source="price" label="Giá" type="number" validate={[required(), minValue(0)]} />
                <TextInput source="description" label="Mô tả" validate={required()} multiline rows={3} />
                <ReferenceInput source="categoryId" reference="categories" label="Danh mục">
                    <SelectInput optionText="name" optionValue="id" validate={required()} parse={(v: any) => v ? Number(v) : undefined} />
                </ReferenceInput>
                <TextInput source="availability" label="Số lượng" type="number" validate={[required(), minValue(0)]} />
                <ImageUploadField />
            </SimpleForm>
        </Edit>
    );
};
