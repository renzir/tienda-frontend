export interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad_disponible: number;
   cantidad?: number;
}

export interface Order{
    id: number;
    fecha: string;
    datos_usuario: string;
    direccion: string;
    estado: 'pendiente' | 'confirmado' | 'cancelado'; 
}

export interface CreateOrderDTO {
    dato_usuario: string;
    direccion: string;
}
export interface ApiResponse {
  success: boolean
  data: Product[]
}