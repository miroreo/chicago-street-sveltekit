import { error } from '@sveltejs/kit';

export const GET = async ({ url }) => {
    const includeUnnamed = url.searchParams.get('includeUnnamed') === 'true';
    const includeExpressWays = url.searchParams.get('includeExpressWays') === 'true';
    return {
        status: 200,
        bodyUsed: false,
        ok: true
    }
}