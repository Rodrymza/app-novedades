import { Types } from 'mongoose';
import { ErrorResponse } from './error.interfaces';

export interface CreateUserBody {
    apellido: string;
    nombre: string;
    username: string;
    email: string;
    password: string
    rol?: 'OPERADOR' | 'SUPERVISOR';
}

export interface UserResponse {
    _id : Types.ObjectId;
    apellido: string;
    nombre : string;
    username: string;
    email: string;
    rol: 'OPERADOR' | 'SUPERVISOR';
}

export type UserResponseData = UserResponse | ErrorResponse;