import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const productSchema = z.object({
    id: z.number().describe('Product ID'),
    name: z.string().describe('Product Name'),
    price: z.number().describe('Product Price'),
    description: z.string().describe('Product Description'),
});

const products: z.infer<typeof productSchema>[] = [
    { id: 1, name: 'gold benefit', price: 1000, description: 'Gold benefit package' },
    { id: 2, name: 'gold happy', price: 1200, description: 'Gold happy package' },
    { id: 3, name: 'ultra', price: 10000, description: 'Ultra package' },
];

export const productList = createTool({
    id: 'product_list',
    description: 'List Product',
    outputSchema: z.object({
        products: z.array(productSchema).describe('Product List'),
    }),
    execute: async () => {
        return { products };
    },
});

export const productDetail = createTool({
    id: 'product_detail',
    description: 'Get Product Detail by ID',
    inputSchema: z.object({
        id: z.number().describe('Product ID'),
    }),
    outputSchema: z.object({
        product: productSchema.nullable().describe('Product Detail'),
        message: z.string().describe('Message'),
    }),
    execute: async ({ id }) => {
        const product = products.find((p) => p.id === id);
        if (!product) return {
            product: null,
            message: "product not found"
        }
        return {
            product,
            message: "success get product"
        }
    },
});
