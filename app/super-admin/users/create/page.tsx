import React from 'react';
import { useForm } from 'react-hook-form';

const UserCreationForm = ({ userRole }) => {
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        // handle submission logic
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Email:</label>
                <input type="email" {...register('email')} required />
            </div>
            <div>
                <label>Full Name:</label>
                <input type="text" {...register('fullname')} required />
            </div>
            <div>
                <label>Phone Number:</label>
                <input type="tel" {...register('numtel')} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" {...register('password')} required />
            </div>
            <div>
                <label>Role:</label>
                <select {...register('role')}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                </select>
            </div>
            {userRole === 'super_admin' && (
                <div>
                    <label>Company ID:</label>
                    <input type="text" {...register('companyId')} />
                </div>
            )}
            <input type="submit" value="Create User" />
        </form>
    );
};

export default UserCreationForm;