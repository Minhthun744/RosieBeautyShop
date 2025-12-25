import { List, Datagrid, TextField, DeleteButton, EditButton, Create, Edit, SimpleForm, TextInput, BooleanInput, required } from "react-admin";

export const CategoryList = (props: any) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" label="ID" />
            <TextField source="name" label="Tên danh mục" />
            <TextField source="description" label="Mô tả" />
            <TextField source="active" label="Kích hoạt" />
            <EditButton />
            <DeleteButton onError={(error: any) => {
    // Nếu backend trả về lỗi "Không thể xoá category vì đã có sản phẩm..."
    // hoặc mã lỗi liên quan, thì hiển thị thông báo tiếng Việt
    const msg = error?.body?.message || error?.message || '';
    // Nếu là lỗi 500 (thường là do backend chặn xoá khi có sản phẩm)
    if (
        msg.includes('Không thể xoá category') ||
        msg.includes('danh mục') ||
        msg.includes('sản phẩm') ||
        msg.includes('Request failed with status code 500') ||
        error?.status === 500
    ) {
        // eslint-disable-next-line no-undef
        window?.notify?.(
            'Không thể xoá danh mục này vì đã có sản phẩm thuộc danh mục!',
            'warning'
        );
    } else {
        // eslint-disable-next-line no-undef
        window?.notify?.(
            'Xoá danh mục thất bại!',
            'error'
        );
    }
}} />
        </Datagrid>
    </List>
);

export const CategoryCreate = (props: any) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" label="Tên danh mục" validate={[required()]} fullWidth />
            <TextInput source="description" label="Mô tả" fullWidth multiline rows={3} />
            <BooleanInput source="active" label="Kích hoạt" defaultValue={true} />
        </SimpleForm>
    </Create>
);

export const CategoryEdit = (props: any) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" label="Tên danh mục" validate={[required()]} fullWidth />
            <TextInput source="description" label="Mô tả" fullWidth multiline rows={3} />
            <BooleanInput source="active" label="Kích hoạt" />
        </SimpleForm>
    </Edit>
);